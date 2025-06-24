import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Building, DollarSign } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    activeTeams: number;
    upcomingEvents: number;
    facilities: number;
    monthlyRevenue: number;
  };
  isLoading?: boolean;
}

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-28 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Active Teams",
      value: stats?.activeTeams || 0,
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "This Week",
      value: stats?.upcomingEvents || 0,
      icon: Calendar,
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Facilities",
      value: stats?.facilities || 0,
      icon: Building,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Monthly Revenue",
      value: `$${stats?.monthlyRevenue || 0}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {card.title}
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {card.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
