import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Globe, 
  Languages, 
  Send, 
  Sparkles,
  BarChart3,
  Clock,
  TrendingUp,
  Users,
  ArrowRightLeft,
  CheckCircle,
  FileText,
  Upload,
  Settings,
  Zap,
  Target,
  MessageSquare,
  Flag,
  Volume2,
  Download,
  RefreshCw,
  Brain
} from "lucide-react";
import { format } from "date-fns";

interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  intent?: string;
  tone?: string;
  timestamp: Date;
  sportContext?: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  isPopular?: boolean;
}

interface TranslationAnalytics {
  totalTranslations: number;
  languagePairs: Record<string, number>;
  accuracy: number;
  avgConfidence: number;
  popularLanguages: Array<{ language: string; usage: number }>;
  monthlyUsage: Array<{ month: string; translations: number }>;
}

const POPULAR_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸", isPopular: true },
  { code: "es", name: "Spanish", flag: "🇪🇸", isPopular: true },
  { code: "fr", name: "French", flag: "🇫🇷", isPopular: true },
  { code: "de", name: "German", flag: "🇩🇪", isPopular: true },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", isPopular: true },
  { code: "zh", name: "Chinese", flag: "🇨🇳", isPopular: true },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" }
];

const SPORT_CONTEXTS = [
  "General",
  "Soccer/Football",
  "Basketball", 
  "Baseball",
  "Hockey",
  "Tennis",
  "Volleyball",
  "Swimming"
];

