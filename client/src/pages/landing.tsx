import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DevLogin from "@/components/auth/dev-login";
import { Trophy, Users, Calendar, Building, CreditCard, Bell, Shield, BarChart3, Clock } from "lucide-react";

export default function Landing() {
  const [showDevLogin, setShowDevLogin] = useState(false);
  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Trophy className="h-6 w-6" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">TeamPro.ai</h1>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDevLogin(true)}
              >
                Dev Login
              </Button>
              <Button onClick={() => {
                console.log("Attempting login...");
                window.location.href = "/api/login";
              }}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Next-Generation Sports Management Platform
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Unify team communication, advanced scorekeeping, and seamless scheduling in one powerful platform. 
            Built for team sports organizations who demand reliability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => {
                console.log("Attempting login from hero...");
                window.location.href = "/api/login";
              }}
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-blue-700 text-white"
            >
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-blue-100 mt-4">
            Free forever for core features • No ads • No credit card required
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Sports
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage all your team sports activities in one comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Bell className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Reliable Team Communication</h4>
                </div>
                <p className="text-gray-600">
                  99.5% notification delivery rate with instant team chat, urgent message flags, 
                  and push notifications that actually work. No more missed messages.
                </p>
                <div className="mt-3">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Industry-leading reliability
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Advanced Scorekeeping & Stats</h4>
                </div>
                <p className="text-gray-600">
                  Professional-grade statistics tracking with 150+ sport-specific metrics, 
                  real-time scorekeeping, and comprehensive performance analytics.
                </p>
                <div className="mt-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Advanced analytics made simple
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Intuitive Interface & Fast Performance</h4>
                </div>
                <p className="text-gray-600">
                  Mobile-first design with offline functionality for weak networks. 
                  Lightning-fast performance on all devices, even with poor connectivity.
                </p>
                <div className="mt-3">
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    Works anywhere, anytime
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Smart Scheduling & Calendar Sync</h4>
                </div>
                <p className="text-gray-600">
                  Auto-sync with Google, Apple, and Outlook calendars. Intelligent conflict detection 
                  and automated reminders keep everyone on schedule.
                </p>
                <div className="mt-3">
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    Never miss another game
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Streamlined Payment Processing</h4>
                </div>
                <p className="text-gray-600">
                  Secure payment collection with fast processing and automated invoicing. 
                  Built-in financial reporting and sponsorship management tools.
                </p>
                <div className="mt-3">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Fast & secure transactions
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Bell className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Real-time Notifications</h4>
                </div>
                <p className="text-gray-600">
                  Instant alerts for schedule changes, weather updates, and urgent announcements. 
                  Push notifications that actually reach your entire team.
                </p>
                <div className="mt-3">
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Everyone stays informed
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-indigo-500">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Building className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Facility Management</h4>
                </div>
                <p className="text-gray-600">
                  Complete facility booking system with real-time availability, 
                  automated scheduling, and integrated billing for courts and fields.
                </p>
                <div className="mt-3">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                    Maximize facility usage
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Enterprise Security & Privacy</h4>
                </div>
                <p className="text-gray-600">
                  Bank-level security with granular permissions and complete data protection. 
                  Your team's information is always safe and private.
                </p>
                <div className="mt-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Your data is protected
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Sports Management?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join the revolution of simplified and free access to sports management.
            Transform how your organization operates.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-blue-700"
            onClick={() => {
              console.log("Attempting login from CTA...");
              window.location.href = "/api/login";
            }}
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Trophy className="h-6 w-6" />
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">TeamPro.ai</span>
          </div>
          <p className="text-center text-gray-600 mt-4">
            © 2025 TeamPro.ai. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Development Login Modal */}
      <DevLogin open={showDevLogin} onOpenChange={setShowDevLogin} />
    </div>
  );
}
