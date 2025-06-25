import type { Express } from "express";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Highlight Clips routes for AI-powered player-specific video highlights
export function registerHighlightRoutes(app: Express) {
  
  // Get all highlight clips
  app.get("/api/highlights/clips", isAuthenticated, async (req, res) => {
    try {
      const clips = await storage.getHighlightClips();
      res.json(clips);
    } catch (error) {
      console.error("Error fetching highlight clips:", error);
      res.status(500).json({ message: "Failed to fetch highlight clips" });
    }
  });

  // Get highlight clip by ID
  app.get("/api/highlights/clips/:id", isAuthenticated, async (req, res) => {
    try {
      const clip = await storage.getHighlightClip(req.params.id);
      if (!clip) {
        return res.status(404).json({ message: "Highlight clip not found" });
      }
      res.json(clip);
    } catch (error) {
      console.error("Error fetching highlight clip:", error);
      res.status(500).json({ message: "Failed to fetch highlight clip" });
    }
  });

  // Get player profiles with highlight stats
  app.get("/api/highlights/players", isAuthenticated, async (req, res) => {
    try {
      const players = await storage.getPlayerProfiles();
      res.json(players);
    } catch (error) {
      console.error("Error fetching player profiles:", error);
      res.status(500).json({ message: "Failed to fetch player profiles" });
    }
  });

  // Get highlights for specific player
  app.get("/api/highlights/players/:playerId/clips", isAuthenticated, async (req, res) => {
    try {
      const playerId = req.params.playerId;
      const clips = await storage.getPlayerHighlights(playerId);
      res.json(clips);
    } catch (error) {
      console.error("Error fetching player highlights:", error);
      res.status(500).json({ message: "Failed to fetch player highlights" });
    }
  });

  // Generate highlight clips for player/event
  app.post("/api/highlights/generate", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { playerId, eventId, momentTypes, sport, ageGroup } = req.body;
      
      // Simulate AI-powered highlight generation
      const clips = await storage.generateHighlightClips({
        playerId,
        eventId,
        momentTypes: momentTypes || ['goal', 'save', 'assist'],
        sport,
        ageGroup,
        generatedBy: userId
      });
      
      res.json({
        message: "Highlight clips generated successfully",
        clips,
        aiAnalysis: {
          confidence: 0.91,
          clipsGenerated: clips.length,
          processingTime: "2.3s"
        }
      });
    } catch (error) {
      console.error("Error generating highlight clips:", error);
      res.status(500).json({ message: "Failed to generate highlight clips" });
    }
  });

  // Like a highlight clip
  app.post("/api/highlights/clips/:id/like", isAuthenticated, async (req, res) => {
    try {
      const clipId = req.params.id;
      const userId = req.user?.claims?.sub;
      
      const updatedClip = await storage.toggleClipLike(clipId, userId);
      
      res.json({
        message: "Clip liked successfully",
        clip: updatedClip
      });
    } catch (error) {
      console.error("Error liking clip:", error);
      res.status(500).json({ message: "Failed to like clip" });
    }
  });

  // Add comment to highlight clip
  app.post("/api/highlights/clips/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const clipId = req.params.id;
      const userId = req.user?.claims?.sub;
      const { comment } = req.body;
      
      const newComment = await storage.addClipComment(clipId, userId, comment);
      
      res.json({
        message: "Comment added successfully",
        comment: newComment
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // Share highlight clip
  app.post("/api/highlights/clips/:id/share", isAuthenticated, async (req, res) => {
    try {
      const clipId = req.params.id;
      const userId = req.user?.claims?.sub;
      const { platform } = req.body;
      
      const shareResult = await storage.shareClip(clipId, userId, platform);
      
      res.json({
        message: "Clip shared successfully",
        shareUrl: shareResult.url,
        platform
      });
    } catch (error) {
      console.error("Error sharing clip:", error);
      res.status(500).json({ message: "Failed to share clip" });
    }
  });

  // Get highlight statistics
  app.get("/api/highlights/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getHighlightStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching highlight stats:", error);
      res.status(500).json({ message: "Failed to fetch highlight stats" });
    }
  });

  // Get engagement analytics
  app.get("/api/highlights/analytics", isAuthenticated, async (req, res) => {
    try {
      const { timeRange, playerId } = req.query;
      const analytics = await storage.getHighlightAnalytics({
        timeRange: timeRange as string,
        playerId: playerId as string
      });
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching highlight analytics:", error);
      res.status(500).json({ message: "Failed to fetch highlight analytics" });
    }
  });

  // Update clip metadata
  app.put("/api/highlights/clips/:id", isAuthenticated, async (req, res) => {
    try {
      const clipId = req.params.id;
      const updates = req.body;
      
      const updatedClip = await storage.updateHighlightClip(clipId, updates);
      
      res.json({
        message: "Clip updated successfully",
        clip: updatedClip
      });
    } catch (error) {
      console.error("Error updating clip:", error);
      res.status(500).json({ message: "Failed to update clip" });
    }
  });

  // Delete highlight clip
  app.delete("/api/highlights/clips/:id", isAuthenticated, async (req, res) => {
    try {
      const clipId = req.params.id;
      const userId = req.user?.claims?.sub;
      
      await storage.deleteHighlightClip(clipId, userId);
      
      res.json({
        message: "Clip deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting clip:", error);
      res.status(500).json({ message: "Failed to delete clip" });
    }
  });

  // Bulk generate highlights for event
  app.post("/api/highlights/events/:eventId/generate", isAuthenticated, async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const userId = req.user?.claims?.sub;
      const { sport, ageGroup } = req.body;
      
      const clips = await storage.generateEventHighlights(eventId, {
        sport,
        ageGroup,
        generatedBy: userId
      });
      
      res.json({
        message: "Event highlights generated successfully",
        clips,
        summary: {
          totalClips: clips.length,
          playersInvolved: new Set(clips.map(c => c.playerId)).size,
          avgConfidence: clips.reduce((sum, c) => sum + c.aiConfidence, 0) / clips.length
        }
      });
    } catch (error) {
      console.error("Error generating event highlights:", error);
      res.status(500).json({ message: "Failed to generate event highlights" });
    }
  });

  // Get trending clips
  app.get("/api/highlights/trending", isAuthenticated, async (req, res) => {
    try {
      const { timeRange, sport, limit } = req.query;
      const trendingClips = await storage.getTrendingClips({
        timeRange: timeRange as string || '7d',
        sport: sport as string,
        limit: parseInt(limit as string) || 10
      });
      
      res.json(trendingClips);
    } catch (error) {
      console.error("Error fetching trending clips:", error);
      res.status(500).json({ message: "Failed to fetch trending clips" });
    }
  });

  // Export player highlight reel
  app.get("/api/highlights/players/:playerId/export", isAuthenticated, async (req, res) => {
    try {
      const playerId = req.params.playerId;
      const { format, quality, dateRange } = req.query;
      
      const exportData = await storage.exportPlayerHighlightReel(playerId, {
        format: format as string || 'mp4',
        quality: quality as string || '720p',
        dateRange: dateRange as string
      });
      
      res.json({
        message: "Highlight reel export initiated",
        exportId: exportData.id,
        downloadUrl: exportData.downloadUrl,
        estimatedTime: exportData.estimatedTime
      });
    } catch (error) {
      console.error("Error exporting highlight reel:", error);
      res.status(500).json({ message: "Failed to export highlight reel" });
    }
  });

  // Webhook for AI processing updates
  app.post("/api/highlights/ai-webhook", async (req, res) => {
    try {
      const { clipId, eventType, data } = req.body;
      
      console.log(`Highlight AI webhook received for clip ${clipId}: ${eventType}`);
      
      if (eventType === 'highlight_generated') {
        await storage.updateHighlightClip(clipId, data);
      } else if (eventType === 'engagement_update') {
        await storage.updateClipEngagement(clipId, data);
      }
      
      res.json({ message: "Highlight webhook processed successfully" });
    } catch (error) {
      console.error("Error processing highlight webhook:", error);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });
}