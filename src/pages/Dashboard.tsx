import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, FileQuestion, TrendingUp, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroAviation from "@/assets/hero-aviation.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
    recentExamScore: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get total questions
      const { count: totalQuestions } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true });

      // Get user progress
      const { data: progress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id);

      const answeredQuestions = progress?.length || 0;
      const correctAnswers = progress?.filter((p) => p.is_correct).length || 0;

      // Get most recent exam score
      const { data: recentExam } = await supabase
        .from("exam_sessions")
        .select("score")
        .eq("user_id", user.id)
        .not("score", "is", null)
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setStats({
        totalQuestions: totalQuestions || 0,
        answeredQuestions,
        correctAnswers,
        recentExamScore: recentExam?.score || 0,
      });
    };

    loadStats();
  }, []);

  const progressPercentage = stats.totalQuestions > 0 
    ? (stats.answeredQuestions / stats.totalQuestions) * 100 
    : 0;

  const accuracyPercentage = stats.answeredQuestions > 0
    ? (stats.correctAnswers / stats.answeredQuestions) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative h-64 rounded-xl overflow-hidden shadow-elevation">
        <img 
          src={heroAviation} 
          alt="Aviation" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 flex items-center">
          <div className="px-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Witaj w PPLA Academy</h1>
            <p className="text-xl opacity-95">Twoja droga do licencji pilota</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Postęp nauki</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            <Progress value={progressPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.answeredQuestions} z {stats.totalQuestions} pytań
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokładność</CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(accuracyPercentage)}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.correctAnswers} poprawnych odpowiedzi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ostatni egzamin</CardTitle>
            <FileQuestion className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentExamScore}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.recentExamScore >= 75 ? "Zaliczony!" : "Wymagane 75%"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pytania</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Dostępnych w bazie
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/50 hover:shadow-glow transition-shadow cursor-pointer" onClick={() => navigate("/learn")}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Tryb nauki</CardTitle>
                <CardDescription>Ucz się w swoim tempie z wyjaśnieniami AI</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Rozpocznij naukę</Button>
          </CardContent>
        </Card>

        <Card className="border-accent/50 hover:shadow-glow transition-shadow cursor-pointer" onClick={() => navigate("/exam")}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <FileQuestion className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle>Egzamin próbny</CardTitle>
                <CardDescription>50 losowych pytań, limit czasowy</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Zacznij egzamin</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
