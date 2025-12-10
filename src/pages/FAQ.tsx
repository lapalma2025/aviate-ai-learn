import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const faqItems = [
	{
		question: "Ile trwa przygotowanie do teorii PPL(A)?",
		answer:
			"Przygotowanie do egzaminu teoretycznego PPL(A) trwa średnio 2-4 miesiące przy regularnej nauce. Dzięki PPLA Academy możesz skrócić ten czas nawet o połowę, ucząc się efektywnie z bazy ponad 1000 pytań egzaminacyjnych i korzystając z inteligentnego systemu powtórek.",
	},
	{
		question: "Czy pytania w PPLA Academy są zgodne z ULC?",
		answer:
			"Tak, nasza baza pytań jest zgodna z wymaganiami Urzędu Lotnictwa Cywilnego (ULC) i obejmuje wszystkie 8 przedmiotów egzaminu teoretycznego PPL(A): prawo lotnicze, ogólną wiedzę o statku powietrznym, planowanie i wykonywanie lotów, osiągi, meteorologię, nawigację, procedury operacyjne oraz zasady lotu.",
	},
	{
		question: "Jak działa tryb egzaminu?",
		answer:
			"Tryb egzaminu symuluje rzeczywisty egzamin ULC z limitem czasowym i losowym doborem pytań. Po zakończeniu otrzymujesz szczegółowy raport z wynikami, błędami i wyjaśnieniami AI. System śledzi Twoje postępy i identyfikuje obszary wymagające dodatkowej nauki.",
	},
	{
		question: "Czy kurs PPL(A) można robić online?",
		answer:
			"Część teoretyczna szkolenia PPL(A) może być realizowana online, w tym nauka z PPLA Academy. Jednak praktyczne szkolenie lotnicze wymaga obecności w ośrodku szkoleniowym (ATO) i nalotu minimum 45 godzin pod okiem instruktora.",
	},
	{
		question: "Jak wyglądają statystyki postępów?",
		answer:
			"Panel statystyk pokazuje Twój procentowy postęp w każdym z 8 przedmiotów, historię sesji egzaminacyjnych, wykres poprawności odpowiedzi w czasie oraz listę pytań wymagających powtórki. Dzięki temu wiesz dokładnie, nad czym musisz popracować.",
	},
	{
		question: "Czy platforma działa na telefonie?",
		answer:
			"Tak, PPLA Academy jest w pełni responsywna i działa na smartfonach, tabletach oraz komputerach. Możesz uczyć się w dowolnym miejscu i czasie - w drodze do pracy, podczas przerwy czy w domu.",
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
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
			<Helmet>
				<title>FAQ - Najczęstsze pytania o PPL(A) | PPLA Academy</title>
				<meta
					name="description"
					content="Odpowiedzi na najczęściej zadawane pytania o licencję PPL(A), egzamin teoretyczny ULC i platformę PPLA Academy. Dowiedz się ile trwa nauka i jak działa tryb egzaminu."
				/>
				<script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
			</Helmet>

			<div className="container mx-auto px-4 py-8 flex-1">
				<Link to="/">
					<Button variant="ghost" className="mb-6">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Powrót do strony głównej
					</Button>
				</Link>

				<Card className="max-w-4xl mx-auto p-8 md:p-12">
					<h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
						Najczęściej zadawane pytania (FAQ)
					</h1>
					<p className="text-muted-foreground mb-8 text-center">
						Znajdź odpowiedzi na najczęstsze pytania dotyczące licencji pilota
						PPL(A) i naszej platformy do nauki.
					</p>

					<Accordion type="single" collapsible className="w-full">
						{faqItems.map((item, index) => (
							<AccordionItem key={index} value={`item-${index}`}>
								<AccordionTrigger className="text-left">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>

					<div className="mt-12 p-6 bg-primary/5 rounded-lg border border-border">
						<h2 className="font-semibold mb-2">Masz więcej pytań?</h2>
						<p className="text-muted-foreground text-sm">
							Skontaktuj się z nami:{" "}
							<a
								href="mailto:kontakt@pplacademy.pl"
								className="text-primary hover:underline"
							>
								kontakt@pplacademy.pl
							</a>
						</p>
					</div>
				</Card>
			</div>

			<Footer />
		</div>
	);
};

export default FAQ;
