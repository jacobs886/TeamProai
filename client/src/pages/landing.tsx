import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Calendar, Building, CreditCard, Bell } from "lucide-react";

export default function Landing() {
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
            <Button onClick={() => window.location.href = "/api/login"}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Comprehensive Sports & League Management
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Streamline your sports organization with our powerful platform for team management,
            facility booking, scheduling, and payment processing.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => window.location.href = "/api/login"}
          >
            Get Started Free
          </Button>
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
              From volleyball and basketball to baseball - manage all your sports activities in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Team Management</h4>
                </div>
                <p className="text-gray-600">
                  Create and manage teams for volleyball, basketball, and baseball.
                  Track player rosters and team performance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-secondary" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Smart Scheduling</h4>
                </div>
                <p className="text-gray-600">
                  Schedule practices, games, and training sessions with intelligent
                  conflict detection and automated notifications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <Building className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Facility Booking</h4>
                </div>
                <p className="text-gray-600">
                  Book courts and fields with real-time availability checking.
                  Manage multiple facilities and their resources.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Payment Processing</h4>
                </div>
                <p className="text-gray-600">
                  Collect registration fees, facility payments, and manage
                  recurring billing with automated reminders.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Bell className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Smart Notifications</h4>
                </div>
                <p className="text-gray-600">
                  Keep everyone informed with automated notifications for
                  schedule changes, payments, and important updates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Trophy className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="ml-3 text-lg font-semibold">Multi-Role Access</h4>
                </div>
                <p className="text-gray-600">
                  Role-based dashboards for administrators, coaches, players,
                  and view-only users with appropriate permissions.
                </p>
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
            Join thousands of sports organizations already using TeamPro.ai
            to streamline their operations.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-blue-700"
            onClick={() => window.location.href = "/api/login"}
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
            © 2024 TeamPro.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
