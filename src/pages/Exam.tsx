import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileQuestion, Clock, CheckCircle, XCircle, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: string;
  question: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  correct_answer: string;
}

const EXAM_DURATION = 90 * 60; // 90 minutes in seconds
const TOTAL_QUESTIONS = 50;

const Exam = () => {
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && !examCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examCompleted, timeRemaining]);

  const startExam = async () => {
    try {
      // Fetch 50 random questions
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .limit(200);

      if (error) throw error;

      if (!data || data.length < TOTAL_QUESTIONS) {
        toast({
          title: "Za mało pytań",
          description: `Baza zawiera tylko ${data?.length || 0} pytań. Potrzebne minimum ${TOTAL_QUESTIONS}.`,
          variant: "destructive",
        });
        return;
      }

      // Shuffle and select 50 questions
      const shuffled = data.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, TOTAL_QUESTIONS);
      setQuestions(selectedQuestions);

      // Create exam session
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: session } = await supabase
          .from('exam_sessions')
          .insert({
            user_id: user.id,
            total_questions: TOTAL_QUESTIONS,
          })
          .select()
          .single();

        if (session) {
          setSessionId(session.id);
        }
      }

      setExamStarted(true);
      setTimeRemaining(EXAM_DURATION);
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [questions[currentIndex].id]: answer });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitExam = async () => {
    try {
      // Calculate score
      let correctCount = 0;
      const examAnswers = [];

      for (const question of questions) {
        const userAnswer = answers[question.id];
        const isCorrect = userAnswer === question.correct_answer;
        if (isCorrect) correctCount++;

        if (sessionId && userAnswer) {
          examAnswers.push({
            session_id: sessionId,
            question_id: question.id,
            selected_answer: userAnswer,
            is_correct: isCorrect,
          });
        }
      }

      const finalScore = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
      setScore(finalScore);

      // Save answers and update session
      if (sessionId) {
        await supabase.from('exam_answers').insert(examAnswers);
        await supabase
          .from('exam_sessions')
          .update({
            completed_at: new Date().toISOString(),
            score: finalScore,
            time_spent_seconds: EXAM_DURATION - timeRemaining,
          })
          .eq('id', sessionId);
      }

      setExamCompleted(true);

      toast({
        title: finalScore >= 75 ? "Gratulacje!" : "Spróbuj ponownie",
        description: `Twój wynik: ${finalScore}% (${correctCount}/${TOTAL_QUESTIONS})`,
        variant: finalScore >= 75 ? "default" : "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (examCompleted) {
    const passed = score >= 75;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className={passed ? "border-success" : "border-destructive"}>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              {passed ? (
                <Trophy className="h-16 w-16 text-success" />
              ) : (
                <FileQuestion className="h-16 w-16 text-destructive" />
              )}
            </div>
            <CardTitle className="text-center text-2xl">
              {passed ? "Egzamin zaliczony!" : "Nie zdałeś egzaminu"}
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Twój wynik: {score}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                {passed 
                  ? "Gratulacje! Jesteś gotowy do prawdziwego egzaminu PPLA."
                  : "Do zdania potrzebne jest minimum 75%. Przećwicz więcej w trybie nauki."}
              </p>
              <Progress value={score} className="h-3" />
            </div>
            <Button onClick={() => window.location.reload()} className="w-full">
              Spróbuj ponownie
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileQuestion className="h-8 w-8 text-accent" />
              Egzamin próbny PPLA
            </CardTitle>
            <CardDescription>
              Sprawdź swoją wiedzę przed prawdziwym egzaminem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">50 losowych pytań</p>
                  <p className="text-sm text-muted-foreground">
                    Z całej bazy pytań egzaminacyjnych
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">90 minut na rozwiązanie</p>
                  <p className="text-sm text-muted-foreground">
                    Tyle samo czasu co na prawdziwym egzaminie
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="font-medium">Wymagane 75% do zdania</p>
                  <p className="text-sm text-muted-foreground">
                    38 poprawnych odpowiedzi z 50
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-sm">
                <strong>Ważne:</strong> Po rozpoczęciu egzaminu nie będziesz mógł go przerwać.
                Timer będzie odliczał czas automatycznie.
              </p>
            </div>

            <Button onClick={startExam} className="w-full" size="lg">
              Rozpocznij egzamin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / TOTAL_QUESTIONS) * 100;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Egzamin próbny PPLA</h1>
          <p className="text-muted-foreground">
            Pytanie {currentIndex + 1} z {TOTAL_QUESTIONS}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Pozostały czas</p>
            <p className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-destructive' : 'text-foreground'}`}>
              {formatTime(timeRemaining)}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Odpowiedziane: {answeredCount}/{TOTAL_QUESTIONS}
            </span>
          </div>
          <Progress value={progressPercentage} />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {['A', 'B', 'C', 'D'].map((key) => {
            const answerText = currentQuestion[`answer_${key.toLowerCase()}` as keyof Question] as string;
            const isSelected = answers[currentQuestion.id] === key;

            return (
              <Button
                key={key}
                variant={isSelected ? "default" : "outline"}
                className="w-full justify-start text-left h-auto py-4 px-4 whitespace-normal"
                onClick={() => handleAnswer(key)}
              >
                <span className="font-bold mr-3 flex-shrink-0">{key}.</span>
                <span className="flex-1 break-words">{answerText}</span>
                {isSelected && <CheckCircle className="h-5 w-5 ml-2 flex-shrink-0" />}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          Poprzednie
        </Button>
        {currentIndex === questions.length - 1 ? (
          <Button onClick={handleSubmitExam} className="flex-1">
            Zakończ egzamin
          </Button>
        ) : (
          <Button onClick={handleNext} className="flex-1">
            Następne
          </Button>
        )}
      </div>
    </div>
  );
};

export default Exam;
