import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Sparkles, Clock, Users, Calendar, BarChart3, MessageSquare, Video, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateQuery {
  icon: any;
  title: string;
  description: string;
  query: string;
  category: "scheduling" | "analytics" | "communication" | "team" | "performance";
}

const templateQueries: TemplateQuery[] = [
  {
    icon: Calendar,
    title: "Optimize Schedule",
    description: "AI-powered conflict detection and scheduling",
    query: "Optimize my team schedule for the next month and detect any conflicts",
    category: "scheduling"
  },
  {
    icon: BarChart3,
    title: "Performance Analysis",
    description: "Generate insights from player statistics",
    query: "Analyze team performance trends and suggest improvement areas",
    category: "analytics"
  },
  {
    icon: MessageSquare,
    title: "Parent Communication",
    description: "Draft messages for parents and guardians",
    query: "Draft a professional update message for parents about upcoming tournament",
    category: "communication"
  },
  {
    icon: Users,
    title: "Team Balance",
    description: "Analyze roster composition and balance",
    query: "Analyze my roster balance and suggest optimal player positions",
    category: "team"
  },
  {
    icon: Video,
    title: "Video Analysis",
    description: "AI insights from game footage",
    query: "Analyze recent game video and provide coaching insights",
    category: "performance"
  },
  {
    icon: Trophy,
    title: "Season Planning",
    description: "Strategic planning for upcoming season",
    query: "Create a comprehensive season plan with training focus areas",
    category: "scheduling"
  },
  {
    icon: Brain,
    title: "Player Development",
    description: "Personalized development recommendations",
    query: "Generate individual development plans for each player based on their skills",
    category: "performance"
  },
  {
    icon: Clock,
    title: "Training Efficiency",
    description: "Optimize practice sessions",
    query: "Design efficient training sessions focused on our team's weak areas",
    category: "team"
  }
];

export default function AiPromptHeader() {
  const [query, setQuery] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !showTemplates && document.activeElement !== inputRef.current) {
        e.preventDefault();
        setShowTemplates(true);
        inputRef.current?.focus();
        setQuery("/");
      }
      if (e.key === "Escape") {
        setShowTemplates(false);
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showTemplates]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.startsWith("/")) {
      setShowTemplates(true);
    } else if (value === "") {
      setShowTemplates(false);
    }
  };

  const handleTemplateSelect = (template: TemplateQuery) => {
    setQuery(template.query);
    setShowTemplates(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      console.log("AI Query:", query);
      // In real implementation, this would send to AI service
      setIsProcessing(false);
      setQuery("");
    }, 2000);
  };

  const filteredTemplates = templateQueries.filter(template =>
    query.length <= 1 || 
    template.title.toLowerCase().includes(query.slice(1).toLowerCase()) ||
    template.description.toLowerCase().includes(query.slice(1).toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "scheduling": return "bg-blue-100 text-blue-800";
      case "analytics": return "bg-purple-100 text-purple-800";
      case "communication": return "bg-green-100 text-green-800";
      case "team": return "bg-orange-100 text-orange-800";
      case "performance": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">What can AI do for you?</span>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                BETA
              </Badge>
            </div>
            
            <div className="flex-1 max-w-2xl relative">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Ask AI anything or type '/' for templates..."
                  className="pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onFocus={() => query.startsWith("/") && setShowTemplates(true)}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!query.trim() || isProcessing}
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isProcessing ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {showTemplates && (
                <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto shadow-lg border border-gray-200">
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm text-gray-900">AI Templates</h3>
                      <span className="text-xs text-gray-500">Press ESC to close</span>
                    </div>
                    <div className="grid gap-2">
                      {filteredTemplates.map((template, index) => (
                        <div
                          key={index}
                          onClick={() => handleTemplateSelect(template)}
                          className={cn(
                            "p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors",
                            "group"
                          )}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100">
                              <template.icon className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-sm text-gray-900">{template.title}</h4>
                                <Badge className={cn("text-xs", getCategoryColor(template.category))}>
                                  {template.category}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                              <p className="text-xs text-gray-500 italic">"{template.query}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {filteredTemplates.length === 0 && query.length > 1 && (
                      <div className="text-center py-6 text-gray-500">
                        <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No templates found. Try a different search term.</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay to close templates when clicking outside */}
      {showTemplates && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowTemplates(false)}
        />
      )}
    </>
  );
}