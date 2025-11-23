import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import {
	Coins,
	Book,
	Plane,
	Stethoscope,
	FileCheck,
	AlertTriangle,
	Calculator,
	TrendingUp,
	GraduationCap,
} from "lucide-react";

const CostsPPLA = () => {
	return (
		<div className="min-h-screen flex flex-col bg-background">
			{/* Hero Section */}
			<section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
				<div className="container mx-auto max-w-4xl text-center">
					<Coins className="h-16 w-16 mx-auto mb-6 text-primary" />
					<h1 className="text-4xl md:text-5xl font-bold mb-6">
						Koszty szkolenia PPL(A) – Ile kosztuje licencja pilota?
					</h1>
					<p className="text-xl text-muted-foreground mb-8">
						Szczegółowe zestawienie wszystkich kosztów związanych z uzyskaniem
						licencji PPL(A)
					</p>
					<Link to="/auth">
						<Button size="lg">Rozpocznij przygotowania za 30 PLN</Button>
					</Link>
				</div>
			</section>

			<div className="container mx-auto max-w-4xl px-4 py-12 flex-1">
				{/* Wstęp */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<Calculator className="h-8 w-8 text-primary" />
							Ile kosztuje licencja PPL(A)?
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Uzyskanie licencji pilota prywatnego samolotowego{" "}
							<strong>PPL(A)</strong> to spore przedsięwzięcie finansowe.
							Całkowity koszt szkolenia zależy od wielu czynników: wyboru szkoły
							lotniczej, typu samolotu, liczby dodatkowych godzin lotu oraz
							tempa nauki.
						</p>
						<p className="text-muted-foreground">
							Szacunkowy koszt pełnego szkolenia PPL(A) w Polsce wynosi średnio
							od <strong>38 000 PLN do 45 000 PLN</strong>. Poniżej znajdziesz
							szczegółowy rozkład kosztów, aby lepiej zaplanować swoją lotniczą
							przygodę.
						</p>
					</CardContent>
				</Card>

				{/* Koszty teorii */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<Book className="h-8 w-8 text-primary" />
							Koszty szkolenia teoretycznego
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Szkolenie teoretyczne można odbyć na kilka sposobów:
						</p>
						<div className="space-y-4">
							<div className="border-l-4 border-primary pl-4">
								<h3 className="font-semibold text-lg mb-2">
									📚 Szkoła lotnicza (stacjonarnie)
								</h3>
								<p className="text-muted-foreground">
									<strong>Koszt:</strong> 2 000 – 4 000 PLN
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Zajęcia prowadzone przez instruktorów, materiały edukacyjne,
									dostęp do testów
								</p>
							</div>
							<div className="border-l-4 border-primary pl-4">
								<h3 className="font-semibold text-lg mb-2">
									💻 Samodzielna nauka online (np. PPLA Academy)
								</h3>
								<p className="text-muted-foreground">
									<strong>Koszt:</strong> 30 – 500 PLN
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Dostęp do platformy z pytaniami egzaminacyjnymi,
									wyjaśnieniami, testami i śledzeniem postępów
								</p>
							</div>
							<div className="border-l-4 border-primary pl-4">
								<h3 className="font-semibold text-lg mb-2">
									📖 Książki i materiały
								</h3>
								<p className="text-muted-foreground">
									<strong>Koszt:</strong> 200 – 1 000 PLN
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Podręczniki, mapy lotnicze, pomoce naukowe
								</p>
							</div>
						</div>
						<div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
							<p className="text-sm">
								💡 <strong>Wskazówka:</strong> Wiele osób wybiera samodzielną
								naukę online (oszczędność 3 000 – 7 000 PLN), a szkoła lotnicza
								prowadzi tylko część praktyczną.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Koszty praktyki */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<Plane className="h-8 w-8 text-primary" />
							Koszty szkolenia praktycznego
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							<strong>To najdroższa część szkolenia!</strong> Minimalna liczba
							godzin lotu to 45 godzin, ale większość kandydatów potrzebuje
							50-60 godzin do zdania egzaminu.
						</p>
						<div className="space-y-4">
							<div className="border-l-4 border-destructive pl-4">
								<h3 className="font-semibold text-lg mb-2">
									✈️ Godzina lotu (z instruktorem lub solo)
								</h3>
								<p className="text-muted-foreground">
									<strong>Koszt za godzinę:</strong> 500 – 900 PLN
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Zależy od typu samolotu (Cessna 152, Cessna 172, Diamond DA20
									itp.) i szkoły lotniczej
								</p>
							</div>
							<div className="border-l-4 border-destructive pl-4">
								<h3 className="font-semibold text-lg mb-2">
									📊 Szacunkowy koszt lotów (45-60 godzin)
								</h3>
								<p className="text-muted-foreground">
									<strong>Koszt całkowity:</strong> 22 500 – 54 000 PLN
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Przy założeniu 45 godzin x 500 PLN = 22 500 PLN (minimum)
									<br />
									Przy założeniu 60 godzin x 900 PLN = 54 000 PLN (maksimum)
								</p>
							</div>
						</div>
						<div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mt-4">
							<p className="text-sm">
								⚠️ <strong>Uwaga:</strong> Większość kandydatów przekracza
								minimum 45 godzin. Zaplanuj budżet na co najmniej 50-55 godzin
								lotu.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Badania lekarskie */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<Stethoscope className="h-8 w-8 text-primary" />
							Koszty badań lotniczych
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Do rozpoczęcia szkolenia potrzebne jest świadectwo zdrowia
							lotniczego.
						</p>
						<div className="space-y-4">
							<div className="border-l-4 border-primary pl-4">
								<h3 className="font-semibold text-lg mb-2">
									🩺 Druga klasa medyczna lub LAPL
								</h3>
								<p className="text-muted-foreground">
									<strong>Koszt:</strong> 400 – 800 PLN
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Badania przeprowadza lekarz lotniczy (Centrum Medycyny
									Lotniczej lub uprawniony lekarz)
								</p>
							</div>
							<div className="border-l-4 border-primary pl-4">
								<h3 className="font-semibold text-lg mb-2">
									🔄 Odnawianie świadectwa
								</h3>
								<p className="text-muted-foreground">
									<strong>Koszt:</strong> 300 – 600 PLN co 2-5 lat (zależnie od
									wieku)
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Opłaty ULC */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<FileCheck className="h-8 w-8 text-primary" />
							Opłaty ULC (Urząd Lotnictwa Cywilnego)
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-4">
							<div className="border-l-4 border-primary pl-4">
								<h3 className="font-semibold text-lg mb-2">
									📝 Egzamin teoretyczny ULC
								</h3>
								<p className="text-muted-foreground">
									<strong>Koszt:</strong> 475 PLN
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									9 testów (po jednym z każdego przedmiotu), opłata za podejście
									zgodnie z cennikiem ULC
								</p>
							</div>

							<div className="border-l-4 border-primary pl-4">
								<h3 className="font-semibold text-lg mb-2">
									✈️ Egzamin praktyczny
								</h3>
								<p className="text-muted-foreground">
									<strong>Koszt:</strong> 1259 PLN
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Opłata za egzamin praktyczny w ULC
								</p>
							</div>

							<div className="border-l-4 border-primary pl-4">
								<h3 className="font-semibold text-lg mb-2">
									💳 Wydanie licencji PPL(A)
								</h3>
								<p className="text-muted-foreground">
									<strong>Koszt:</strong> 99 PLN
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Opłata administracyjna za wydanie licencji lub wpis
									uprawnienia
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Ukryte koszty */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<AlertTriangle className="h-8 w-8 text-destructive" />
							Ukryte koszty i dodatkowe wydatki
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Oprócz podstawowych kosztów, warto zaplanować budżet na:
						</p>
						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
								<div>
									<strong>Dodatkowe godziny lotu:</strong> 2 000 – 10 000 PLN
									(jeśli potrzebujesz więcej niż 45 godzin)
								</div>
							</div>
							<div className="flex items-start gap-3">
								<AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
								<div>
									<strong>Powtórki egzaminów:</strong> 500 – 2 000 PLN (jeśli
									nie zdasz za pierwszym razem)
								</div>
							</div>
							<div className="flex items-start gap-3">
								<AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
								<div>
									<strong>Dojazdy do lotniska:</strong> 500 – 2 000 PLN (paliwo,
									bilety)
								</div>
							</div>
							<div className="flex items-start gap-3">
								<AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
								<div>
									<strong>Zakwaterowanie:</strong> 0 – 5 000 PLN (jeśli szkoła
									jest daleko od miejsca zamieszkania)
								</div>
							</div>
							<div className="flex items-start gap-3">
								<AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
								<div>
									<strong>Wyposażenie:</strong> 500 – 2 000 PLN (słuchawki
									lotnicze, mapa itp.)
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Szacunkowa cena całkowita */}
				<Card className="mb-8 border-2 border-primary">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl">
							<TrendingUp className="h-8 w-8 text-primary" />
							Szacunkowa cena całkowita
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Oto szacunkowy rozkład kosztów dla typowego kandydata na licencję
							PPL(A):
						</p>
						<div className="bg-muted rounded-lg p-6 space-y-3">
							<div className="flex justify-between items-center py-2 border-b border-border">
								<span className="text-muted-foreground">
									Szkolenie teoretyczne
								</span>
								<span className="font-semibold">30 – 8 000 PLN</span>
							</div>
							<div className="flex justify-between items-center py-2 border-b border-border">
								<span className="text-muted-foreground">
									Szkolenie praktyczne (50h x 700 PLN)
								</span>
								<span className="font-semibold">35 000 PLN</span>
							</div>
							<div className="flex justify-between items-center py-2 border-b border-border">
								<span className="text-muted-foreground">Badania lekarskie</span>
								<span className="font-semibold">400 – 800 PLN</span>
							</div>
							<div className="flex justify-between items-center py-2 border-b border-border">
								<span className="text-muted-foreground">
									Opłaty ULC (teoria + praktyka + licencja)
								</span>
								<span className="font-semibold">500 – 1 000 PLN</span>
							</div>
							<div className="flex justify-between items-center py-2 border-b border-border">
								<span className="text-muted-foreground">Egzaminator</span>
								<span className="font-semibold">1 500 – 3 000 PLN</span>
							</div>
							<div className="flex justify-between items-center py-2 border-b border-border">
								<span className="text-muted-foreground">
									Materiały i wyposażenie
								</span>
								<span className="font-semibold">500 – 2 000 PLN</span>
							</div>
							<div className="flex justify-between items-center py-3 text-xl font-bold border-t-2 border-primary mt-2">
								<span>RAZEM:</span>
								<span className="text-primary">38 000 – 45 000 PLN</span>
							</div>
						</div>
						<div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
							<p className="text-sm">
								💡 <strong>Porady:</strong>
							</p>
							<ul className="text-sm space-y-1 ml-4 mt-2">
								<li>
									• Wybierz samodzielną naukę teorii (oszczędność 3 000 – 7 000
									PLN)
								</li>
								<li>
									• Lataj regularnie – długie przerwy = więcej godzin lotu =
									wyższe koszty
								</li>
								<li>
									• Sprawdź różne szkoły lotnicze – ceny mogą się znacznie
									różnić
								</li>
								<li>• Przygotuj budżet z zapasem na dodatkowe godziny</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* CTA Section */}
				<Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
					<CardContent className="py-12 text-center">
						<Book className="h-16 w-16 mx-auto mb-6 text-primary" />
						<h2 className="text-3xl font-bold mb-4">
							Rozpocznij naukę do egzaminu PPL(A) w PPLA Academy
						</h2>
						<p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
							Zaoszczędź tysiące złotych na szkoleniu teoretycznym! Przygotuj
							się skutecznie z prawdziwymi pytaniami egzaminacyjnymi ULC za
							jedyne <strong className="text-primary">30 PLN</strong>.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link to="/auth">
								<Button size="lg">Zacznij za 30 PLN</Button>
							</Link>
							<Link to="/how-to-get-ppla">
								<Button size="lg" variant="outline">
									Jak zdobyć PPL(A)?
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

export default CostsPPLA;
