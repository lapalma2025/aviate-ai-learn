import { Card } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
			<div className="container mx-auto px-4 py-8 flex-1">
				<Link to="/">
					<Button variant="ghost" className="mb-6">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Powrót do strony głównej
					</Button>
				</Link>

				<Card className="max-w-4xl mx-auto p-8 md:p-12">
					<h1 className="text-4xl font-bold mb-8 text-center">
						Polityka Prywatności PPLA Academy
					</h1>

					<div className="prose prose-slate max-w-none space-y-6 text-foreground">
						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§1 Postanowienia ogólne
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Niniejsza Polityka Prywatności określa zasady przetwarzania i
									ochrony danych osobowych Użytkowników platformy PPLA Academy.
								</li>
								<li>
									Administratorem danych osobowych jest firma CodeWithMe Michał
									Zborowski wpisana do Centralnej Ewidencji i Informacji o
									Działalności Gospodarczej (CEIDG) prowadzonej przez ministra
									właściwego ds. gospodarki, NIP 8831870587 , REGON 387076173.
								</li>
								<li>
									Dane osobowe są przetwarzane zgodnie z Rozporządzeniem
									Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27
									kwietnia 2016 r. (RODO).
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§2 Zakres przetwarzanych danych
							</h2>
							<p className="mb-3">
								Administrator przetwarza następujące kategorie danych osobowych:
							</p>
							<ul className="list-disc list-inside space-y-2 ml-4">
								<li>Adres e-mail (wymagany do rejestracji i logowania)</li>
								<li>Hasło (przechowywane w formie zaszyfrowanej)</li>
								<li>
									Dane dotyczące postępów w nauce (wyniki egzaminów, odpowiedzi
									na pytania)
								</li>
								<li>
									Dane techniczne (adres IP, typ przeglądarki, system
									operacyjny)
								</li>
								<li>
									Dane płatnicze (przetwarzane przez zewnętrznego operatora
									płatności - Stripe, nieprzetrzymywane przez Administratora)
								</li>
							</ul>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§3 Cele i podstawy prawne przetwarzania danych
							</h2>
							<p className="mb-3">
								Dane osobowe są przetwarzane w następujących celach:
							</p>
							<ol className="list-decimal list-inside space-y-3 ml-4">
								<li>
									<strong>Świadczenie usług edukacyjnych</strong> – na podstawie
									umowy (art. 6 ust. 1 lit. b RODO)
								</li>
								<li>
									<strong>Obsługa płatności</strong> – na podstawie umowy (art.
									6 ust. 1 lit. b RODO)
								</li>
								<li>
									<strong>Komunikacja z Użytkownikami</strong> – na podstawie
									prawnie uzasadnionego interesu Administratora (art. 6 ust. 1
									lit. f RODO)
								</li>
								<li>
									<strong>Marketing bezpośredni</strong> – na podstawie
									dobrowolnej zgody (art. 6 ust. 1 lit. a RODO)
								</li>
								<li>
									<strong>
										Analiza statystyk i poprawa funkcjonalności platformy
									</strong>{" "}
									– na podstawie prawnie uzasadnionego interesu (art. 6 ust. 1
									lit. f RODO)
								</li>
								<li>
									<strong>Wypełnienie obowiązków prawnych</strong> – na
									podstawie przepisów prawa (art. 6 ust. 1 lit. c RODO)
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§4 Okres przechowywania danych
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Dane niezbędne do świadczenia usług są przechowywane przez
									okres obowiązywania umowy oraz przez okres wymagany przepisami
									prawa (do 6 lat dla celów podatkowych i księgowych).
								</li>
								<li>
									Dane przetwarzane na podstawie zgody są przechowywane do
									momentu jej wycofania lub zgłoszenia sprzeciwu.
								</li>
								<li>
									Dane w celach marketingowych są przechowywane do momentu
									wycofania zgody lub przez okres 3 lat od ostatniej aktywności
									Użytkownika.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§5 Udostępnianie danych
							</h2>
							<p className="mb-3">
								Dane osobowe mogą być przekazywane następującym podmiotom:
							</p>
							<ul className="list-disc list-inside space-y-2 ml-4">
								<li>
									<strong>Stripe</strong> – operator płatności elektronicznych
								</li>
								<li>
									<strong>Supabase</strong> – dostawca usług hostingowych i baz
									danych
								</li>
								<li>
									<strong>Google Analytics</strong> – narzędzie analityczne
									(jeśli Użytkownik wyrazi zgodę na pliki cookies analityczne)
								</li>
								<li>
									Organy państwowe – wyłącznie na podstawie obowiązujących
									przepisów prawa
								</li>
							</ul>
							<p className="mt-3">
								Administrator nie sprzedaje danych osobowych osobom trzecim ani
								nie udostępnia ich w celach niezgodnych z prawem.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§6 Prawa Użytkownika
							</h2>
							<p className="mb-3">Użytkownik ma prawo do:</p>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									<strong>Dostępu do swoich danych</strong> – możliwość
									uzyskania informacji, jakie dane są przetwarzane
								</li>
								<li>
									<strong>Sprostowania danych</strong> – możliwość poprawy
									nieprawidłowych lub niekompletnych danych
								</li>
								<li>
									<strong>Usunięcia danych</strong> („prawo do bycia
									zapomnianym") – w przypadkach przewidzianych przez RODO
								</li>
								<li>
									<strong>Ograniczenia przetwarzania</strong> – w określonych
									sytuacjach prawnych
								</li>
								<li>
									<strong>Przenoszenia danych</strong> – możliwość otrzymania
									swoich danych w formacie umożliwiającym transfer
								</li>
								<li>
									<strong>Wycofania zgody</strong> – w każdej chwili, bez wpływu
									na zgodność z prawem przetwarzania przed wycofaniem
								</li>
								<li>
									<strong>Wniesienia skargi do organu nadzorczego</strong> –
									Urząd Ochrony Danych Osobowych
								</li>
							</ol>
							<p className="mt-3">
								W celu skorzystania z powyższych praw należy skontaktować się z
								Administratorem pod adresem e-mail: [adres e-mail].
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§7 Bezpieczeństwo danych
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Administrator stosuje odpowiednie środki techniczne i
									organizacyjne zapewniające bezpieczeństwo danych osobowych.
								</li>
								<li>
									Hasła są przechowywane w formie zaszyfrowanej (haszowanej).
								</li>
								<li>Dostęp do danych mają wyłącznie upoważnione osoby.</li>
								<li>
									Platforma korzysta z protokołu HTTPS zapewniającego
									szyfrowanie przesyłanych danych.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">§8 Pliki cookies</h2>
							<p className="mb-3">
								Platforma wykorzystuje pliki cookies w celach technicznych,
								analitycznych i marketingowych. Szczegółowe informacje znajdują
								się w{" "}
								<a
									href="/cookies-policy"
									className="text-primary hover:underline"
								>
									Polityce Cookies
								</a>
								.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§9 Zmiany Polityki Prywatności
							</h2>
							<p>
								Administrator zastrzega sobie prawo do wprowadzania zmian w
								Polityce Prywatności. Użytkownicy zostaną poinformowani o
								istotnych zmianach z 7-dniowym wyprzedzeniem.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">§10 Kontakt</h2>
							<p>
								W sprawach dotyczących ochrony danych osobowych można
								kontaktować się z Administratorem pod adresem e-mail:
								kontakt@pplacademy.pl
							</p>
						</section>

						<div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
							<p>
								Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
							</p>
						</div>
					</div>
				</Card>
			</div>
			<Footer />
		</div>
	);
};

export default Privacy;
