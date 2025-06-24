import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Target, TrendingUp, Award, Globe, Users, Zap } from "lucide-react";
import { useState } from "react";

interface SkillBenchmarkingProps {
  assessments: any[];
  players: any[];
}

export default function SkillBenchmarking({ assessments, players }: SkillBenchmarkingProps) {
  const [selectedAge, setSelectedAge] = useState<string>("u12");
  const [selectedSport, setSelectedSport] = useState<string>("soccer");
  const [comparisonType, setComparisonType] = useState<string>("league");

  // Mock benchmark data for demonstration
  const benchmarkData = [
    {
      skill: "Ball Control",
      teamAvg: 3.8,
      leagueAvg: 3.4,
      nationalAvg: 3.2,
      topPercentile: 4.5,
      playerCount: 156
    },
    {
      skill: "Passing",
      teamAvg: 4.1,
      leagueAvg: 3.7,
      nationalAvg: 3.5,
      topPercentile: 4.6,
      playerCount: 156
    },
    {
      skill: "Shooting",
      teamAvg: 3.2,
      leagueAvg: 3.5,
      nationalAvg: 3.3,
      topPercentile: 4.2,
      playerCount: 156
    },
    {
      skill: "Speed",
      teamAvg: 3.5,
      leagueAvg: 3.6,
      nationalAvg: 3.4,
      topPercentile: 4.3,
      playerCount: 156
    },
    {
      skill: "Defense",
      teamAvg: 3.7,
      leagueAvg: 3.5,
      nationalAvg: 3.3,
      topPercentile: 4.4,
      playerCount: 156
    },
    {
      skill: "Teamwork",
      teamAvg: 4.3,
      leagueAvg: 3.9,
      nationalAvg: 3.7,
      topPercentile: 4.7,
      playerCount: 156
    }
  ];

  const radarBenchmarkData = benchmarkData.map(item => ({
    skill: item.skill,
    "Your Team": item.teamAvg,
    "League Average": item.leagueAvg,
    "National Average": item.nationalAvg,
    "Top 10%": item.topPercentile
  }));

  const playerComparisons = [
    {
      name: "John Smith",
      overall: 4.2,
      percentile: 85,
      aboveLeague: "+0.8",
      topSkill: "Passing",
      weakSkill: "Shooting"
    },
    {
      name: "Emma Rodriguez",
      overall: 4.0,
      percentile: 78,
      aboveLeague: "+0.6",
      topSkill: "Ball Control",
      weakSkill: "Speed"
    },
    {
      name: "Mike Thompson",
      overall: 3.8,
      percentile: 68,
      aboveLeague: "+0.4",
      topSkill: "Defense",
      weakSkill: "Shooting"
    },
    {
      name: "Sara Lee",
      overall: 3.6,
      percentile: 58,
      aboveLeague: "+0.2",
      topSkill: "Teamwork",
      weakSkill: "Ball Control"
    }
  ];

  const getPerformanceColor = (teamAvg: number, comparison: number) => {
    if (teamAvg > comparison + 0.3) return "text-green-600";
    if (teamAvg > comparison) return "text-blue-600";
    if (teamAvg > comparison - 0.3) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceIcon = (teamAvg: number, comparison: number) => {
    if (teamAvg > comparison + 0.3) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (teamAvg > comparison) return <Target className="h-4 w-4 text-blue-600" />;
    return <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />;
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return "bg-green-100 text-green-800";
    if (percentile >= 60) return "bg-blue-100 text-blue-800";
    if (percentile >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center space-x-3">
              <Select value={selectedAge} onValueChange={setSelectedAge}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="u10">U10</SelectItem>
                  <SelectItem value="u12">U12</SelectItem>
                  <SelectItem value="u14">U14</SelectItem>
                  <SelectItem value="u16">U16</SelectItem>
                  <SelectItem value="u18">U18</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soccer">Soccer</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="baseball">Baseball</SelectItem>
                  <SelectItem value="volleyball">Volleyball</SelectItem>
                </SelectContent>
              </Select>

              <Select value={comparisonType} onValueChange={setComparisonType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="league">League Comparison</SelectItem>
                  <SelectItem value="national">National Comparison</SelectItem>
                  <SelectItem value="top10">Top 10% Comparison</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Badge variant="outline" className="ml-auto">
              <Globe className="h-3 w-3 mr-1" />
              Based on 12,450 players
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Skill Benchmarking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={benchmarkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="teamAvg" fill="#3b82f6" name="Your Team" />
                <Bar dataKey="leagueAvg" fill="#94a3b8" name="League Average" />
                <Bar dataKey="nationalAvg" fill="#f59e0b" name="National Average" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarBenchmarkData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar name="Your Team" dataKey="Your Team" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Radar name="League Avg" dataKey="League Average" stroke="#94a3b8" fill="none" strokeDasharray="5 5" />
                <Radar name="Top 10%" dataKey="Top 10%" stroke="#10b981" fill="none" strokeDasharray="3 3" />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Skill Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {benchmarkData.map((skill, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{skill.skill}</span>
                    {getPerformanceIcon(skill.teamAvg, skill.leagueAvg)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {skill.playerCount} players tracked
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Your Team</p>
                    <p className="text-lg font-bold text-blue-600">{skill.teamAvg}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">League Average</p>
                    <p className={`text-lg font-bold ${getPerformanceColor(skill.teamAvg, skill.leagueAvg)}`}>
                      {skill.leagueAvg}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">National Average</p>
                    <p className={`text-lg font-bold ${getPerformanceColor(skill.teamAvg, skill.nationalAvg)}`}>
                      {skill.nationalAvg}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Top 10%</p>
                    <p className="text-lg font-bold text-green-600">{skill.topPercentile}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress to Top 10%</span>
                    <span>{Math.round((skill.teamAvg / skill.topPercentile) * 100)}%</span>
                  </div>
                  <Progress value={(skill.teamAvg / skill.topPercentile) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Player Benchmarking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Individual Player Benchmarks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {playerComparisons.map((player, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-gray-600">Overall: {player.overall}/5.0</p>
                  </div>
                  
                  <Badge className={getPercentileColor(player.percentile)}>
                    {player.percentile}th percentile
                  </Badge>
                  
                  <div className="text-sm">
                    <span className="text-green-600 font-medium">{player.aboveLeague}</span>
                    <span className="text-gray-600"> vs league</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <p className="text-green-600 font-medium">Strength</p>
                    <p className="text-gray-600">{player.topSkill}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-orange-600 font-medium">Focus Area</p>
                    <p className="text-gray-600">{player.weakSkill}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goal Setting */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-green-600" />
            <span>Benchmark Goals</span>
            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-xs">
              <Zap className="h-3 w-3 mr-1" />
              AI Recommended
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Short Term (1 Month)</span>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Shooting: Reach 3.5 average (league level)</li>
                <li>• Ball Control: Maintain 3.8+ average</li>
                <li>• Team ranking: Top 3 in league</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium">Medium Term (3 Months)</span>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Overall: Reach top 20% nationally</li>
                <li>• Shooting: 3.8+ average (above league)</li>
                <li>• Speed: Improve to 3.8 average</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Long Term (6 Months)</span>
              </div>
              <ul className="text-sm space-y-1">
                <li>• Overall: Top 10% in all categories</li>
                <li>• Regional tournament ready</li>
                <li>• Player development pathway clear</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}