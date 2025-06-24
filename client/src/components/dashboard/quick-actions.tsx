import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, UserPlus, Building, CreditCard, ChevronRight } from "lucide-react";

const actions = [
  {
    title: "Schedule Event",
    icon: CalendarPlus,
    color: "bg-primary/10 text-primary",
    action: "schedule-event",
  },
  {
    title: "Invite Members",
    icon: UserPlus,
    color: "bg-secondary/10 text-secondary",
    action: "invite-members",
  },
  {
    title: "Book Facility",
    icon: Building,
    color: "bg-accent/10 text-accent",
    action: "book-facility",
  },
  {
    title: "Collect Payment",
    icon: CreditCard,
    color: "bg-green-100 text-green-600",
    action: "collect-payment",
  },
];

export default function QuickActions() {
  const handleAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // TODO: Implement actual actions
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.action}
                variant="ghost"
                className="w-full justify-between p-3 h-auto bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => handleAction(action.action)}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${action.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {action.title}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
