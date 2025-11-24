import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import {
	Plane,
	Book,
	Stethoscope,
	GraduationCap,
	FileCheck,
	ClipboardCheck,
	Clock,
	AlertCircle,
	CheckCircle,
} from "lucide-react";

const HowToGetPPLA = () => {
	return (
		<div className="min-h-screen flex flex-col bg-background">
			{/* Hero Section */}
			<section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
				<div className="container mx-auto max-w-4xl text-center">
					<Plane className="h-16 w-16 mx-auto mb-6 text-primary" />
					<h1 className="text-4xl md:text-5xl font-bold mb-6">
						Jak zdobyć licencję PPL(A)? – Kompletny przewodnik
					</h1>
					<p className="text-xl text-muted-foreground mb-8">
						Dowiedz się wszystkiego o ścieżce do zostania pilotem samolotowym
					</p>
					<Link to="/auth">
						<Button size="lg">Rozpocznij przygotowania do egzaminu</Button>
					</Link>
				</div>
			</section>

			<div className="container mx-auto max-w-4xl px-4 py-12 flex-1">
				{/* Co to jest licencja PPL(A) */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<Plane className="h-8 w-8 text-primary" />
							Czym jest licencja PPL(A)?
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							<strong>PPL(A)</strong> (Private Pilot Licence – Aeroplane) to
							licencja pilota prywatnego samolotowego, która uprawnia do lotów
							samolotami jednosilnikowymi o maksymalnej masie startowej aż
							5700kg. Jest to podstawowe uprawnienie lotnicze, które otwiera
							drogę do dalszego rozwoju lotniczej kariery. Loty mogą odbywać się
							wyłącznie niekomercyjnie.
						</p>
						<p className="text-muted-foreground">
							Z licencją PPL(A) możesz latać samolotem z pasażerami, odkrywać
							nowe miejsca z powietrza i realizować marzenie o lotnictwie. Jest
							to pierwszy krok w karierze każdego pilota.
						</p>
					</CardContent>
				</Card>

				{/* Warunki formalne */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<FileCheck className="h-8 w-8 text-primary" />
							Warunki formalne
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
								<div>
									<strong>Wiek:</strong> ukończone 17 lat (szkolenie można
									rozpocząć wcześniej)
								</div>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
								<div>
									<strong>Badania lekarskie:</strong> Świadectwo zdrowia klasy 2
									lub LAPL (świadectwo zdrowia lotniczego)
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Szkolenie teoretyczne */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<Book className="h-8 w-8 text-primary" />
							Szkolenie teoretyczne
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Szkolenie teoretyczne obejmuje <strong>minimum 100 godzin</strong>{" "}
							zajęć z następujących przedmiotów:
						</p>
						<p className="text-muted-foreground">
							Szkolenie można odbyć w <strong>szkole lotniczej</strong> (forma
							stacjonarna) lub przygotować się do egzaminu teoretycznego za
							pomocą platform.
						</p>
					</CardContent>
				</Card>

				{/* Szkolenie praktyczne */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<GraduationCap className="h-8 w-8 text-primary" />
							Szkolenie praktyczne
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Część praktyczna wymaga{" "}
							<strong>minimum 45 godzin czasu lotu</strong>, w tym:
						</p>
						<div className="space-y-3 ml-6">
							<div className="flex items-start gap-3">
								<CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
								<div>
									<strong>Minimum 35 godzin</strong> szkolenia w locie z
									instruktorem
								</div>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
								<div>
									<strong>10 godzin</strong> czasu lotu samodzielnego pod
									nadzorem, w tym:
									<ul className="ml-4 mt-1 space-y-1 text-sm">
										<li>
											co najmniej 5 godzin czasu lotu w lotach nawigacyjnych
										</li>
										<li>
											co najmniej 1 lot nawigacyjny na odległość min. 270 km z
											lądowaniami z pełnym zatrzymaniem na 2 lotniskach innych
											niż lotnisko odlotu
										</li>
									</ul>
								</div>
							</div>
						</div>
						<p className="text-muted-foreground mt-4">
							Szkolenie praktyczne odbywa się w{" "}
							<strong>zatwierdzonym ośrodku szkolenia (ATO)</strong>{" "}
							posiadającym certyfikat ULC (Urząd Lotnictwa Cywilnego).
						</p>
					</CardContent>
				</Card>

				{/* Egzamin teoretyczny */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<ClipboardCheck className="h-8 w-8 text-primary" />
							Egzamin teoretyczny ULC
						</CardTitle>
					</CardHeader>

					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Egzamin teoretyczny przeprowadza{" "}
							<strong>Urząd Lotnictwa Cywilnego (ULC)</strong>. Składa się z
							<strong> 9 testów</strong> (po jednym z każdego przedmiotu), każdy
							zawiera 12–28 pytań w zależności od tematu.
						</p>

						{/* Sekcja: zasady egzaminu */}
						<div className="space-y-3 ml-6">
							<div className="flex items-start gap-3">
								<CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
								<div>
									<strong>Próg zaliczenia:</strong> minimum 75% w każdym teście
								</div>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
								<div>
									<strong>Czas trwania:</strong> 30–60 minut w zależności od
									przedmiotu
								</div>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
								<div>
									<strong>Ważność wyników:</strong> 24 miesiące
								</div>
							</div>
						</div>

						{/* Oddzielenie listy przedmiotów */}
						<div className="border-t pt-4 mt-4">
							<h3 className="font-semibold text-lg mb-3">
								Przedmioty egzaminacyjne:
							</h3>

							<ul className="space-y-2 ml-6">
								<li className="text-muted-foreground">
									✈️ Prawo lotnicze – 28 pytań, 45 min
								</li>
								<li className="text-muted-foreground">
									🛩️ Ogólna wiedza o statku powietrznym – 16 pytań, 30 min
								</li>
								<li className="text-muted-foreground">
									📊 Osiągi i planowanie lotu – 20 pytań, 60 min
								</li>
								<li className="text-muted-foreground">
									🧠 Człowiek – możliwości i ograniczenia – 12 pytań, 30 min
								</li>
								<li className="text-muted-foreground">
									🌦️ Meteorologia – 12 pytań, 30 min
								</li>
								<li className="text-muted-foreground">
									🧭 Nawigacja – 24 pytania, 60 min
								</li>
								<li className="text-muted-foreground">
									📋 Procedury operacyjne – 12 pytań, 30 min
								</li>
								<li className="text-muted-foreground">
									🔄 Zasady lotu – 16 pytań, 45 min
								</li>
								<li className="text-muted-foreground">
									📻 Łączność – 12 pytań, 30 min
								</li>
							</ul>
						</div>

						<p className="text-muted-foreground mt-4">
							Przygotuj się skutecznie do egzaminu z{" "}
							<strong>PPLA Academy</strong> – naszą platformą z prawdziwymi
							pytaniami egzaminacyjnymi!
						</p>
					</CardContent>
				</Card>

				{/* Egzamin praktyczny */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<Plane className="h-8 w-8 text-primary" />
							Egzamin praktyczny
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Po zdaniu egzaminu teoretycznego i ukończeniu wymaganej liczby
							godzin lotu, kandydat przystępuje do{" "}
							<strong>egzaminu praktycznego</strong> z certyfikowanym
							egzaminatorem państwowym.
						</p>
						<p className="text-muted-foreground">Egzamin obejmuje:</p>
						<ul className="space-y-2 ml-6">
							<li className="text-muted-foreground">
								💬 <strong>Część teoretyczna</strong> – przed lotem egzaminator
								weryfikuje dokumentację m.in. (plan lotu, określanie masy oraz
								wyważenia i osiągów, meteo, NOTAM) oraz zadaje pytania ustne o
								procedury, przepisy i postępowanie awaryjne. Pytania mogą być
								kontynuowane w trakcie lotu
							</li>
							<li className="text-muted-foreground">
								🛫 <strong>Lot egzaminacyjny</strong> (ok. 1,5h) – starty i
								lądowania (w tym przy bocznym wietrze, bez klap), manewry
								(głębokie zakręty, przeciągnięcia), nawigacja, procedury
								awaryjne
							</li>
						</ul>
						<p className="text-muted-foreground mt-4">
							Po zdaniu egzaminu praktycznego i złożeniu dokumentów w ULC
							otrzymujesz <strong>licencję PPL(A)</strong>!
						</p>
					</CardContent>
				</Card>

				{/* Ile trwa cały proces */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<Clock className="h-8 w-8 text-primary" />
							Ile trwa cały proces?
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Czas trwania szkolenia PPL(A) zależy od:
						</p>
						<ul className="space-y-2 ml-6">
							<li className="text-muted-foreground">
								⏱️ Intensywności nauki (ile dni w tygodniu latasz)
							</li>
							<li className="text-muted-foreground">
								💰 Budżetu (możliwości finansowania kolejnych godzin lotu)
							</li>
							<li className="text-muted-foreground">
								🌤️ Warunków pogodowych (loty wymagają dobrej pogody)
							</li>
							<li className="text-muted-foreground">📚 Tempa nauki teorii</li>
						</ul>
						<p className="text-muted-foreground mt-4">
							<strong>Średni czas:</strong> od 6 miesięcy do 2 lat. Przy
							intensywnym szkoleniu (np. wakacje) możliwe jest uzyskanie
							licencji w <strong>3-6 miesięcy</strong>.
						</p>
					</CardContent>
				</Card>

				{/* Najczęstsze błędy */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<AlertCircle className="h-8 w-8 text-destructive" />
							Najczęstsze błędy kandydatów
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
								<div>
									<strong>Odkładanie teorii na ostatnią chwilę</strong> – teoria
									wymaga czasu i systematycznej nauki
								</div>
							</div>
							<div className="flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
								<div>
									<strong>Zbyt długie przerwy między lotami</strong> –
									umiejętności trzeba regularnie ćwiczyć
								</div>
							</div>
							<div className="flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
								<div>
									<strong>Niedocenianie kosztów</strong> – należy zaplanować
									budżet z zapasem
								</div>
							</div>
							<div className="flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
								<div>
									<strong>Wybór niewłaściwej szkoły lotniczej</strong> – warto
									sprawdzić opinie i certyfikaty
								</div>
							</div>
							<div className="flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
								<div>
									<strong>Brak systematyczności</strong> – zarówno teoria jak i
									praktyka wymagają regularności
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* CTA Section */}
				<Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
					<CardContent className="py-12 text-center">
						<GraduationCap className="h-16 w-16 mx-auto mb-6 text-primary" />
						<h2 className="text-3xl font-bold mb-4">
							Rozpocznij naukę do egzaminu PPL(A) w PPLA Academy
						</h2>
						<p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
							Przygotuj się skutecznie do egzaminu teoretycznego z prawdziwymi
							pytaniami ULC, szczegółowymi wyjaśnieniami i systemem śledzenia
							postępów.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link to="/auth">
								<Button size="lg">Zacznij naukę już dziś</Button>
							</Link>
							<Link to="/costs-ppla">
								<Button size="lg" variant="outline">
									Zobacz koszty szkolenia
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>

			<Footer />
		</div>
	);
};

export default HowToGetPPLA;
