import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
	BarChart3,
	TrendingUp,
	Award,
	Target,
	Calendar,
	FolderOpen,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = [
	{ value: "operational_procedures", label: "Procedury operacyjne" },
	{ value: "flight_performance_planning", label: "Osiągi i planowanie" },
	{ value: "meteorology", label: "Meteorologia" },
	{ value: "navigation", label: "Nawigacja" },
	{ value: "aircraft_general_knowledge", label: "Wiedza ogólna o samolocie" },
	{ value: "principles_of_flight", label: "Zasady lotu" },
	{ value: "communications", label: "Łączność" },
	{ value: "air_law", label: "Prawo lotnicze" },
];

const Stats = () => {
	const [stats, setStats] = useState({
		totalAnswered: 0,
		correctAnswers: 0,
		accuracy: 0,
		examsCompleted: 0,
		avgExamScore: 0,
		bestExamScore: 0,
		recentProgress: [] as { date: string; correct: number; total: number }[],
	});
	const [categoryStats, setCategoryStats] = useState<
		Record<
			string,
			{ correct: number; total: number; examScore: number; examCount: number }
		>
	>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadStats();
	}, []);

	const loadStats = async () => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;

			const [{ data: progress }, { data: exams }] = await Promise.all([
				supabase.from("user_progress").select("*").eq("user_id", user.id),
				supabase
					.from("exam_sessions")
					.select("*")
					.eq("user_id", user.id)
					.not("score", "is", null)
					.order("completed_at", { ascending: false }),
			]);

			const totalAnswered = progress?.length || 0;
			const correctAnswers = progress?.filter((p) => p.is_correct).length || 0;
			const accuracy =
				totalAnswered > 0 ? (correctAnswers / totalAnswered) * 100 : 0;

			const examsCompleted = exams?.length || 0;
			const avgExamScore =
				examsCompleted > 0
					? exams!.reduce((sum, e) => sum + (e.score || 0), 0) / examsCompleted
					: 0;
			const bestExamScore =
				examsCompleted > 0 ? Math.max(...exams!.map((e) => e.score || 0)) : 0;

			// Calculate recent progress (last 7 days)
			const recentProgress = [];
			for (let i = 6; i >= 0; i--) {
				const date = new Date();
				date.setDate(date.getDate() - i);
				const dateStr = date.toISOString().split("T")[0];

				const dayProgress = progress?.filter((p) => {
					const pDate = new Date(p.answered_at).toISOString().split("T")[0];
					return pDate === dateStr;
				});

				recentProgress.push({
					date: dateStr,
					correct: dayProgress?.filter((p) => p.is_correct).length || 0,
					total: dayProgress?.length || 0,
				});
			}

			// Calculate category statistics
			const catStats: Record<
				string,
				{ correct: number; total: number; examScore: number; examCount: number }
			> = {};

			// ✅ Nowa wersja – tylko 2 zapytania do Supabase
			if (progress && progress.length > 0) {
				const questionIds = progress.map((p) => p.question_id);

				// Pobierz wszystkie kategorie dla tych pytań w jednym zapytaniu
				const { data: questionsData, error: qError } = await supabase
					.from("questions")
					.select("id, category")
					.in("id", questionIds);

				if (qError) {
					console.error("Błąd przy pobieraniu kategorii pytań:", qError);
				}

				// Utwórz mapę ID -> kategoria
				const questionMap = new Map(
					questionsData?.map((q) => [q.id, q.category])
				);

				// Oblicz statystyki
				for (const p of progress) {
					const category = questionMap.get(p.question_id);
					if (category) {
						if (!catStats[category]) {
							catStats[category] = {
								correct: 0,
								total: 0,
								examScore: 0,
								examCount: 0,
							};
						}
						catStats[category].total++;
						if (p.is_correct) catStats[category].correct++;
					}
				}
			}

			// Stats from exams per category
			if (exams) {
				for (const exam of exams) {
					const category = exam.category || "all";
					if (category !== "all") {
						if (!catStats[category]) {
							catStats[category] = {
								correct: 0,
								total: 0,
								examScore: 0,
								examCount: 0,
							};
						}
						catStats[category].examCount++;
						catStats[category].examScore += exam.score || 0;
					}
				}
			}

			setCategoryStats(catStats);

			setStats({
				totalAnswered,
				correctAnswers,
				accuracy,
				examsCompleted,
				avgExamScore,
				bestExamScore,
				recentProgress,
			});
		} catch (error) {
			console.error("Error loading stats:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-muted-foreground">Ładowanie statystyk...</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold flex items-center gap-2">
					<BarChart3 className="h-8 w-8 text-primary" />
					Statystyki
				</h1>
				<p className="text-muted-foreground mt-1">
					Twój postęp w nauce do egzaminu PPLA
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Dokładność</CardTitle>
						<Target className="h-4 w-4 text-success" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Math.round(stats.accuracy)}%
						</div>
						<Progress value={stats.accuracy} className="mt-2" />
						<p className="text-xs text-muted-foreground mt-2">
							{stats.correctAnswers} / {stats.totalAnswered} poprawnych
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Egzaminy</CardTitle>
						<Award className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.examsCompleted}</div>
						<p className="text-xs text-muted-foreground mt-2">
							Ukończonych egzaminów
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Średni wynik</CardTitle>
						<TrendingUp className="h-4 w-4 text-accent" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Math.round(stats.avgExamScore)}%
						</div>
						<p className="text-xs text-muted-foreground mt-2">
							Z egzaminów próbnych
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Najlepszy wynik
						</CardTitle>
						<Award className="h-4 w-4 text-success" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Math.round(stats.bestExamScore)}%
						</div>
						<p className="text-xs text-muted-foreground mt-2">
							{stats.bestExamScore >= 75 ? "Zdany!" : "Próbuj dalej!"}
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="overall" className="space-y-4">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="overall">Ogólne</TabsTrigger>
					<TabsTrigger value="categories">Kategorie</TabsTrigger>
				</TabsList>

				<TabsContent value="overall" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								Postęp w ostatnich 7 dniach
							</CardTitle>
							<CardDescription>
								Liczba poprawnych odpowiedzi każdego dnia
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{stats.recentProgress.map((day) => {
									const percentage =
										day.total > 0 ? (day.correct / day.total) * 100 : 0;
									const date = new Date(day.date);
									const formattedDate = date.toLocaleDateString("pl-PL", {
										weekday: "short",
										day: "numeric",
										month: "short",
									});

									return (
										<div key={day.date} className="space-y-1">
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">
													{formattedDate}
												</span>
												<span className="font-medium">
													{day.correct} / {day.total}
												</span>
											</div>
											<Progress value={percentage} />
										</div>
									);
								})}
							</div>

							{stats.totalAnswered === 0 && (
								<div className="text-center py-8 text-muted-foreground">
									Zacznij naukę, aby zobaczyć swoje statystyki!
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="categories" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FolderOpen className="h-5 w-5" />
								Statystyki według kategorii
							</CardTitle>
							<CardDescription>
								Twoje wyniki w poszczególnych kategoriach
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								{CATEGORIES.map((category) => {
									const catData = categoryStats[category.value];
									const learningAccuracy =
										catData?.total > 0
											? (catData.correct / catData.total) * 100
											: 0;
									const examAvg =
										catData?.examCount > 0
											? catData.examScore / catData.examCount
											: 0;

									return (
										<div key={category.value} className="space-y-2">
											<div className="flex items-center justify-between">
												<h4 className="font-medium text-sm">
													{category.label}
												</h4>
												<div className="flex gap-4 text-xs text-muted-foreground">
													<span>Nauka: {Math.round(learningAccuracy)}%</span>
													{examAvg > 0 && (
														<span>Egzamin: {Math.round(examAvg)}%</span>
													)}
												</div>
											</div>
											<Progress value={learningAccuracy} />
											<div className="flex justify-between text-xs text-muted-foreground">
												<span>
													{catData?.correct || 0} / {catData?.total || 0}{" "}
													poprawnych
												</span>
												{catData?.examCount > 0 && (
													<span>{catData.examCount} egzaminów</span>
												)}
											</div>
										</div>
									);
								})}
							</div>

							{Object.keys(categoryStats).length === 0 && (
								<div className="text-center py-8 text-muted-foreground">
									Zacznij naukę, aby zobaczyć statystyki kategorii!
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Stats;
