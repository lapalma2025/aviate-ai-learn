import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
	Plane,
	BookOpen,
	Brain,
	Trophy,
	CheckCircle,
	Sparkles,
	Rocket,
	Award,
} from "lucide-react";
import heroImage from "@/assets/hero-aviation.jpg";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";

const Index = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 overflow-hidden">
			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
				{/* Background Image with Overlay */}
				<div
					className="absolute inset-0 z-0"
					style={{
						backgroundImage: `url(${heroImage})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				>
					<div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
				</div>

				{/* Content */}
				<div className="relative z-10 container mx-auto px-4 py-20">
					<div className="max-w-4xl mx-auto text-center space-y-8">
						<div
							className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm transition-all duration-700 ${
								isVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 -translate-y-4"
							}`}
						>
							<Sparkles className="h-4 w-4 text-primary" />
							<span className="text-sm font-medium">
								Platforma przygotowująca do Egzaminu PPLA
							</span>
						</div>

						<h1
							className={`text-5xl md:text-7xl font-bold tracking-tight transition-all duration-1000 delay-150 ${
								isVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-8"
							}`}
						>
							Przygotuj Się do Egzaminu
							<span className="block text-primary mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
								PPLA!
							</span>
						</h1>

						<p
							className={`text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
								isVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-8"
							}`}
						>
							Kompleksowa platforma do przygotowania do egzaminu PPLA. Tysiące
							pytań, wyjaśnienia i tryb egzaminacyjny.
						</p>

						<div
							className={`flex flex-col sm:flex-row gap-4 justify-center pt-4 mt-[15px] transition-all duration-1000 delay-500 ${
								isVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-8"
							}`}
						>
							<Link to="/auth" className="relative">
								<Button
									size="lg"
									className="text-lg px-8 py-4 h-auto bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex flex-col gap-1"
								>
									<span className="flex items-center gap-2">
										Rozpocznij Teraz
										<span className="line-through text-sm opacity-70">
											60 PLN
										</span>
										<span className="font-bold">30 PLN</span>
									</span>
									<span className="text-xs opacity-90">
										🎉 50% zniżki dla pierwszych 100 użytkowników
									</span>
								</Button>
							</Link>
							<Button
								size="lg"
								variant="outline"
								className="text-lg px-8 py-4 h-auto border-2 hover:scale-105 transition-all"
								onClick={() =>
									document
										.getElementById("features")
										?.scrollIntoView({ behavior: "smooth" })
								}
							>
								Dowiedz się więcej
							</Button>
						</div>

						<div
							className={`pt-8 transition-all duration-1000 delay-700 ${
								isVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-8"
							}`}
						>
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm mb-[15px]">
								<Rocket className="h-4 w-4 text-accent" />
								<span className="text-sm font-medium">
									Wkrótce: ATPL i pełna platforma szkoleniowa!
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Scroll Indicator */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce mt-[15px]">
					<div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
						<div className="w-1 h-3 bg-primary/50 rounded-full" />
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id="features"
				className="py-24 bg-card/50 backdrop-blur-sm relative"
			>
				<div className="container mx-auto px-4">
					<div className="text-center mb-16 animate-fade-in">
						<h2 className="text-4xl md:text-5xl font-bold mb-4">
							Dlaczego PPLA Academy?
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Najlepsza platforma przygotowująca do egzaminu PPLA w Polsce
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						<div
							className="p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-2 duration-300 animate-fade-in"
							style={{ animationDelay: "0.1s" }}
						>
							<div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 transition-transform hover:scale-110 duration-300">
								<BookOpen className="h-7 w-7 text-primary" />
							</div>
							<h3 className="text-2xl font-bold mb-4">Tysiące Pytań</h3>
							<p className="text-muted-foreground">
								Kompletna baza pytań egzaminacyjnych z wszystkich kategorii
								wymaganych do egzaminu PPLA
							</p>
						</div>

						<div
							className="p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-2 duration-300 animate-fade-in"
							style={{ animationDelay: "0.2s" }}
						>
							<div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 transition-transform hover:scale-110 duration-300">
								<Brain className="h-7 w-7 text-primary" />
							</div>
							<h3 className="text-2xl font-bold mb-4">Wyjaśnienia</h3>
							<p className="text-muted-foreground">
								Szczegółowe wyjaśnienia do każdej odpowiedzi z możliwością
								zadania pytania AI, jeśli coś pozostanie niejasne.{" "}
							</p>
						</div>

						<div
							className="p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-2 duration-300 animate-fade-in"
							style={{ animationDelay: "0.3s" }}
						>
							<div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 transition-transform hover:scale-110 duration-300">
								<Trophy className="h-7 w-7 text-primary" />
							</div>
							<h3 className="text-2xl font-bold mb-4">Tryb Egzaminacyjny</h3>
							<p className="text-muted-foreground">
								Symulacja prawdziwego egzaminu z limitem czasu i szczegółowymi
								statystykami postępów
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Video Demo Section */}
			<section className="py-24 bg-background relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-12 animate-fade-in">
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4">
								<Brain className="h-4 w-4 text-primary" />
								<span className="text-sm font-medium">Zobacz jak to działa</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-bold mb-4">
								Tryb Nauki z AI
							</h2>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
								Ucz się efektywnie z wyjaśnieniami AI i interaktywnym trybem pytań
							</p>
						</div>

						<div
							className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/20 animate-fade-in hover:scale-[1.02] transition-all duration-500"
							style={{ animationDelay: "0.2s" }}
						>
							<div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 pointer-events-none z-10" />
							<video
								className="w-full h-full object-cover"
								style={{ aspectRatio: "16/9" }}
								controls
							>
								<source src="/videos/demo-learning-mode.mp4" type="video/mp4" />
								Twoja przeglądarka nie obsługuje odtwarzania wideo.
							</video>
						</div>

						<div className="grid md:grid-cols-3 gap-6 mt-12">
							<div
								className="p-6 rounded-2xl bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:-translate-y-1 duration-300 animate-fade-in"
								style={{ animationDelay: "0.3s" }}
							>
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
									<BookOpen className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-lg font-bold mb-2">Tryb Nauki</h3>
								<p className="text-sm text-muted-foreground">
									Ucz się w swoim tempie z natychmiastowym feedbackiem i szczegółowymi wyjaśnieniami
								</p>
							</div>

							<div
								className="p-6 rounded-2xl bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:-translate-y-1 duration-300 animate-fade-in"
								style={{ animationDelay: "0.4s" }}
							>
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
									<Brain className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-lg font-bold mb-2">Pytania do AI</h3>
								<p className="text-sm text-muted-foreground">
									Zadaj pytanie AI jeśli coś jest niejasne - otrzymasz szczegółowe wyjaśnienie
								</p>
							</div>

							<div
								className="p-6 rounded-2xl bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:-translate-y-1 duration-300 animate-fade-in"
								style={{ animationDelay: "0.5s" }}
							>
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
									<Trophy className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-lg font-bold mb-2">Śledź Postępy</h3>
								<p className="text-sm text-muted-foreground">
									Monitoruj swoje wyniki i zobacz w których obszarach potrzebujesz więcej praktyki
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Roadmap Section */}
			<section className="py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