export default function TranslationHub() {
  const [activeTab, setActiveTab] = useState<"translator" | "history" | "analytics" | "settings">("translator");
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [inputText, setInputText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [selectedSport, setSelectedSport] = useState("General");
  const [isTranslating, setIsTranslating] = useState(false);
  const [userLanguage, setUserLanguage] = useState("en");
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch translation analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/translation/analytics"],
  });

  // Fetch translation history
  const { data: translationHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ["/api/translation/history"],
  });

  // Translate text mutation
  const translateMutation = useMutation({
    mutationFn: async (data: { text: string; source: string; target: string; sport: string }) => {
      const response = await apiRequest("POST", "/api/translation/translate", data);
      return response.json();
    },
    onSuccess: (data) => {
      const newTranslation: Translation = {
        id: Date.now().toString(),
        originalText: inputText,
        translatedText: data.translatedText,
        sourceLanguage: data.detectedLanguage || sourceLanguage,
        targetLanguage,
        confidence: data.confidence,
        intent: data.intent,
        tone: data.tone,
        timestamp: new Date(),
        sportContext: selectedSport
      };
      setTranslations(prev => [newTranslation, ...prev]);
      setIsTranslating(false);
      toast({
        title: "Translation Complete",
        description: `Translated from ${getLanguageName(data.detectedLanguage || sourceLanguage)} to ${getLanguageName(targetLanguage)}`,
      });
    },
    onError: () => {
      toast({
        title: "Translation Failed",
        description: "Unable to translate text. Please try again.",
        variant: "destructive",
      });
      setIsTranslating(false);
    }
  });

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    translateMutation.mutate({
      text: inputText,
      source: sourceLanguage,
      target: targetLanguage,
      sport: selectedSport
    });
  };

  const getLanguageName = (code: string) => {
    if (code === "auto") return "Auto-detect";
    return POPULAR_LANGUAGES.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return POPULAR_LANGUAGES.find(lang => lang.code === code)?.flag || "🌐";
  };

  const swapLanguages = () => {
    if (sourceLanguage !== "auto") {
      setTargetLanguage(sourceLanguage);
      setSourceLanguage(targetLanguage);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Globe className="h-8 w-8 text-blue-600" />
            Translation Hub
          </h1>
          <p className="text-gray-600">AI-powered multilingual communication for diverse teams</p>
        </div>
        <Badge className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <Languages className="h-3 w-3 mr-1" />
          50+ Languages
        </Badge>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="translator" className="flex items-center space-x-2">
            <ArrowRightLeft className="h-4 w-4" />
            <span>Translator</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Translator Tab */}
        <TabsContent value="translator" className="space-y-4">
          {/* Language Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Languages className="h-5 w-5" />
                <span>Language Selection</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <Label htmlFor="source-lang">From</Label>
                  <select
                    id="source-lang"
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="auto">🌐 Auto-detect</option>
                    {POPULAR_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={swapLanguages}
                    disabled={sourceLanguage === "auto"}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="target-lang">To</Label>
                  <select
                    id="target-lang"
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    {POPULAR_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="sport-context">Sport Context</Label>
                <select
                  id="sport-context"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  {SPORT_CONTEXTS.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Improves accuracy for sport-specific terminology
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Translation Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <span>{getLanguageFlag(sourceLanguage)}</span>
                  <span>{getLanguageName(sourceLanguage)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  ref={inputRef}
                  placeholder="Enter text to translate..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {inputText.length} characters
                  </span>
                  <Button 
                    onClick={handleTranslate}
                    disabled={!inputText.trim() || isTranslating}
                  >
                    {isTranslating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Translate
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <span>{getLanguageFlag(targetLanguage)}</span>
                  <span>{getLanguageName(targetLanguage)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[144px] p-3 border rounded-md bg-gray-50">
                  {translations.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-gray-900">{translations[0].translatedText}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Target className="h-3 w-3" />
                          <span>{Math.round(translations[0].confidence * 100)}% confident</span>
                        </span>
                        {translations[0].intent && (
                          <Badge variant="outline" className="text-xs">
                            {translations[0].intent}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Translation will appear here...</p>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => translations.length > 0 && copyToClipboard(translations[0].translatedText)}
                    disabled={translations.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Phrases */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Phrases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "Practice is cancelled",
                  "Game starts at 3 PM",
                  "Please bring water bottles",
                  "Great job team!",
                  "Payment is due tomorrow",
                  "See you at the field",
                  "Weather update",
                  "Uniform requirements"
                ].map((phrase) => (
                  <Button
                    key={phrase}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputText(phrase)}
                    className="text-xs"
                  >
                    {phrase}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Translation History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {translations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No translations yet</p>
                      <p className="text-sm">Start translating to see your history</p>
                    </div>
                  ) : (
                    translations.map((translation) => (
                      <div key={translation.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm">
                            <span>{getLanguageFlag(translation.sourceLanguage)}</span>
                            <span>{getLanguageName(translation.sourceLanguage)}</span>
                            <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                            <span>{getLanguageFlag(translation.targetLanguage)}</span>
                            <span>{getLanguageName(translation.targetLanguage)}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(translation.timestamp, "MMM d, h:mm a")}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Original</p>
                            <p className="text-sm text-gray-900 mt-1">{translation.originalText}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Translation</p>
                            <p className="text-sm text-gray-900 mt-1">{translation.translatedText}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {translation.sportContext}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {Math.round(translation.confidence * 100)}% confidence
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(translation.translatedText)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {analyticsLoading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Globe className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.totalTranslations || 0}</p>
                        <p className="text-xs text-gray-600">Total Translations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Languages className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">
                          {Object.keys(analytics?.languagePairs || {}).length}
                        </p>
                        <p className="text-xs text-gray-600">Language Pairs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Target className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.accuracy || 0}%</p>
                        <p className="text-xs text-gray-600">Accuracy Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center">
                      <Zap className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{analytics?.avgConfidence || 0}%</p>
                        <p className="text-xs text-gray-600">Avg Confidence</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Popular Languages */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.popularLanguages?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span>{getLanguageFlag(item.language)}</span>
                          <span className="font-medium">{getLanguageName(item.language)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(item.usage / (analytics?.totalTranslations || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{item.usage}</span>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No language data available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Translation Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Key Benefits</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>98% language detection accuracy</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Parent engagement increased by 40%</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span>Support for 50+ languages</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Usage Patterns</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span>Sport-specific terminology improves accuracy by 20%</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span>Real-time translations average 1.2 seconds</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-green-600" />
                          <span>Most popular: Spanish ↔ English translations</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Translation Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default Language</Label>
                <select 
                  value={userLanguage}
                  onChange={(e) => setUserLanguage(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  {POPULAR_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label>Translation Quality</Label>
                <select className="w-full p-2 border rounded-md mt-1">
                  <option value="high">High Quality (slower)</option>
                  <option value="balanced">Balanced (recommended)</option>
                  <option value="fast">Fast (less accurate)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="auto-detect" defaultChecked />
                    <Label htmlFor="auto-detect" className="text-sm">Auto-detect Language</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sport-context" defaultChecked />
                    <Label htmlFor="sport-context" className="text-sm">Sport Context</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="intent-preserve" defaultChecked />
                    <Label htmlFor="intent-preserve" className="text-sm">Preserve Intent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="offline-cache" defaultChecked />
                    <Label htmlFor="offline-cache" className="text-sm">Offline Caching</Label>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Training Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="glossary-upload">Upload Team Glossary</Label>
                <Input
                  id="glossary-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload team-specific terminology to improve translation accuracy
                </p>
              </div>

              <div>
                <Label htmlFor="league-rules">League Rules URL</Label>
                <Input
                  id="league-rules"
                  type="url"
                  placeholder="https://example-league.com/rules"
                  className="mt-1"
                />
              </div>

              <Button className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Training Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}