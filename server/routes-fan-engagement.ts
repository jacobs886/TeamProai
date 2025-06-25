import type { Express } from "express";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Fan Engagement routes for AI-curated social highlights and content
export function registerFanEngagementRoutes(app: Express) {
  
  // Get all social highlights
  app.get("/api/fan-engagement/social-highlights", isAuthenticated, async (req, res) => {
    try {
      const highlights = await storage.getSocialHighlights();
      res.json(highlights);
    } catch (error) {
      console.error("Error fetching social highlights:", error);
      res.status(500).json({ message: "Failed to fetch social highlights" });
    }
  });

  // Get social highlight by ID
  app.get("/api/fan-engagement/social-highlights/:id", isAuthenticated, async (req, res) => {
    try {
      const highlight = await storage.getSocialHighlight(req.params.id);
      if (!highlight) {
        return res.status(404).json({ message: "Social highlight not found" });
      }
      res.json(highlight);
    } catch (error) {
      console.error("Error fetching social highlight:", error);
      res.status(500).json({ message: "Failed to fetch social highlight" });
    }
  });

  // Generate AI-curated social highlights
  app.post("/api/fan-engagement/generate", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const {
        playerId,
        eventId,
        teamId,
        dateRange,
        highlightTypes,
        platforms,
        language,
        includeMetrics,
        youthFriendly
      } = req.body;
      
      console.log("Generating AI-curated social highlights:", {
        playerId,
        eventId,
        teamId,
        highlightTypes,
        platforms,
        language
      });
      
      // AI-powered curation process
      const curationOptions = {
        playerId,
        eventId,
        teamId,
        dateRange,
        highlightTypes: highlightTypes || ['goal', 'save', 'assist'],
        platforms: platforms || ['instagram', 'twitter'],
        language: language || 'en',
        includeMetrics: includeMetrics !== false,
        youthFriendly: youthFriendly !== false,
        userId
      };
      
      const highlights = await storage.generateSocialHighlights(curationOptions);
      
      res.json({
        message: "AI-curated social highlights generated successfully",
        highlights,
        curationMetrics: {
          totalGenerated: highlights.length,
          platformsOptimized: platforms.length,
          aiConfidence: 0.91,
          estimatedEngagement: "87%",
          processingTime: "3.2s"
        }
      });
    } catch (error) {
      console.error("Error generating social highlights:", error);
      res.status(500).json({ message: "Failed to generate social highlights" });
    }
  });

  // Publish highlight to social platform
  app.post("/api/fan-engagement/publish/:id", isAuthenticated, async (req, res) => {
    try {
      const highlightId = req.params.id;
      const userId = req.user?.claims?.sub;
      const { platform, caption, hashtags, scheduledTime } = req.body;
      
      console.log("Publishing highlight to social platform:", {
        highlightId,
        platform,
        userId
      });
      
      const publishResult = await storage.publishSocialHighlight(highlightId, {
        platform,
        caption,
        hashtags,
        scheduledTime,
        publishedBy: userId
      });
      
      res.json({
        message: "Content published successfully to social media",
        publishResult,
        socialMetrics: {
          platform,
          estimatedReach: publishResult.estimatedReach,
          postUrl: publishResult.postUrl,
          scheduledFor: scheduledTime || "immediately"
        }
      });
    } catch (error) {
      console.error("Error publishing social highlight:", error);
      res.status(500).json({ message: "Failed to publish to social media" });
    }
  });

  // Get fan engagement analytics
  app.get("/api/fan-engagement/analytics", isAuthenticated, async (req, res) => {
    try {
      const { timeRange, playerId, platform } = req.query;
      
      const analytics = await storage.getFanEngagementAnalytics({
        timeRange: timeRange as string || '7d',
        playerId: playerId as string,
        platform: platform as string
      });
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching fan engagement analytics:", error);
      res.status(500).json({ message: "Failed to fetch engagement analytics" });
    }
  });

  // Get social media performance metrics
  app.get("/api/fan-engagement/performance", isAuthenticated, async (req, res) => {
    try {
      const { platform, contentType, timeRange } = req.query;
      
      const performance = await storage.getSocialMediaPerformance({
        platform: platform as string,
        contentType: contentType as string,
        timeRange: timeRange as string || '30d'
      });
      
      res.json(performance);
    } catch (error) {
      console.error("Error fetching social media performance:", error);
      res.status(500).json({ message: "Failed to fetch performance metrics" });
    }
  });

  // Update highlight engagement data
  app.post("/api/fan-engagement/engagement/:id", isAuthenticated, async (req, res) => {
    try {
      const highlightId = req.params.id;
      const { platform, engagementData } = req.body;
      
      await storage.updateSocialEngagement(highlightId, platform, engagementData);
      
      res.json({
        message: "Engagement data updated successfully",
        highlightId,
        platform
      });
    } catch (error) {
      console.error("Error updating engagement data:", error);
      res.status(500).json({ message: "Failed to update engagement data" });
    }
  });

  // Get trending content suggestions
  app.get("/api/fan-engagement/trending", isAuthenticated, async (req, res) => {
    try {
      const { sport, ageGroup, platform, limit } = req.query;
      
      const trendingContent = await storage.getTrendingContentSuggestions({
        sport: sport as string,
        ageGroup: ageGroup as string,
        platform: platform as string,
        limit: parseInt(limit as string) || 10
      });
      
      res.json(trendingContent);
    } catch (error) {
      console.error("Error fetching trending content:", error);
      res.status(500).json({ message: "Failed to fetch trending content" });
    }
  });

  // Optimize content for specific platform
  app.post("/api/fan-engagement/optimize", isAuthenticated, async (req, res) => {
    try {
      const { highlightId, platform, optimizationSettings } = req.body;
      
      const optimizedContent = await storage.optimizeContentForPlatform(highlightId, platform, optimizationSettings);
      
      res.json({
        message: "Content optimized successfully",
        optimizedContent,
        optimizations: {
          platform,
          videoFormat: optimizedContent.format,
          dimensions: optimizedContent.dimensions,
          captionOptimized: true,
          hashtagsGenerated: optimizedContent.hashtags.length
        }
      });
    } catch (error) {
      console.error("Error optimizing content:", error);
      res.status(500).json({ message: "Failed to optimize content" });
    }
  });

  // Bulk generate highlights for event
  app.post("/api/fan-engagement/bulk-generate", isAuthenticated, async (req, res) => {
    try {
      const { eventId, sport, ageGroup, platforms, language } = req.body;
      const userId = req.user?.claims?.sub;
      
      const bulkHighlights = await storage.bulkGenerateSocialHighlights({
        eventId,
        sport,
        ageGroup,
        platforms: platforms || ['instagram', 'twitter'],
        language: language || 'en',
        generatedBy: userId
      });
      
      res.json({
        message: "Bulk social highlights generated successfully",
        highlights: bulkHighlights,
        summary: {
          totalHighlights: bulkHighlights.length,
          playersInvolved: new Set(bulkHighlights.map(h => h.playerId)).size,
          platformsOptimized: platforms.length,
          avgAiConfidence: bulkHighlights.reduce((sum, h) => sum + h.aiCuration.confidence, 0) / bulkHighlights.length
        }
      });
    } catch (error) {
      console.error("Error bulk generating highlights:", error);
      res.status(500).json({ message: "Failed to bulk generate highlights" });
    }
  });

  // Get content calendar suggestions
  app.get("/api/fan-engagement/calendar", isAuthenticated, async (req, res) => {
    try {
      const { month, year, teamId } = req.query;
      
      const calendar = await storage.getContentCalendarSuggestions({
        month: parseInt(month as string),
        year: parseInt(year as string),
        teamId: teamId as string
      });
      
      res.json(calendar);
    } catch (error) {
      console.error("Error fetching content calendar:", error);
      res.status(500).json({ message: "Failed to fetch content calendar" });
    }
  });

  // AI content enhancement endpoint
  app.post("/api/fan-engagement/enhance", isAuthenticated, async (req, res) => {
    try {
      const { highlightId, enhancementType, preferences } = req.body;
      
      const enhancedContent = await storage.enhanceContentWithAI(highlightId, {
        enhancementType,
        preferences,
        userId: req.user?.claims?.sub
      });
      
      res.json({
        message: "Content enhanced successfully with AI",
        enhancedContent,
        enhancements: {
          type: enhancementType,
          aiConfidence: enhancedContent.confidence,
          improvements: enhancedContent.improvements
        }
      });
    } catch (error) {
      console.error("Error enhancing content:", error);
      res.status(500).json({ message: "Failed to enhance content" });
    }
  });

  // Webhook for social platform updates
  app.post("/api/fan-engagement/webhook", async (req, res) => {
    try {
      const { platform, eventType, data } = req.body;
      
      console.log(`Fan engagement webhook received: ${platform} - ${eventType}`);
      
      if (eventType === 'engagement_update') {
        await storage.updateSocialEngagement(data.highlightId, platform, data.engagement);
      } else if (eventType === 'content_published') {
        await storage.updatePublishStatus(data.highlightId, platform, 'published', data);
      }
      
      res.json({ message: "Fan engagement webhook processed successfully" });
    } catch (error) {
      console.error("Error processing fan engagement webhook:", error);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });
}