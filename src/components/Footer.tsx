import { Link } from "react-router-dom";
import { Plane } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

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

export const Footer = () => {
	return (
		<footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Plane className="h-6 w-6 text-primary" />
							<span className="font-bold text-lg">PPLA Academy</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Profesjonalna platforma przygotowująca do egzaminu PPLA
						</p>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold">Dowiedz się więcej</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									to="/how-to-get-ppla"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Jak zdobyć PPL(A)?
								</Link>
							</li>
							<li>
								<Link
									to="/costs-ppla"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Koszty szkolenia PPL(A)
								</Link>
							</li>
							<li>
								<Link
									to="/faq"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									FAQ - Najczęstsze pytania
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold">Dokumenty prawne</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									to="/terms"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Regulamin
								</Link>
							</li>
							<li>
								<Link
									to="/privacy"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Polityka prywatności
								</Link>
							</li>
							<li>
								<Link
									to="/cookies-policy"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Polityka cookies
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold">Kontakt</h3>
						<p className="text-sm text-muted-foreground">
							Masz pytania? Skontaktuj się z nami:
							<br />
							<a
								href="mailto:kontakt@pplacademy.pl"
								className="text-primary hover:underline"
							>
								kontakt@pplacademy.pl
							</a>
						</p>
					</div>
				</div>

				{/* FAQ Section */}
				<div className="mt-10 pt-8 border-t border-border">
					<h3 className="font-semibold text-lg mb-4">
						Najczęściej zadawane pytania (FAQ)
					</h3>
					<Accordion type="single" collapsible className="w-full">
						{faqItems.map((item, index) => (
							<AccordionItem key={index} value={`item-${index}`}>
								<AccordionTrigger className="text-left text-sm">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground text-sm">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>

				<div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
					<p>
						&copy; {new Date().getFullYear()} PPLA Academy. Wszelkie prawa
						zastrzeżone.
					</p>
				</div>
			</div>
		</footer>
	);
};