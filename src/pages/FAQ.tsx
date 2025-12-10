import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, CheckCircle, Monitor, BarChart3, Smartphone, BookOpen, HelpCircle, Mail } from "lucide-react";
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
			<div className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
				<div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
				
				<div className="container mx-auto px-4 py-8 relative">
					<Link to="/">
						<Button variant="ghost" className="mb-8 hover:bg-primary/10">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Powrót do strony głównej
						</Button>
					</Link>

					<div className="max-w-3xl mx-auto text-center mb-12">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
							<HelpCircle className="w-8 h-8 text-primary" />
						</div>
						<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
							Najczęściej zadawane pytania
						</h1>
						<p className="text-lg text-muted-foreground">
							Znajdź odpowiedzi na pytania dotyczące licencji PPL(A) i naszej platformy
						</p>
					</div>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="container mx-auto px-4 pb-16 flex-1">
				<div className="max-w-3xl mx-auto">
					<Accordion type="single" collapsible className="space-y-4">
						{faqItems.map((item, index) => (
							<AccordionItem 
								key={index} 
								value={`item-${index}`}
								className="border border-border/50 rounded-xl px-6 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
							>
								<AccordionTrigger className="text-left py-5 hover:no-underline group">
									<div className="flex items-center gap-4">
										<div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
											<item.icon className="w-5 h-5 text-primary" />
										</div>
										<span className="font-medium text-base">{item.question}</span>
									</div>
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground pb-5 pl-14">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>

					{/* Contact CTA */}
					<div className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 md:p-10">
						<div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
						<div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
							<div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
								<Mail className="w-7 h-7 text-primary" />
							</div>
							<div className="text-center md:text-left flex-1">
								<h2 className="text-xl font-semibold mb-2">Masz więcej pytań?</h2>
								<p className="text-muted-foreground">
									Nie znalazłeś odpowiedzi? Skontaktuj się z nami, chętnie pomożemy!
								</p>
							</div>
							<a href="mailto:kontakt@pplacademy.pl">
								<Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
									Napisz do nas
								</Button>
							</a>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default FAQ;
