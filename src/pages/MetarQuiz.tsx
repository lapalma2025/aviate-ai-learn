import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plane, RefreshCw, CloudRain } from "lucide-react";

const ICAO_AIRPORTS = ["EPWA", "EPKK", "EPGD", "EPPO", "EPWR", "EPRZ"];

interface MetarData {
  icao: string;
  raw: string;
  wind_speed: number;
  visibility: number;
  flight_rules: string;
}

interface Question {
  question: string;
  correct: string;
  options: string[];
}

interface Answer {
  questionIndex: number;
  isCorrect: boolean;
}

const MetarQuiz = () => {
  const [icao, setIcao] = useState<string>("");
  const [metarData, setMetarData] = useState<MetarData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<{show: boolean, correct: boolean}>({show: false, correct: false});
  const { toast } = useToast();

  const parseMetar = (metarText: string): MetarData | null => {
    try {
      const lines = metarText.trim().split('\n');
      const metarLine = lines[1] || lines[0]; // METAR is usually on second line
      
      // Extract wind speed (format: 27010KT means 270° at 10kt)
      const windMatch = metarLine.match(/\d{3}(\d{2,3})KT/);
      const windSpeed = windMatch ? parseInt(windMatch[1]) : 0;
      
      // Extract visibility in meters (9999 = 10km+, or specific value like 5000)
      const visMatch = metarLine.match(/\s(\d{4})\s/);
      const visibilityMeters = visMatch ? parseInt(visMatch[1]) : 10000;
      const visibility = visibilityMeters / 1000; // Convert to km
      
      // Determine flight rules based on visibility and ceiling
      let flightRules = "VFR";
      if (visibility < 1.5 || metarLine.includes("OVC0")) {
        flightRules = "LIFR";
      } else if (visibility < 5 || metarLine.match(/OVC0[0-2]/)) {
        flightRules = "IFR";
      } else if (visibility < 8 || metarLine.match(/BKN0[0-2]/)) {
        flightRules = "MVFR";
      }
      
      return {
        icao: metarLine.split(' ')[0],
        raw: metarLine,
        wind_speed: windSpeed,
        visibility: visibility,
        flight_rules: flightRules,
      };
    } catch (error) {
      console.error("Error parsing METAR:", error);
      return null;
    }
  };

  const fetchMetar = async (icaoCode: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.allorigins.win/raw?url=https://tgftp.nws.noaa.gov/data/observations/metar/stations/${icaoCode}.TXT`);
      if (!response.ok) throw new Error("Błąd pobierania METAR");
      const text = await response.text();
      const parsed = parseMetar(text);
      
      if (!parsed) {
        throw new Error("Nie udało się sparsować METAR");
      }
      
      setMetarData(parsed);
      generateQuestions(parsed);
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać danych METAR. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = (data: MetarData) => {
    const newQuestions: Question[] = [];

    // Pytanie 1: Prędkość wiatru
    const windSpeed = data.wind_speed;
    const windOptions = [
      windSpeed,
      windSpeed + 5,
      Math.max(0, windSpeed - 3),
      windSpeed + 10,
    ].sort(() => Math.random() - 0.5);
    
    newQuestions.push({
      question: "Jaka jest prędkość wiatru (w węzłach)?",
      correct: `${windSpeed} kt`,
      options: windOptions.map(v => `${v} kt`),
    });

    // Pytanie 2: IFR czy VFR
    const flightRules = data.flight_rules;
    const rulesOptions = ["VFR", "IFR", "MVFR", "LIFR"];
    
    newQuestions.push({
      question: "Jakie są warunki lotu?",
      correct: flightRules,
      options: rulesOptions.sort(() => Math.random() - 0.5),
    });

    // Pytanie 3: Widzialność
    const visibility = data.visibility;
    const visibilityKm = visibility.toFixed(1);
    const visOptions = [
      visibility,
      visibility + 2,
      Math.max(0.5, visibility - 1.5),
      Math.min(10, visibility + 3),
    ].sort(() => Math.random() - 0.5);
    
    newQuestions.push({
      question: "Jaka jest widzialność (w km)?",
      correct: `${visibilityKm} km`,
      options: visOptions.map(v => `${v.toFixed(1)} km`),
    });

    setQuestions(newQuestions);
  };

  const startQuiz = () => {
    const randomIcao = ICAO_AIRPORTS[Math.floor(Math.random() * ICAO_AIRPORTS.length)];
    setIcao(randomIcao);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setAnswerFeedback({show: false, correct: false});
    fetchMetar(randomIcao);
  };

  const handleAnswer = (selectedOption: string) => {
    const isCorrect = selectedOption === questions[currentQuestion].correct;
    
    setAnswers([...answers, { questionIndex: currentQuestion, isCorrect }]);
    setAnswerFeedback({show: true, correct: isCorrect});

    setTimeout(() => {
      setAnswerFeedback({show: false, correct: false});
      
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const calculateScore = () => {
    const correct = answers.filter(a => a.isCorrect).length;
    return Math.round((correct / questions.length) * 100);
  };

  useEffect(() => {
    startQuiz();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-12 text-center">
            <CloudRain className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
            <p className="text-lg">Pobieranie danych METAR...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult) {
    const score = calculateScore();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Twój wynik</CardTitle>
            <CardDescription className="text-xl font-bold text-primary">
              {score}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-muted-foreground">
                Poprawne odpowiedzi: {answers.filter(a => a.isCorrect).length} / {questions.length}
              </p>
            </div>
            {metarData && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">METAR {icao}:</p>
                <p className="font-mono text-sm">{metarData.raw}</p>
              </div>
            )}
            <Button onClick={startQuiz} className="w-full" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Spróbuj ponownie
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metarData || questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">METAR {icao}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Pytanie {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <CardTitle className="text-2xl">{currentQ.question}</CardTitle>
          <CardDescription className="mt-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="font-mono text-xs break-all">{metarData.raw}</p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {answerFeedback.show ? (
            <div className={`p-8 rounded-lg text-center ${
              answerFeedback.correct 
                ? 'bg-green-500/10 border-2 border-green-500' 
                : 'bg-destructive/10 border-2 border-destructive'
            }`}>
              <p className="text-2xl font-bold">
                {answerFeedback.correct ? '✅ Poprawna odpowiedź!' : '❌ Błędna odpowiedź'}
              </p>
            </div>
          ) : (
            currentQ.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(option)}
                variant="outline"
                className="w-full justify-start text-left h-auto py-4 px-6 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <span className="font-bold mr-4">{String.fromCharCode(65 + index)}.</span>
                <span className="text-base">{option}</span>
              </Button>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MetarQuiz;