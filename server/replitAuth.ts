import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    const issuerUrl = process.env.ISSUER_URL ?? "https://replit.com/oidc";
    console.log("OIDC Config - Issuer URL:", issuerUrl, "Client ID:", process.env.REPL_ID);
    
    try {
      const config = await client.discovery(
        new URL(issuerUrl),
        process.env.REPL_ID!
      );
      console.log("OIDC discovery successful");
      return config;
    } catch (error) {
      console.error("OIDC discovery failed:", error);
      throw error;
    }
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    try {
      const user = {};
      updateUserSession(user, tokens);
      console.log("Auth claims:", tokens.claims());
      await upsertUser(tokens.claims());
      console.log("User upserted successfully");
      verified(null, user);
    } catch (error) {
      console.error("Auth verification error:", error);
      verified(error);
    }
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    console.log("Setting up auth strategy for domain:", domain);
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
    console.log("Auth strategy registered for:", domain);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", async (req, res, next) => {
    const hostname = req.hostname;
    const domains = process.env.REPLIT_DOMAINS!.split(",");
    const targetDomain = domains[0];
    
    console.log("Login attempt - hostname:", hostname, "domains:", domains, "using domain:", targetDomain);
    
    try {
      // Manual auth URL construction for debugging
      const authUrl = client.buildAuthorizationUrl(config, {
        scope: "openid email profile offline_access",
        redirect_uri: `https://${targetDomain}/api/callback`,
        response_type: "code",
        client_id: process.env.REPL_ID!,
        prompt: "login consent"
      });
      
      console.log("Manual auth URL:", authUrl.href);
      
      // Test: redirect directly to manual auth URL instead of using passport
      console.log("Redirecting to manual auth URL for testing...");
      return res.redirect(authUrl.href);
      
      // Try passport authentication
      passport.authenticate(`replitauth:${targetDomain}`, {
        prompt: "login consent", 
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    } catch (error) {
      console.error("Login authentication error:", error);
      res.status(500).json({ error: "Authentication failed", details: error.message });
    }
  });

  app.get("/api/callback", (req, res, next) => {
    const hostname = req.hostname;
    const domains = process.env.REPLIT_DOMAINS!.split(",");
    const targetDomain = domains[0]; // Always use the first (and only) domain
    
    console.log("Callback received - hostname:", hostname, "domains:", domains, "using domain:", targetDomain);
    
    try {
      passport.authenticate(`replitauth:${targetDomain}`, {
        successReturnToOrRedirect: "/",
        failureRedirect: "/api/login",
        failureFlash: false
      })(req, res, next);
    } catch (error) {
      console.error("Callback authentication error:", error);
      res.redirect("/api/login");
    }
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;
  console.log("Auth check - isAuthenticated:", req.isAuthenticated(), "user:", !!user);

  if (!req.isAuthenticated() || !user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!user.expires_at) {
    return res.status(401).json({ message: "Unauthorized - missing expires_at" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
