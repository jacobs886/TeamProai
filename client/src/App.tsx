import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Teams from "@/pages/teams";
import Schedule from "@/pages/schedule";
import Facilities from "@/pages/facilities";
import Payments from "@/pages/payments";
import Notifications from "@/pages/notifications";
import Settings from "@/pages/settings";
import AdminDashboard from "@/pages/admin";
import Volunteers from "@/pages/volunteers";
import Equipment from "@/pages/equipment";
import ParentPortal from "@/pages/parent-portal";
import Players from "@/pages/players";
import Skills from "@/pages/skills";
import Guardians from "@/pages/guardians";
import SmartChatbots from "@/pages/smart-chatbots";
import MessageAnalysis from "@/pages/message-analysis";
import TranslationHub from "@/pages/translation-hub";
import CommunicationLogs from "@/pages/communication-logs";
import SmartScheduler from "@/pages/smart-scheduler";
import CalendarSync from "@/pages/calendar-sync";
import AvailabilityPrediction from "@/pages/availability-prediction";
import AdvancedStats from "@/pages/advanced-stats";
import PerformanceAnalysis from "@/pages/performance-analysis";
import PlayerDevelopment from "@/pages/player-development";
import Benchmarks from "@/pages/benchmarks";
import AutoStream from "@/pages/autostream";
import VideoAnalysis from "@/pages/video-analysis";
import Highlights from "@/pages/highlights";
import FanEngagement from "@/pages/fan-engagement";
import EnhancedDashboard from "@/pages/enhanced-dashboard";
import DatabaseManagement from "@/pages/admin/database-management";
import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import FloatingChatbot from "@/components/chat/floating-chatbot";
import DevStatus from "@/components/auth/dev-status";


function AuthenticatedRouter() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <MobileHeader />
        <div className="flex-1 overflow-hidden">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/teams" component={Teams} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/facilities" component={Facilities} />
            <Route path="/payments" component={Payments} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/settings" component={Settings} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/volunteers" component={Volunteers} />
            <Route path="/equipment" component={Equipment} />
            <Route path="/parent-portal" component={ParentPortal} />
            <Route path="/players" component={Players} />
            <Route path="/skills" component={Skills} />
            <Route path="/guardians" component={Guardians} />
            <Route path="/smart-chatbots" component={SmartChatbots} />
            <Route path="/message-analysis" component={MessageAnalysis} />
            <Route path="/translation-hub" component={TranslationHub} />
            <Route path="/communication-logs" component={CommunicationLogs} />
            <Route path="/smart-scheduler" component={SmartScheduler} />
            <Route path="/calendar-sync" component={CalendarSync} />
            <Route path="/availability-prediction" component={AvailabilityPrediction} />
            <Route path="/advanced-stats" component={AdvancedStats} />
            <Route path="/performance-analysis" component={PerformanceAnalysis} />
            <Route path="/player-development" component={PlayerDevelopment} />
            <Route path="/benchmarks" component={Benchmarks} />
            <Route path="/autostream" component={AutoStream} />
            <Route path="/video-analysis" component={VideoAnalysis} />
            <Route path="/highlights" component={Highlights} />
            <Route path="/fan-engagement" component={FanEngagement} />
            <Route path="/enhanced-dashboard" component={EnhancedDashboard} />
            <Route path="/admin/database" component={DatabaseManagement} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
      <MobileBottomNav />
      <FloatingChatbot />
      <DevStatus />
    </div>
  );
}

function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return <AuthenticatedRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppRouter />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
