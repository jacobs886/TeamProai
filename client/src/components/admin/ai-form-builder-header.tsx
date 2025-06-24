import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Brain, Send, Sparkles, Zap, Wand2 } from "lucide-react";

interface AIFormBuilderHeaderProps {
  onAIPrompt: (prompt: string) => void;
  isProcessing?: boolean;
}

export default function AIFormBuilderHeader({ onAIPrompt, isProcessing = false }: AIFormBuilderHeaderProps) {
  const [prompt, setPrompt] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const templates = [
    "Create a team registration form with player details",
    "Build a facility booking form with time slots", 
    "Design a payment form for tournament fees",
    "Make a volunteer signup form with availability",
    "Generate a parent consent form for minors",
    "Create an equipment rental checkout form",
    "Build a coach evaluation feedback form",
    "Design a tournament bracket entry form"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onAIPrompt(prompt.trim());
      setPrompt("");
      setShowSuggestions(false);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setPrompt(template);
    setShowSuggestions(false);
    onAIPrompt(template);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrompt(value);
    
    // Show suggestions when typing '/' or when field is focused and empty
    if (value === "/" || (value === "" && document.activeElement === inputRef.current)) {
      setShowSuggestions(true);
    } else if (value.length > 0 && value !== "/") {
      setShowSuggestions(false);
    }
  };

  // Filter templates based on input
  const filteredTemplates = templates.filter(template =>
    prompt === "/" || prompt === "" || 
    template.toLowerCase().includes(prompt.toLowerCase())
  );

  return (
    <div className="relative mb-6">
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <div className="flex items-center space-x-4">
          {/* AI Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md">
            <Brain className="h-6 w-6 text-white" />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg font-semibold text-gray-900">
                What can AI do for you?
              </span>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                BETA
              </Badge>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={prompt}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  placeholder="Ask AI anything or type '/' for templates..."
                  className="pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  disabled={isProcessing}
                />
                {prompt && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => {
                      setPrompt("");
                      setShowSuggestions(false);
                      inputRef.current?.focus();
                    }}
                  >
                    ×
                  </Button>
                )}
              </div>

              <Button
                type="submit"
                disabled={!prompt.trim() || isProcessing}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </form>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-600">Quick actions:</span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => handleTemplateSelect("Create a team registration form")}
              >
                <Wand2 className="h-3 w-3 mr-1" />
                Registration Form
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => handleTemplateSelect("Build a payment form with Stripe integration")}
              >
                <Zap className="h-3 w-3 mr-1" />
                Payment Form
              </Button>
            </div>
          </div>
        </div>

        {/* Templates Dropdown */}
        {showSuggestions && filteredTemplates.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50">
            <Card className="border border-gray-200 shadow-lg bg-white max-h-64 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-600 mb-2 px-2">
                  {prompt === "/" || prompt === "" ? "Form Templates" : "Matching Templates"}
                </div>
                {filteredTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleTemplateSelect(template)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-2"
                  >
                    <Wand2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>{template}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </Card>

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}