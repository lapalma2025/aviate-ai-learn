import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
	explanation: string;
}

interface Answer {
	questionIndex: number;
	isCorrect: boolean;
	selectedAnswer: string;
}

const MetarQuiz = () => {
	const [icao, setIcao] = useState<string>("");
	const [metarData, setMetarData] = useState<MetarData | null>(null);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [showResult, setShowResult] = useState(false);
	const [loading, setLoading] = useState(false);
	const [answerFeedback, setAnswerFeedback] = useState<{
		show: boolean;
		correct: boolean;
	}>({ show: false, correct: false });
	const { toast } = useToast();

	const parseMetar = (metarText: string): MetarData | null => {
		try {
			const lines = metarText.trim().split("\n");
			const metarLine = lines[1] || lines[0];

			// Extract wind direction and speed (format: 27010KT means 270° at 10kt)
			const windMatch = metarLine.match(/(\d{3})(\d{2,3})(G\d{2,3})?KT/);
			const windSpeed = windMatch ? parseInt(windMatch[2]) : 0;

			// Extract visibility in meters
			const visMatch = metarLine.match(/\s(\d{4})\s/);
			const visibilityMeters = visMatch ? parseInt(visMatch[1]) : 10000;
			const visibility = visibilityMeters / 1000;

			// Determine flight rules
			let flightRules = "VFR";
			if (visibility < 1.5 || metarLine.includes("OVC0")) {
				flightRules = "LIFR";
			} else if (visibility < 5 || metarLine.match(/OVC0[0-2]/)) {
				flightRules = "IFR";
			} else if (visibility < 8 || metarLine.match(/BKN0[0-2]/)) {
				flightRules = "MVFR";
			}

			return {
				icao: metarLine.split(" ")[0],
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
			const response = await fetch(
				`https://api.allorigins.win/raw?url=https://tgftp.nws.noaa.gov/data/observations/metar/stations/${icaoCode}.TXT`
			);
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
		const allQuestions: Question[] = [];
		const windSpeed = data.wind_speed;
		const visibility = data.visibility;
		const flightRules = data.flight_rules;

		// Pytanie 1: Prędkość wiatru
		allQuestions.push({
			question: "Jaka jest prędkość wiatru (w węzłach)?",
			correct: `${windSpeed} kt`,
			options: [
				windSpeed,
				windSpeed + 5,
				Math.max(0, windSpeed - 3),
				windSpeed + 10,
			]
				.sort(() => Math.random() - 0.5)
				.map((v) => `${v} kt`),
			explanation: `W METAR prędkość wiatru podawana jest w formacie: kierunek (3 cyfry) + prędkość (2-3 cyfry) + KT. Np. "27010KT" oznacza wiatr z kierunku 270° z prędkością 10 węzłów.`,
		});

		// Pytanie 2: Warunki lotu
		allQuestions.push({
			question: "Jakie są warunki lotu?",
			correct: flightRules,
			options: ["VFR", "IFR", "MVFR", "LIFR"].sort(() => Math.random() - 0.5),
			explanation: `Warunki lotu: VFR (>8km, >1500ft), MVFR (5-8km), IFR (1.5-5km), LIFR (<1.5km widzialność). Zależą od widzialności i pułapu chmur.`,
		});

		// Pytanie 3: Widzialność
		const visKm = visibility.toFixed(1);
		allQuestions.push({
			question: "Jaka jest widzialność (w km)?",
			correct: `${visKm} km`,
			options: [
				visibility,
				visibility + 2,
				Math.max(0.5, visibility - 1.5),
				Math.min(10, visibility + 3),
			]
				.sort(() => Math.random() - 0.5)
				.map((v) => `${v.toFixed(1)} km`),
			explanation: `Widzialność w METAR podawana jest w metrach (4 cyfry). 9999 oznacza 10km lub więcej. Np. 5000 = 5km widzialności.`,
		});

		// Pytanie 4: Czy widzialność jest wystarczająca dla VFR?
		allQuestions.push({
			question: "Czy widzialność jest wystarczająca dla VFR?",
			correct: visibility >= 8 ? "Tak" : "Nie",
			options: ["Tak", "Nie", "Tylko w dzień", "Tylko w nocy"].sort(
				() => Math.random() - 0.5
			),
			explanation: `VFR wymaga minimum 8km widzialności i 1500ft pułapu chmur. Poniżej tego to warunki MVFR lub gorsze.`,
		});

		// Pytanie 5: Kategoria wiatru
		allQuestions.push({
			question: "Jak można zakwalifikować siłę wiatru?",
			correct:
				windSpeed < 10 ? "Słaby" : windSpeed < 20 ? "Umiarkowany" : "Silny",
			options: ["Słaby", "Umiarkowany", "Silny", "Bardzo silny"].sort(
				() => Math.random() - 0.5
			),
			explanation: `Wiatr: <10kt = słaby, 10-20kt = umiarkowany, >20kt = silny. Wartości podawane są w węzłach (1kt ≈ 1.852 km/h).`,
		});

		// Pytanie 6: Bezpieczne warunki
		allQuestions.push({
			question: "Czy te warunki są bezpieczne dla początkującego pilota?",
			correct: flightRules === "VFR" && windSpeed < 15 ? "Tak" : "Nie",
			options: [
				"Tak",
				"Nie",
				"Tylko z instruktorem",
				"Zależy od doświadczenia",
			].sort(() => Math.random() - 0.5),
			explanation: `Początkujący piloci powinni latać w warunkach VFR z wiatrem <15kt. IFR i silny wiatr wymagają większego doświadczenia.`,
		});

		// Pytanie 7: Format METAR
		allQuestions.push({
			question: "Jaka jest kolejność informacji w METAR?",
			correct: "ICAO, data, wiatr, widzialność",
			options: [
				"ICAO, data, wiatr, widzialność",
				"Wiatr, ICAO, data, widzialność",
				"Data, ICAO, widzialność, wiatr",
				"Widzialność, wiatr, ICAO, data",
			].sort(() => Math.random() - 0.5),
			explanation: `METAR ma stały format: kod ICAO → data/czas → wiatr → widzialność → zjawiska → chmury → temperatura → ciśnienie.`,
		});

		// Pytanie 8: Kiedy sprawdzać METAR
		allQuestions.push({
			question: "Jak często należy sprawdzać METAR przed lotem?",
			correct: "Co godzinę",
			options: [
				"Co 15 minut",
				"Co godzinę",
				"Raz dziennie",
				"Co 6 godzin",
			].sort(() => Math.random() - 0.5),
			explanation: `METAR wydawany jest co godzinę (pełne godziny) lub częściej przy znaczących zmianach pogody. Zawsze sprawdzaj przed startem!`,
		});

		// Pytanie 9: Minimalna widzialność VFR
		allQuestions.push({
			question: "Jaka jest minimalna widzialność dla VFR?",
			correct: "8 km",
			options: ["5 km", "8 km", "10 km", "15 km"].sort(
				() => Math.random() - 0.5
			),
			explanation: `VFR wymaga minimum 8km widzialności. 5-8km to MVFR, <5km to IFR, <1.5km to LIFR.`,
		});

		// Pytanie 10: Znaczenie KT
		allQuestions.push({
			question: "Co oznacza KT w METAR?",
			correct: "Węzły (knots)",
			options: [
				"Węzły (knots)",
				"Kilometry",
				"Kierunek wiatru",
				"Temperatura",
			].sort(() => Math.random() - 0.5),
			explanation: `KT = knots (węzły). Jednostka prędkości używana w lotnictwie. 1 węzeł ≈ 1.852 km/h ≈ 0.514 m/s.`,
		});

		// Losuj 10 pytań z wszystkich
		const selectedQuestions = allQuestions
			.sort(() => Math.random() - 0.5)
			.slice(0, 10);

		setQuestions(selectedQuestions);
	};

	const startQuiz = () => {
		const randomIcao =
			ICAO_AIRPORTS[Math.floor(Math.random() * ICAO_AIRPORTS.length)];
		setIcao(randomIcao);
		setCurrentQuestion(0);
		setAnswers([]);
		setShowResult(false);
		setAnswerFeedback({ show: false, correct: false });
		fetchMetar(randomIcao);
	};

	const handleAnswer = (selectedOption: string) => {
		const isCorrect = selectedOption === questions[currentQuestion].correct;

		setAnswers([
			...answers,
			{
				questionIndex: currentQuestion,
				isCorrect,
				selectedAnswer: selectedOption,
			},
		]);
		setAnswerFeedback({ show: true, correct: isCorrect });
	};

	const handleNextQuestion = () => {
		setAnswerFeedback({ show: false, correct: false });

		if (currentQuestion + 1 < questions.length) {
			setCurrentQuestion(currentQuestion + 1);
		} else {
			setShowResult(true);
		}
	};

	const refreshQuestions = () => {
		if (metarData) {
			setCurrentQuestion(0);
			setAnswers([]);
			setShowResult(false);
			setAnswerFeedback({ show: false, correct: false });
			generateQuestions(metarData);
		}
	};

	const calculateScore = () => {
		const correct = answers.filter((a) => a.isCorrect).length;
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
				<Card className="w-full max-w-3xl shadow-lg">
					<CardHeader className="text-center space-y-4">
						<div
							className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${
								score >= 70
									? "bg-green-100 text-green-600"
									: "bg-orange-100 text-orange-600"
							}`}
						>
							{score}%
						</div>
						<CardTitle className="text-3xl">
							{score >= 90
								? "🎉 Doskonale!"
								: score >= 70
								? "✅ Świetnie!"
								: "📚 Jeszcze trochę nauki"}
						</CardTitle>
						<CardDescription className="text-lg">
							Poprawne odpowiedzi: {answers.filter((a) => a.isCorrect).length} /{" "}
							{questions.length}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{metarData && (
							<div className="bg-muted/50 p-4 rounded-lg border">
								<p className="text-xs text-muted-foreground mb-2 font-semibold">
									METAR {icao}:
								</p>
								<p className="font-mono text-sm break-all leading-relaxed">
									{metarData.raw}
								</p>
							</div>
						)}

						<div className="space-y-3">
							<h3 className="font-semibold text-lg">Twoje odpowiedzi:</h3>
							{answers.map((answer, idx) => (
								<div
									key={idx}
									className={`p-3 rounded-lg border-l-4 ${
										answer.isCorrect
											? "bg-green-50 border-green-500"
											: "bg-red-50 border-red-500"
									}`}
								>
									<p className="font-medium">{questions[idx].question}</p>
									<p className="text-sm mt-1">
										{answer.isCorrect ? "✅" : "❌"} Twoja odpowiedź:{" "}
										<span className="font-semibold">
											{answer.selectedAnswer}
										</span>
									</p>
									{!answer.isCorrect && (
										<p className="text-sm mt-1 text-green-700">
											✓ Prawidłowa:{" "}
											<span className="font-semibold">
												{questions[idx].correct}
											</span>
										</p>
									)}
								</div>
							))}
						</div>

						<div className="flex gap-3 pt-4">
							<Button onClick={startQuiz} className="flex-1" size="lg">
								<RefreshCw className="mr-2 h-4 w-4" />
								Nowe lotnisko
							</Button>
							<Button
								onClick={refreshQuestions}
								variant="outline"
								className="flex-1"
								size="lg"
							>
								<RefreshCw className="mr-2 h-4 w-4" />
								Inne pytania
							</Button>
						</div>
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
			<Card className="w-full max-w-3xl shadow-lg">
				<CardHeader>
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<div className="bg-primary/10 p-2 rounded-full">
								<Plane className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Lotnisko
								</p>
								<p className="text-lg font-bold">{icao}</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-sm text-muted-foreground">Postęp</p>
							<p className="text-lg font-bold text-primary">
								{currentQuestion + 1} / {questions.length}
							</p>
						</div>
					</div>

					<div className="w-full bg-muted rounded-full h-2 mb-4">
						<div
							className="bg-primary h-2 rounded-full transition-all duration-300"
							style={{
								width: `${((currentQuestion + 1) / questions.length) * 100}%`,
							}}
						/>
					</div>

					<CardTitle className="text-2xl mb-3">{currentQ.question}</CardTitle>
					<CardDescription>
						<div className="bg-muted/50 p-4 rounded-lg border">
							<p className="text-xs text-muted-foreground mb-2 font-semibold">
								METAR:
							</p>
							<p className="font-mono text-xs break-all leading-relaxed">
								{metarData.raw}
							</p>
						</div>
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-3">
					{answerFeedback.show ? (
						<div className="space-y-4">
							<div
								className={`p-6 rounded-lg text-center border-2 ${
									answerFeedback.correct
										? "bg-green-50 border-green-500"
										: "bg-red-50 border-red-500"
								}`}
							>
								<p className="text-2xl font-bold mb-2">
									{answerFeedback.correct
										? "✅ Świetnie!"
										: "❌ Niestety, to nie ta odpowiedź"}
								</p>
								{!answerFeedback.correct && (
									<>
										<p className="text-base mb-3 font-semibold text-green-700">
											Prawidłowa odpowiedź: {currentQ.correct}
										</p>
										<div className="bg-white/50 p-4 rounded-lg border border-blue-200">
											<p className="text-sm text-left leading-relaxed">
												💡 <span className="font-semibold">Wyjaśnienie:</span>{" "}
												{currentQ.explanation}
											</p>
										</div>
									</>
								)}
							</div>
							<Button onClick={handleNextQuestion} className="w-full" size="lg">
								{currentQuestion + 1 < questions.length
									? "Następne pytanie"
									: "Zobacz wyniki"}
							</Button>
						</div>
					) : (
						<>
							{currentQ.options.map((option, index) => (
								<Button
									key={index}
									onClick={() => handleAnswer(option)}
									variant="outline"
									className="w-full justify-start text-left h-auto py-4 px-6 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-base"
								>
									<span className="font-bold mr-4 text-lg">
										{String.fromCharCode(65 + index)}.
									</span>
									<span>{option}</span>
								</Button>
							))}
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default MetarQuiz;
