import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
	BookOpen,
	CheckCircle,
	XCircle,
	MessageSquare,
	Sparkles,
	Filter,
	StickyNote,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Question {
	id: string;
	question: string;
	answer_a: string;
	answer_b: string;
	answer_c: string;
	answer_d: string;
	correct_answer: string;
	category: string;
	explanation: string | null;
}

type DisplayAnswer = {
	text: string;
	isCorrect: boolean;
};

const CATEGORIES = [
	{ value: "all", label: "Wszystkie kategorie" },
	{ value: "air_law", label: "Prawo lotnicze" },
	{
		value: "aircraft_general_knowledge",
		label: "Ogólna wiedza o statku powietrznym",
	},
	{ value: "flight_performance_planning", label: "Osiągi i planowanie lotu" },
	{ value: "meteorology", label: "Meteorologia" },
	{ value: "navigation", label: "Nawigacja" },
	{ value: "operational_procedures", label: "Procedury operacyjne" },
	{ value: "principles_of_flight", label: "Zasady lotu" },
	{ value: "communications", label: "Łączność" },
	{ value: "human_performance", label: "Człowiek – możliwości i ograniczenia" },
];

const Learn = () => {
	const [question, setQuestion] = useState<Question | null>(null);
	const [answers, setAnswers] = useState<DisplayAnswer[]>([]);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [showResult, setShowResult] = useState(false);
	const [loading, setLoading] = useState(false);
	const [explanations, setExplanations] = useState<string[]>([]);
	const [userQuestion, setUserQuestion] = useState("");
	const [askingAI, setAskingAI] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [questionHistory, setQuestionHistory] = useState<Question[]>([]);
	const [noteDialogOpen, setNoteDialogOpen] = useState(false);
	const [noteTitle, setNoteTitle] = useState("");
	const [noteContent, setNoteContent] = useState("");
	const { toast } = useToast();

	const loadRandomQuestion = async (saveToHistory = true) => {
		setLoading(true);
		setSelectedIndex(null);
		setShowResult(false);
		setExplanations([]);
		setUserQuestion("");
		setAnswers([]);

		if (saveToHistory && question) {
			setQuestionHistory((prev) => [...prev, question]);
		}

		try {
			let query = supabase.from("questions").select("*");

			if (selectedCategory !== "all") {
				query = query.eq("category", selectedCategory as any);
			}

			const { data, error } = await query.limit(100);

			if (error) throw error;

			if (data && data.length > 0) {
				const randomIndex = Math.floor(Math.random() * data.length);
				setQuestion(data[randomIndex]);
			} else {
				toast({
					title: "Brak pytań",
					description:
						selectedCategory !== "all"
							? "Brak pytań w wybranej kategorii. Administrator musi załadować pytania."
							: "Administrator musi najpierw załadować pytania do bazy.",
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

	// Shuffle helper
	const shuffle = <T,>(arr: T[]): T[] => {
		const copy = [...arr];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	};

	// Build and shuffle answers whenever question changes
	useEffect(() => {
		if (!question) {
			setAnswers([]);
			return;
		}
		const raw: DisplayAnswer[] = [
			{ text: question.answer_a, isCorrect: question.correct_answer === "A" },
			{ text: question.answer_b, isCorrect: question.correct_answer === "B" },
			{ text: question.answer_c, isCorrect: question.correct_answer === "C" },
			{ text: question.answer_d, isCorrect: question.correct_answer === "D" },
		];
		setAnswers(shuffle(raw));
	}, [question]);

	const handleAnswer = async (index: number) => {
		setSelectedIndex(index);
		setShowResult(true);

		const picked = answers[index];
		const isCorrect = !!picked?.isCorrect;

		// First, check if question has a pre-generated explanation
		if (question?.explanation) {
			setExplanations([question.explanation]);
		}

		// Save progress
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user && question) {
				await supabase.from("user_progress").insert({
					user_id: user.id,
					question_id: question.id,
					is_correct: isCorrect,
				});
			}
		} catch (error) {
			console.error("Error saving progress:", error);
		}
	};

	const getAIExplanation = async (customQuestion?: string) => {
		if (!question) return;

		setAskingAI(true);
		try {
			const correctAnswerText =
				answers.find((a) => a.isCorrect)?.text ||
				(question[
					`answer_${question.correct_answer.toLowerCase()}` as keyof Question
				] as string);

			const { data, error } = await supabase.functions.invoke("ai-explain", {
				body: {
					question: question.question,
					answer: correctAnswerText,
					userQuestion: customQuestion || null,
				},
			});

			if (error) throw error;

			setExplanations((prev) => [...prev, data.explanation]);
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

	const handlePreviousQuestion = () => {
		if (questionHistory.length === 0) return;

		const previousQuestion = questionHistory[questionHistory.length - 1];
		setQuestionHistory((prev) => prev.slice(0, -1));
		setQuestion(previousQuestion);
		setSelectedIndex(null);
		setShowResult(false);
		setExplanations([]);
		setUserQuestion("");
	};

	const handleSaveNote = async () => {
		if (!noteTitle.trim()) {
			toast({
				title: "Błąd",
				description: "Tytuł notatki jest wymagany",
				variant: "destructive",
			});
			return;
		}

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Musisz być zalogowany");

			const { error } = await supabase.from("user_notes").insert({
				user_id: user.id,
				title: noteTitle,
				content: noteContent || question?.question || "",
				link: "",
				tags: "",
			});

			if (error) throw error;

			toast({
				title: "Sukces",
				description: "Notatka została dodana",
			});

			setNoteDialogOpen(false);
			setNoteTitle("");
			setNoteContent("");
		} catch (error: any) {
			toast({
				title: "Błąd",
				description: error.message,
				variant: "destructive",
			});
		}
	};

	// Show welcome toast only on first visit
	useEffect(() => {
		const checkFirstVisit = async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user) return;

				const storageKey = `learn_first_visit_${user.id}`;
				const hasSeenWelcome = localStorage.getItem(storageKey);

				if (!hasSeenWelcome) {
					toast({
						title: "Witaj w trybie nauki!",
						description:
							"Jeżeli pojawią się jakieś błędy, prosimy o kontakt w celu ich poprawy. Z góry dziękujemy za wyrozumiałość.",
						duration: 8000,
					});
					localStorage.setItem(storageKey, "true");
				}
			} catch (error) {
				console.error("Error checking first visit:", error);
			}
		};

		checkFirstVisit();
	}, []);

	useEffect(() => {
		loadRandomQuestion();
	}, [selectedCategory]);

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

	// answers are prepared in state with random order
	const isCorrect = selectedIndex !== null && answers[selectedIndex]?.isCorrect;

	return (
		<div className="max-w-4xl space-y-6">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold flex items-center gap-2">
							<BookOpen className="h-8 w-8 text-primary" />
							Tryb nauki
						</h1>
						<p className="text-muted-foreground mt-1">
							Ucz się w swoim tempie z wyjaśnieniami
						</p>
					</div>
					{question.category && (
						<Badge variant="secondary" className="capitalize">
							{CATEGORIES.find((c) => c.value === question.category)?.label ||
								question.category.replace(/_/g, " ")}
						</Badge>
					)}
				</div>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-base flex items-center gap-2">
							<Filter className="h-4 w-4" />
							Wybierz kategorię pytań
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Select
							value={selectedCategory}
							onValueChange={setSelectedCategory}
						>
							<SelectTrigger>
								<SelectValue placeholder="Wybierz kategorię" />
							</SelectTrigger>
							<SelectContent>
								{CATEGORIES.map((category) => (
									<SelectItem key={category.value} value={category.value}>
										{category.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</CardContent>
				</Card>

				{questionHistory.length > 0 && (
					<Button variant="outline" onClick={handlePreviousQuestion}>
						Poprzednie pytanie
					</Button>
				)}
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-xl">{question.question}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{answers.map((answer, index) => {
						const isSelected = selectedIndex === index;
						const isCorrectAnswer = answer.isCorrect;

						let buttonClass = "w-full justify-start text-left h-auto py-4 px-4";
						if (showResult) {
							if (isCorrectAnswer) {
								buttonClass +=
									" bg-success/20 border-success hover:bg-success/30";
							} else if (isSelected && !isCorrect) {
								buttonClass +=
									" bg-destructive/20 border-destructive hover:bg-destructive/30";
							}
						}

						return (
							<Button
								key={index}
								variant={isSelected && !showResult ? "default" : "outline"}
								className={buttonClass}
								onClick={() => !showResult && handleAnswer(index)}
								disabled={showResult}
							>
								<span className="flex-1 break-words whitespace-normal overflow-wrap-anywhere">
									{answer.text}
								</span>
								{showResult && isCorrectAnswer && (
									<CheckCircle className="h-5 w-5 text-success ml-2 flex-shrink-0" />
								)}
								{showResult && isSelected && !isCorrect && (
									<XCircle className="h-5 w-5 text-destructive ml-2 flex-shrink-0" />
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
							<CardDescription className="text-base mt-2">
								Prawidłowa odpowiedź:{" "}
								<strong>
									{answers.find((a) => a.isCorrect)?.text ||
										(question[
											`answer_${question.correct_answer.toLowerCase()}` as keyof Question
										] as string)}
								</strong>
							</CardDescription>
						)}
					</CardHeader>
					<CardContent className="space-y-4">
						{explanations.length > 0 && explanations[0] && (
							<div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
								<div className="flex items-center gap-2 mb-2">
									<Sparkles className="h-4 w-4 text-primary" />
									<span className="text-sm font-semibold">Wyjaśnienie</span>
								</div>
								<p className="text-sm whitespace-pre-wrap">{explanations[0]}</p>
							</div>
						)}

						<div className="flex gap-2">
							<Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
								<DialogTrigger asChild>
									<Button variant="outline" className="flex-1">
										<StickyNote className="h-4 w-4 mr-2" />
										Dodaj notatkę
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Nowa notatka</DialogTitle>
										<DialogDescription>
											Zapisz notatkę związaną z tym pytaniem
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div className="space-y-2">
											<Label htmlFor="note-title">Tytuł</Label>
											<Input
												id="note-title"
												placeholder="Tytuł notatki"
												value={noteTitle}
												onChange={(e) => setNoteTitle(e.target.value)}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="note-content">Treść</Label>
											<Textarea
												id="note-content"
												placeholder="Treść notatki"
												value={noteContent}
												onChange={(e) => setNoteContent(e.target.value)}
												rows={5}
											/>
										</div>
									</div>
									<div className="flex gap-2">
										<Button onClick={handleSaveNote} className="flex-1">
											Zapisz
										</Button>
										<Button
											variant="outline"
											onClick={() => setNoteDialogOpen(false)}
										>
											Anuluj
										</Button>
									</div>
								</DialogContent>
							</Dialog>
							<Button onClick={() => loadRandomQuestion()} className="flex-1">
								Następne pytanie
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{showResult && explanations.length > 1 && (
				<Card className="border-primary/30">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<MessageSquare className="h-5 w-5 text-primary" />
							Odpowiedź AI
						</CardTitle>
					</CardHeader>
					<CardContent>
						{askingAI && (
							<div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-4">
								<div className="flex items-center gap-3">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
									<span className="font-medium text-sm">
										Przygotowywanie wyjaśnienia...
									</span>
								</div>
							</div>
						)}
						<div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
							{explanations.slice(1).map((explanation, index) => (
								<div
									key={index}
									className="p-4 bg-primary/5 rounded-lg border border-primary/20"
								>
									<p className="text-sm whitespace-pre-wrap">{explanation}</p>
								</div>
							))}
						</div>
						<div className="space-y-2 mt-4">
							<div className="flex items-center gap-2">
								<MessageSquare className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">
									Zapytaj AI o więcej szczegółów
								</span>
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
					</CardContent>
				</Card>
			)}

			{showResult && explanations.length <= 1 && (
				<Card className="border-primary/30">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<MessageSquare className="h-5 w-5 text-primary" />
							Zapytaj AI
						</CardTitle>
					</CardHeader>
					<CardContent>
						{askingAI && (
							<div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-4">
								<div className="flex items-center gap-3">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
									<span className="font-medium text-sm">
										Przygotowywanie wyjaśnienia...
									</span>
								</div>
							</div>
						)}
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<MessageSquare className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">
									Zapytaj AI o szczegóły
								</span>
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
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default Learn;
