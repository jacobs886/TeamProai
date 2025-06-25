import type { Express } from "express";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Video Analysis routes for AI-powered technique improvement
export function registerVideoAnalysisRoutes(app: Express) {
  
  // Get all video analyses
  app.get("/api/video-analysis/analyses", isAuthenticated, async (req, res) => {
    try {
      const analyses = await storage.getVideoAnalyses();
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching video analyses:", error);
      res.status(500).json({ message: "Failed to fetch video analyses" });
    }
  });

  // Get analysis by ID
  app.get("/api/video-analysis/analyses/:id", isAuthenticated, async (req, res) => {
    try {
      const analysis = await storage.getVideoAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  // Upload video for analysis
  app.post("/api/video-analysis/upload", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const videoData = {
        ...req.body,
        uploadedBy: userId,
        status: 'processing',
        uploadTime: new Date(),
        aiAnalysis: {
          techniques: [],
          drills: [],
          confidence: 0,
          processingStatus: 'pending'
        }
      };

      // Simulate video upload and AI processing initialization
      const video = await storage.uploadVideo(videoData);
      
      // In production, this would trigger AWS S3 upload and AI analysis pipeline
      console.log(`Starting AI analysis for video: ${video.title}`);
      
      res.json({
        message: "Video uploaded successfully",
        video,
        analysisUrl: `/api/video-analysis/analyses/${video.id}`,
        estimatedProcessingTime: "5-10 minutes"
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ message: "Failed to upload video" });
    }
  });

  // Get drill library
  app.get("/api/video-analysis/drills", isAuthenticated, async (req, res) => {
    try {
      const drills = await storage.getDrillLibrary();
      res.json(drills);
    } catch (error) {
      console.error("Error fetching drill library:", error);
      res.status(500).json({ message: "Failed to fetch drill library" });
    }
  });

  // Get analysis statistics
  app.get("/api/video-analysis/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getVideoAnalysisStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching analysis stats:", error);
      res.status(500).json({ message: "Failed to fetch analysis stats" });
    }
  });

  // Approve or reject analysis (coach review)
  app.post("/api/video-analysis/approve/:id", isAuthenticated, async (req, res) => {
    try {
      const analysisId = req.params.id;
      const { approved, feedback } = req.body;
      const userId = req.user?.claims?.sub;
      
      const updatedAnalysis = await storage.updateAnalysisApproval(
        analysisId, 
        approved ? 'approved' : 'needs_revision',
        userId,
        feedback
      );
      
      res.json({
        message: `Analysis ${approved ? 'approved' : 'rejected'} successfully`,
        analysis: updatedAnalysis
      });
    } catch (error) {
      console.error("Error updating analysis approval:", error);
      res.status(500).json({ message: "Failed to update analysis approval" });
    }
  });

  // Generate technique analysis for video
  app.post("/api/video-analysis/analyze/:videoId", isAuthenticated, async (req, res) => {
    try {
      const videoId = req.params.videoId;
      const { sport, ageGroup, metrics } = req.body;
      const userId = req.user?.claims?.sub;
      
      // Simulate AI technique analysis
      const analysis = await storage.generateTechniqueAnalysis(videoId, {
        sport,
        ageGroup,
        metrics,
        analyzedBy: userId
      });
      
      res.json({
        message: "Technique analysis completed",
        analysis,
        aiInsights: {
          confidence: analysis.confidence,
          techniquesAnalyzed: analysis.techniques.length,
          drillsRecommended: analysis.drills.length
        }
      });
    } catch (error) {
      console.error("Error generating technique analysis:", error);
      res.status(500).json({ message: "Failed to generate technique analysis" });
    }
  });

  // Get personalized drill recommendations
  app.get("/api/video-analysis/drills/recommendations/:playerId", isAuthenticated, async (req, res) => {
    try {
      const playerId = req.params.playerId;
      const { sport, ageGroup, techniques } = req.query;
      
      const recommendations = await storage.getPersonalizedDrills(playerId, {
        sport: sport as string,
        ageGroup: ageGroup as string,
        techniques: (techniques as string)?.split(',') || []
      });
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching drill recommendations:", error);
      res.status(500).json({ message: "Failed to fetch drill recommendations" });
    }
  });

  // Update drill completion status
  app.post("/api/video-analysis/drills/:drillId/complete", isAuthenticated, async (req, res) => {
    try {
      const drillId = req.params.drillId;
      const { playerId, completionData } = req.body;
      const userId = req.user?.claims?.sub;
      
      const completion = await storage.recordDrillCompletion(drillId, playerId, {
        ...completionData,
        completedBy: userId,
        completionTime: new Date()
      });
      
      res.json({
        message: "Drill completion recorded",
        completion,
        nextRecommendations: await storage.getNextDrillRecommendations(playerId)
      });
    } catch (error) {
      console.error("Error recording drill completion:", error);
      res.status(500).json({ message: "Failed to record drill completion" });
    }
  });

  // Translate analysis content
  app.post("/api/video-analysis/translate", isAuthenticated, async (req, res) => {
    try {
      const { content, targetLanguage, context } = req.body;
      
      // Simulate AI translation with sports-specific context
      const translations = await storage.translateAnalysisContent(content, targetLanguage, context);
      
      res.json({
        originalContent: content,
        translatedContent: translations,
        targetLanguage,
        confidence: 0.95,
        sportsContext: context
      });
    } catch (error) {
      console.error("Error translating content:", error);
      res.status(500).json({ message: "Failed to translate content" });
    }
  });

  // Get youth-specific analysis settings
  app.get("/api/video-analysis/youth-settings/:ageGroup", isAuthenticated, async (req, res) => {
    try {
      const ageGroup = req.params.ageGroup;
      const settings = await storage.getYouthAnalysisSettings(ageGroup);
      
      res.json({
        ageGroup,
        settings,
        researchBasis: "ACSM and NSCA Youth Training Guidelines"
      });
    } catch (error) {
      console.error("Error fetching youth settings:", error);
      res.status(500).json({ message: "Failed to fetch youth settings" });
    }
  });

  // Webhook for AI processing updates
  app.post("/api/video-analysis/ai-webhook", async (req, res) => {
    try {
      const { videoId, analysisType, data } = req.body;
      
      console.log(`AI analysis webhook received for video ${videoId}: ${analysisType}`);
      
      if (analysisType === 'technique_analysis_complete') {
        await storage.updateVideoAnalysis(videoId, data);
      } else if (analysisType === 'drill_recommendations_ready') {
        await storage.updateDrillRecommendations(videoId, data);
      }
      
      res.json({ message: "Analysis webhook processed successfully" });
    } catch (error) {
      console.error("Error processing analysis webhook:", error);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  // Export analysis data
  app.get("/api/video-analysis/export/:playerId", isAuthenticated, async (req, res) => {
    try {
      const playerId = req.params.playerId;
      const { format, dateRange } = req.query;
      
      const exportData = await storage.exportPlayerAnalysisData(playerId, {
        format: format as string || 'json',
        dateRange: dateRange as string
      });
      
      res.json({
        message: "Analysis data exported successfully",
        exportData,
        downloadUrl: `/api/video-analysis/download/${exportData.id}`
      });
    } catch (error) {
      console.error("Error exporting analysis data:", error);
      res.status(500).json({ message: "Failed to export analysis data" });
    }
  });
}