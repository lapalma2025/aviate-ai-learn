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
import { Plane, RefreshCw, CloudRain, AlertCircle } from "lucide-react";

const ICAO_AIRPORTS = ["EPWA", "EPKK", "EPGD", "EPPO", "EPWR", "EPRZ"];

// Przykładowe dane METAR jako fallback
const FALLBACK_METAR_DATA = [
	{
		icao: "EPWA",
		raw: "EPWA 071130Z 27015KT 9999 FEW040 SCT120 08/02 Q1015 NOSIG",
		wind_speed: 15,
		visibility: 10,
		flight_rules: "VFR",
	},
	{
		icao: "EPKK",
		raw: "EPKK 071130Z 28008KT 6000 BKN015 05/03 Q1014 TEMPO 4000 BR",
		wind_speed: 8,
		visibility: 6,
		flight_rules: "MVFR",
	},
	{
		icao: "EPGD",
		raw: "EPGD 071130Z 30020G35KT 3000 -SN OVC008 02/00 Q1012 TEMPO 1500",
		wind_speed: 20,
		visibility: 3,
		flight_rules: "IFR",
	},
	{
		icao: "EPPO",
		raw: "EPPO 071130Z 25012KT 8000 FEW025 BKN080 07/04 Q1016 NOSIG",
		wind_speed: 12,
		visibility: 8,
		flight_rules: "VFR",
	},
	{
		icao: "EPWR",
		raw: "EPWR 071130Z 29005KT 1200 BR OVC004 03/02 Q1013 TEMPO 0800 FG",
		wind_speed: 5,
		visibility: 1.2,
		flight_rules: "LIFR",
	},
	{
		icao: "EPRZ",
		raw: "EPRZ 071130Z 31018KT 4500 -RA BKN012 04/02 Q1011 TEMPO 2000",
		wind_speed: 18,
		visibility: 4.5,
		flight_rules: "IFR",
	},
];

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
	const [usingFallback, setUsingFallback] = useState(false);
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

	const useFallbackData = (icaoCode: string) => {
		const fallbackData =
			FALLBACK_METAR_DATA.find((data) => data.icao === icaoCode) ||
			FALLBACK_METAR_DATA[
				Math.floor(Math.random() * FALLBACK_METAR_DATA.length)
			];

		setMetarData(fallbackData);
		setUsingFallback(true);
		generateQuestions(fallbackData);

		toast({
			title: "Tryb offline",
			description: "Używam przykładowych danych METAR. Quiz działa normalnie!",
			variant: "default",
		});
	};

	const fetchMetar = async (icaoCode: string) => {
		setLoading(true);
		setUsingFallback(false);

		// Lista API do sprawdzenia po kolei
		const metarAPIs = [
			{
				name: "AVWX (darmowe, bez klucza)",
				url: `https://avwx.rest/api/metar/${icaoCode}?options=info,translate`,
				headers: {},
				parse: async (response: Response) => {
					const json = await response.json();
					if (json.raw) {
						return parseMetar(json.raw);
					}
					return null;
				},
			},
			{
				name: "AWC Aviation Weather (oficjalne FAA)",
				url: `https://aviationweather.gov/api/data/metar?ids=${icaoCode}&format=raw`,
				headers: {},
				parse: async (response: Response) => {
					const text = await response.text();
					if (text && text.length > 10 && text.includes(icaoCode)) {
						return parseMetar(text);
					}
					return null;
				},
			},
			{
				name: "NOAA (AllOrigins proxy)",
				url: `https://api.allorigins.win/raw?url=https://tgftp.nws.noaa.gov/data/observations/metar/stations/${icaoCode}.TXT`,
				headers: {},
				parse: async (response: Response) => {
					const text = await response.text();
					if (text && text.length > 10 && text.includes(icaoCode)) {
						return parseMetar(text);
					}
					return null;
				},
			},
			{
				name: "NOAA (corsproxy.io)",
				url: `https://corsproxy.io/?https://tgftp.nws.noaa.gov/data/observations/metar/stations/${icaoCode}.TXT`,
				headers: {},
				parse: async (response: Response) => {
					const text = await response.text();
					if (text && text.length > 10 && text.includes(icaoCode)) {
						return parseMetar(text);
					}
					return null;
				},
			},
			{
				name: "CheckWX (może wymagać klucza)",
				url: `https://api.checkwx.com/metar/${icaoCode}/decoded`,
				headers: {},
				parse: async (response: Response) => {
					const json = await response.json();
					if (json.data && json.data[0]) {
						const rawText = json.data[0].raw_text || json.data[0];
						if (typeof rawText === "string") {
							return parseMetar(rawText);
						}
					}
					return null;
				},
			},
		];

		// Próbuj każde API po kolei
		for (const api of metarAPIs) {
			try {
				console.log(`🔄 Próba pobrania METAR z ${api.name}...`);

				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 5000);

				const response = await fetch(api.url, {
					signal: controller.signal,
					headers: api.headers,
					mode: "cors",
				});

				clearTimeout(timeoutId);

				if (!response.ok) {
					console.warn(`⚠️ ${api.name}: HTTP ${response.status}`);
					continue;
				}

				const parsed = await api.parse(response);

				if (parsed) {
					setMetarData(parsed);
					generateQuestions(parsed);
					console.log(`✅ Dane METAR pobrane z ${api.name}`);
					setLoading(false);
					return; // Sukces - wyjdź z funkcji
				} else {
					console.warn(`⚠️ ${api.name}: Nie udało się sparsować danych`);
				}
			} catch (error: any) {
				console.warn(
					`⚠️ ${api.name} nie odpowiada:`,
					error.message || "timeout"
				);
				continue; // Spróbuj następne API
			}
		}

		// Jeśli wszystkie API zawiodły, użyj fallback
		console.warn("⚠️ Wszystkie API zawiodły, przejście w tryb offline");
		useFallbackData(icaoCode);
		setLoading(false);
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

		// Dodatkowe pytania dla większej różnorodności

		// Pytanie 11: Kierunek wiatru
		const windDirMatch = data.raw.match(/(\d{3})\d{2,3}KT/);
		if (windDirMatch) {
			const windDir = parseInt(windDirMatch[1]);
			allQuestions.push({
				question: "Z jakiego kierunku wieje wiatr?",
				correct: `${windDir}°`,
				options: [
					`${windDir}°`,
					`${(windDir + 90) % 360}°`,
					`${(windDir + 180) % 360}°`,
					`${(windDir + 270) % 360}°`,
				].sort(() => Math.random() - 0.5),
				explanation: `Pierwsze 3 cyfry przed prędkością wiatru oznaczają kierunek w stopniach. 270 = zachód, 090 = wschód, 180 = południe, 360 = północ.`,
			});
		}

		// Pytanie 12: Zjawiska pogodowe
		allQuestions.push({
			question: "Które zjawisko pogodowe wymaga szczególnej ostrożności?",
			correct: "Mgła (FG)",
			options: [
				"Mgła (FG)",
				"Zamglenie (BR)",
				"Deszcz (RA)",
				"Pochmurno (OVC)",
			].sort(() => Math.random() - 0.5),
			explanation: `FG (fog/mgła) to najgroźniejsze zjawisko dla VFR - widzialność <1km. BR (mist) to zamglenie 1-5km. RA to deszcz, OVC to zachmurzenie całkowite.`,
		});

		// Pytanie 13: Temperatura i punkt rosy
		const tempMatch = data.raw.match(/\s(\d{2})\/(\d{2})\s/);
		if (tempMatch) {
			const temp = parseInt(tempMatch[1]);
			const dewPoint = parseInt(tempMatch[2]);
			const spread = temp - dewPoint;
			allQuestions.push({
				question: "Jaka jest różnica między temperaturą a punktem rosy?",
				correct: `${spread}°C`,
				options: [
					`${spread}°C`,
					`${spread + 2}°C`,
					`${Math.max(0, spread - 2)}°C`,
					`${spread + 4}°C`,
				].sort(() => Math.random() - 0.5),
				explanation: `Mała różnica (<3°C) między temperaturą a punktem rosy zwiększa ryzyko mgły. Format: TT/DD gdzie TT to temperatura, DD to punkt rosy.`,
			});
		}

		// Pytanie 14: Ciśnienie QNH
		const pressureMatch = data.raw.match(/Q(\d{4})/);
		if (pressureMatch) {
			const pressure = parseInt(pressureMatch[1]);
			allQuestions.push({
				question: "Jakie jest ciśnienie QNH?",
				correct: `${pressure} hPa`,
				options: [
					`${pressure} hPa`,
					`${pressure + 5} hPa`,
					`${pressure - 5} hPa`,
					`${pressure + 10} hPa`,
				].sort(() => Math.random() - 0.5),
				explanation: `QNH to ciśnienie atmosferyczne zredukowane do poziomu morza. Standardowe ciśnienie to 1013 hPa. Format: Q#### gdzie #### to wartość w hPa.`,
			});
		}

		// Pytanie 15: Zachmurzenie
		allQuestions.push({
			question: "Co oznacza skrót BKN w METAR?",
			correct: "Zachmurzenie umiarkowane (5-7/8)",
			options: [
				"Zachmurzenie umiarkowane (5-7/8)",
				"Zachmurzenie małe (1-2/8)",
				"Zachmurzenie duże (3-4/8)",
				"Bezchmurnie",
			].sort(() => Math.random() - 0.5),
			explanation: `SKC/CLR = bezchmurnie, FEW = 1-2/8, SCT = 3-4/8, BKN = 5-7/8, OVC = 8/8 (całkowite). Liczba po skrócie to wysokość w setkach stóp.`,
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
						<p className="text-sm text-muted-foreground mt-2">
							Sprawdzam dostępne źródła danych
						</p>
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
							{usingFallback && (
								<div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
									<AlertCircle className="h-4 w-4" />
									Tryb offline - przykładowe dane
								</div>
							)}
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

					{usingFallback && (
						<div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-sm text-yellow-800">
							<AlertCircle className="h-4 w-4" />
							Tryb offline - używam przykładowych danych METAR
						</div>
					)}

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
