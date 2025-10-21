import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, CheckCircle, XCircle, MessageSquare, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  question: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  correct_answer: string;
  category: string;
}

const Learn = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState("");
  const [askingAI, setAskingAI] = useState(false);
  const { toast } = useToast();

  const loadRandomQuestion = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setShowResult(false);
    setExplanation("");
    setUserQuestion("");

    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .limit(100);

      if (error) throw error;

      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setQuestion(data[randomIndex]);
      } else {
        toast({
          title: "Brak pytań",
          description: "Administrator musi najpierw załadować pytania do bazy.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === question?.correct_answer;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && question) {
        await supabase.from('user_progress').insert({
          user_id: user.id,
          question_id: question.id,
          is_correct: isCorrect,
        });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }

    // Auto-explain if correct answer
    if (isCorrect) {
      getAIExplanation();
    }
  };

  const getAIExplanation = async (customQuestion?: string) => {
    if (!question) return;

    setAskingAI(true);
    try {
      const correctAnswerText = question[`answer_${question.correct_answer.toLowerCase()}` as keyof Question] as string;
      
      const { data, error } = await supabase.functions.invoke('ai-explain', {
        body: {
          question: question.question,
          answer: correctAnswerText,
          userQuestion: customQuestion || null,
        },
      });

      if (error) throw error;

      setExplanation(data.explanation);
    } catch (error: any) {
      toast({
        title: "Błąd AI",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAskingAI(false);
    }
  };

  const handleAskAI = () => {
    if (userQuestion.trim()) {
      getAIExplanation(userQuestion);
      setUserQuestion("");
    }
  };

  useEffect(() => {
    loadRandomQuestion();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Ładowanie pytania...</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Brak pytań</CardTitle>
            <CardDescription>
              Administrator musi najpierw załadować pytania do bazy danych.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const answers = [
    { key: 'A', text: question.answer_a },
    { key: 'B', text: question.answer_b },
    { key: 'C', text: question.answer_c },
    { key: 'D', text: question.answer_d },
  ];

  const isCorrect = selectedAnswer === question.correct_answer;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Tryb nauki
          </h1>
          <p className="text-muted-foreground mt-1">
            Ucz się w swoim tempie z wyjaśnieniami AI
          </p>
        </div>
        {question.category && (
          <Badge variant="secondary" className="capitalize">
            {question.category.replace(/_/g, ' ')}
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {answers.map((answer) => {
            const isSelected = selectedAnswer === answer.key;
            const isCorrectAnswer = answer.key === question.correct_answer;
            
            let buttonClass = "w-full justify-start text-left h-auto py-4 px-4";
            if (showResult) {
              if (isCorrectAnswer) {
                buttonClass += " bg-success/20 border-success hover:bg-success/30";
              } else if (isSelected && !isCorrect) {
                buttonClass += " bg-destructive/20 border-destructive hover:bg-destructive/30";
              }
            }

            return (
              <Button
                key={answer.key}
                variant={isSelected && !showResult ? "default" : "outline"}
                className={buttonClass}
                onClick={() => !showResult && handleAnswer(answer.key)}
                disabled={showResult}
              >
                <span className="font-bold mr-3">{answer.key}.</span>
                <span className="flex-1">{answer.text}</span>
                {showResult && isCorrectAnswer && (
                  <CheckCircle className="h-5 w-5 text-success ml-2" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 text-destructive ml-2" />
                )}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {showResult && (
        <Card className={isCorrect ? "border-success" : "border-destructive"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-6 w-6 text-success" />
                  Brawo! Odpowiedź prawidłowa
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-destructive" />
                  Nieprawidłowa odpowiedź
                </>
              )}
            </CardTitle>
            {!isCorrect && (
              <CardDescription>
                Prawidłowa odpowiedź to: {question.correct_answer}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {explanation && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Wyjaśnienie AI</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{explanation}</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Zapytaj AI o szczegóły</span>
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Np. 'Wyjaśnij to prostszym językiem' lub 'Dlaczego ta odpowiedź jest prawidłowa?'"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  className="flex-1"
                  rows={2}
                />
                <Button 
                  onClick={handleAskAI} 
                  disabled={!userQuestion.trim() || askingAI}
                  size="sm"
                >
                  {askingAI ? "..." : "Zapytaj"}
                </Button>
              </div>
            </div>

            <Button onClick={loadRandomQuestion} className="w-full">
              Następne pytanie
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Learn;
