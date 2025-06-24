import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Setup script to assign the first super admin role
 * This should be run after the first user logs in through Replit Auth
 */
export async function setupInitialSuperAdmin(email: string): Promise<boolean> {
  try {
    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      return false;
    }

    // Update user to super_admin role
    const [updatedUser] = await db
      .update(users)
      .set({ 
        role: 'super_admin',
        updatedAt: new Date() 
      })
      .where(eq(users.id, user.id))
      .returning();

    if (updatedUser) {
      console.log(`Successfully assigned super_admin role to user: ${email}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error setting up super admin:', error);
    return false;
  }
}

/**
 * Check if any super admin exists
 */
export async function hasSuperAdmin(): Promise<boolean> {
  try {
    const [superAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.role, 'super_admin'))
      .limit(1);
    
    return !!superAdmin;
  } catch (error) {
    console.error('Error checking for super admin:', error);
    return false;
  }
}