...
			</section>

			{/* Pricing Section */}
			<section className="py-24 relative">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-12 animate-fade-in">
							<h2 className="text-4xl md:text-5xl font-bold mb-4">
								Jeden Plan, Pełen Dostęp
							</h2>
							<p className="text-xl text-muted-foreground">
								Bez ukrytych kosztów, bez subskrypcji - jednorazowa płatność
							</p>
						</div>

						<div
							className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 md:p-12 rounded-3xl border-2 border-primary/20 shadow-xl animate-fade-in hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 relative overflow-hidden"
							style={{ animationDelay: "0.2s" }}
						>
							<div className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg rotate-12 animate-pulse">
								🎉 -50% PROMOCJA
							</div>
							<div className="text-center mb-8">
								<div className="inline-block">
									<div className="flex items-center gap-3 mb-2">
										<span className="text-3xl md:text-4xl text-muted-foreground line-through opacity-60">
											60 PLN
										</span>
										<span className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
											30 PLN
										</span>
									</div>
									<p className="text-muted-foreground text-sm">
										jednorazowo • tylko dla pierwszych 100 użytkowników
									</p>
								</div>
							</div>

							<ul className="space-y-4 mb-8">
								{[
									"Nielimitowany dostęp do wszystkich pytań PPLA",
									"AI-powered wyjaśnienia do każdej odpowiedzi",
									"Tryb nauki i egzaminacyjny",
									"Możliwość zapisywania własnych notatek",
									"Szczegółowe statystyki i analiza postępów",
									"Interaktywne rozpoznawanie części samolotu",
									"Roczny dostęp do platformy",
									"Wczesny dostęp do ATPL po premierze",
								].map((feature, index) => (
									<li
										key={index}
										className="flex items-start gap-3 animate-fade-in"
										style={{ animationDelay: `${0.3 + index * 0.1}s` }}
									>
										<CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
										<span className="text-lg">{feature}</span>
									</li>
								))}
							</ul>

							<Link to="/auth" className="block">
								<Button
									size="lg"
									className="w-full text-lg py-6 h-auto shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-fade-in"
									style={{ animationDelay: "1s" }}
								>
									Rozpocznij Przygotowania Teraz
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Index;
