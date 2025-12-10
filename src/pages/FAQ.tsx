import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	ArrowLeft,
	Clock,
	CheckCircle,
	Monitor,
	BarChart3,
	Smartphone,
	BookOpen,
	HelpCircle,
	Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

const faqItems = [
	{
		question: "Ile trwa przygotowanie do teorii PPL(A)?",
		answer:
			"Przygotowanie do egzaminu teoretycznego PPL(A) trwa średnio 2-4 miesiące przy regularnej nauce. Dzięki PPLA Academy możesz skrócić ten czas nawet o połowę, ucząc się efektywnie z bazy ponad 1000 pytań egzaminacyjnych i korzystając z inteligentnego systemu powtórek.",
		icon: Clock,
	},
	{
		question: "Czy pytania w PPLA Academy są zgodne z ULC?",
		answer:
			"Tak, nasza baza pytań jest zgodna z wymaganiami Urzędu Lotnictwa Cywilnego (ULC) i obejmuje wszystkie 8 przedmiotów egzaminu teoretycznego PPL(A): prawo lotnicze, ogólną wiedzę o statku powietrznym, planowanie i wykonywanie lotów, osiągi, meteorologię, nawigację, procedury operacyjne oraz zasady lotu.",
		icon: CheckCircle,
	},
	{
		question: "Jak działa tryb egzaminu?",
		answer:
			"Tryb egzaminu symuluje rzeczywisty egzamin ULC z limitem czasowym i losowym doborem pytań. Po zakończeniu otrzymujesz szczegółowy raport z wynikami, błędami i wyjaśnieniami AI. System śledzi Twoje postępy i identyfikuje obszary wymagające dodatkowej nauki.",
		icon: Monitor,
	},
	{
		question: "Czy kurs PPL(A) można robić online?",
		answer:
			"Część teoretyczna szkolenia PPL(A) może być realizowana online, w tym nauka z PPLA Academy. Jednak praktyczne szkolenie lotnicze wymaga obecności w ośrodku szkoleniowym (ATO) i nalotu minimum 45 godzin pod okiem instruktora.",
		icon: BookOpen,
	},
	{
		question: "Jak wyglądają statystyki postępów?",
		answer:
			"Panel statystyk pokazuje Twój procentowy postęp w każdym z 8 przedmiotów, historię sesji egzaminacyjnych, wykres poprawności odpowiedzi w czasie oraz listę pytań wymagających powtórki. Dzięki temu wiesz dokładnie, nad czym musisz popracować.",
		icon: BarChart3,
	},
	{
		question: "Czy platforma działa na telefonie?",
		answer:
			"Tak, PPLA Academy jest w pełni responsywna i działa na smartfonach, tabletach oraz komputerach. Możesz uczyć się w dowolnym miejscu i czasie - w drodze do pracy, podczas przerwy czy w domu.",
		icon: Smartphone,
	},
];

// JSON-LD structured data for SEO
const faqJsonLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: faqItems.map((item) => ({
		"@type": "Question",
		name: item.question,
		acceptedAnswer: {
			"@type": "Answer",
			text: item.answer,
		},
	})),
};

const FAQ = () => {
	return (
		<div className="min-h-screen flex flex-col bg-background">
			<Helmet>
				<title>FAQ - Najczęstsze pytania o PPL(A) | PPLA Academy</title>
				<meta
					name="description"
					content="Odpowiedzi na najczęściej zadawane pytania o licencję PPL(A), egzamin teoretyczny ULC i platformę PPLA Academy. Dowiedz się ile trwa nauka i jak działa tryb egzaminu."
				/>
				<script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
			</Helmet>

			{/* Hero Section */}
			<section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
				<div className="container mx-auto max-w-4xl text-center">
					<HelpCircle className="h-16 w-16 mx-auto mb-6 text-primary" />
					<h1 className="text-4xl md:text-5xl font-bold mb-6">
						Najczęściej zadawane pytania (FAQ)
					</h1>
					<p className="text-xl text-muted-foreground mb-8">
						Znajdź odpowiedzi na pytania dotyczące licencji PPL(A) i naszej
						platformy
					</p>
					<Link to="/">
						<Button variant="outline" size="lg">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Powrót do strony głównej
						</Button>
					</Link>
				</div>
			</section>

			<div className="container mx-auto max-w-4xl px-4 py-12 flex-1">
				{/* FAQ Items */}
				{faqItems.map((item, index) => (
					<Card key={index} className="mb-6">
						<CardHeader>
							<CardTitle className="flex items-center gap-3 text-xl">
								<item.icon className="h-7 w-7 text-primary flex-shrink-0" />
								{item.question}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">{item.answer}</p>
						</CardContent>
					</Card>
				))}

				{/* CTA Section */}
				<Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 mt-12">
					<CardContent className="py-12 text-center">
						<Mail className="h-16 w-16 mx-auto mb-6 text-primary" />
						<h2 className="text-3xl font-bold mb-4">Masz więcej pytań?</h2>
						<p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
							Nie znalazłeś odpowiedzi na swoje pytanie? Skontaktuj się z nami,
							chętnie pomożemy!
						</p>
						<a href="mailto:kontakt@pplacademy.pl">
							<Button size="lg">
								<Mail className="mr-2 h-4 w-4" />
								Napisz do nas
							</Button>
						</a>
					</CardContent>
				</Card>
			</div>

			<Footer />
		</div>
	);
};

export default FAQ;
