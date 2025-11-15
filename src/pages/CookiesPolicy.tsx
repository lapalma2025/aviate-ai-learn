import { Card } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { forceShowCookieBanner } from "@/hooks/useCookieConsent";

const CookiesPolicy = () => {
	const { resetConsent } = useCookieConsent();
	const handleCookiesReset = () => {
		localStorage.removeItem("cookie-consent");
		localStorage.removeItem("cookie-preferences");

		forceShowCookieBanner();
	};

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
						Polityka Cookies PPLA Academy
					</h1>

					<div className="prose prose-slate max-w-none space-y-6 text-foreground">
						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§1 Informacje ogólne
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Niniejsza Polityka Cookies wyjaśnia, w jaki sposób platforma
									PPLA Academy wykorzystuje pliki cookies oraz podobne
									technologie.
								</li>
								<li>
									Pliki cookies to małe pliki tekstowe zapisywane na urządzeniu
									Użytkownika (komputer, tablet, smartfon) podczas przeglądania
									stron internetowych.
								</li>
								<li>
									Korzystanie z naszej platformy jest równoznaczne z wyrażeniem
									zgody na wykorzystanie plików cookies zgodnie z niniejszą
									Polityką, chyba że ustawienia przeglądarki zostały zmienione.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§2 Rodzaje wykorzystywanych plików cookies
							</h2>

							<h3 className="text-xl font-semibold mb-3 mt-4">
								1. Pliki niezbędne (techniczne)
							</h3>
							<p className="mb-2">
								<strong>Cel:</strong> Zapewnienie prawidłowego działania
								platformy
							</p>
							<p className="mb-2">
								<strong>Opis:</strong> Umożliwiają logowanie, zapamiętywanie
								sesji użytkownika, zapewniają bezpieczeństwo i prawidłowe
								wyświetlanie treści.
							</p>
							<p className="mb-3">
								<strong>Podstawa prawna:</strong> Prawnie uzasadniony interes
								Administratora (art. 6 ust. 1 lit. f RODO)
							</p>
							<p>
								<em>
									Te pliki są zawsze aktywne i nie można ich wyłączyć bez utraty
									funkcjonalności platformy.
								</em>
							</p>

							<h3 className="text-xl font-semibold mb-3 mt-6">
								2. Pliki analityczne
							</h3>
							<p className="mb-2">
								<strong>Cel:</strong> Analiza ruchu na stronie i zachowań
								użytkowników
							</p>
							<p className="mb-2">
								<strong>Opis:</strong> Pozwalają nam zrozumieć, jak Użytkownicy
								korzystają z platformy, które funkcjonalności są popularne, oraz
								jak możemy poprawić jej działanie.
							</p>
							<p className="mb-2">
								<strong>Narzędzia:</strong> Google Analytics (opcjonalnie)
							</p>
							<p className="mb-3">
								<strong>Podstawa prawna:</strong> Zgoda użytkownika (art. 6 ust.
								1 lit. a RODO)
							</p>
							<p>
								<em>Możesz zarządzać tymi plikami w ustawieniach cookies.</em>
							</p>

							<h3 className="text-xl font-semibold mb-3 mt-6">
								3. Pliki marketingowe
							</h3>
							<p className="mb-2">
								<strong>Cel:</strong> Personalizacja treści i reklam
							</p>
							<p className="mb-2">
								<strong>Opis:</strong> Służą do wyświetlania spersonalizowanych
								komunikatów marketingowych, powiadomień o nowych funkcjach lub
								kursach dostosowanych do zainteresowań Użytkownika.
							</p>
							<p className="mb-3">
								<strong>Podstawa prawna:</strong> Zgoda użytkownika (art. 6 ust.
								1 lit. a RODO)
							</p>
							<p>
								<em>Możesz zarządzać tymi plikami w ustawieniach cookies.</em>
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§3 Zarządzanie plikami cookies
							</h2>
							<ol className="list-decimal list-inside space-y-3 ml-4">
								<li>
									<strong>Za pomocą naszego banera cookies:</strong>
									<p className="ml-6 mt-2">
										Przy pierwszej wizycie na platformie pojawi się banner z
										możliwością:
									</p>
									<ul className="list-disc list-inside ml-10 mt-1 space-y-1">
										<li>Akceptacji wszystkich plików cookies</li>
										<li>Odrzucenia wszystkich (z wyjątkiem niezbędnych)</li>
										<li>
											Dostosowania preferencji (wybór konkretnych kategorii)
										</li>
									</ul>
									<div className="ml-6 mt-3">
										<Button
											onClick={handleCookiesReset}
											variant="outline"
											size="sm"
										>
											Zmień ustawienia cookies
										</Button>
									</div>
								</li>

								<li className="mt-4">
									<strong>Za pomocą przeglądarki:</strong>
									<p className="ml-6 mt-2">
										Możesz również zarządzać plikami cookies bezpośrednio w
										ustawieniach swojej przeglądarki:
									</p>
									<ul className="list-disc list-inside ml-10 mt-1 space-y-1">
										<li>
											<strong>Chrome:</strong> Ustawienia {">"} Prywatność i
											bezpieczeństwo {">"} Pliki cookie
										</li>
										<li>
											<strong>Firefox:</strong> Opcje {">"} Prywatność i
											bezpieczeństwo {">"} Ciasteczka
										</li>
										<li>
											<strong>Safari:</strong> Preferencje {">"} Prywatność{" "}
											{">"} Cookies
										</li>
										<li>
											<strong>Edge:</strong> Ustawienia {">"} Pliki cookie i
											uprawnienia witryny
										</li>
									</ul>
								</li>
							</ol>
							<p className="mt-4 text-sm text-muted-foreground">
								<strong>Uwaga:</strong> Całkowite zablokowanie plików cookies
								może uniemożliwić korzystanie z części funkcji platformy (np.
								logowanie, zapamiętywanie postępów).
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§4 Okres przechowywania plików cookies
							</h2>
							<ul className="list-disc list-inside space-y-2 ml-4">
								<li>
									<strong>Pliki sesyjne</strong> – usuwane automatycznie po
									zamknięciu przeglądarki
								</li>
								<li>
									<strong>Pliki trwałe</strong> – pozostają na urządzeniu przez
									określony czas (zazwyczaj od kilku dni do 12 miesięcy)
								</li>
							</ul>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§5 Pliki cookies zewnętrznych dostawców
							</h2>
							<p className="mb-3">
								Platforma może korzystać z usług zewnętrznych dostawców, którzy
								również używają plików cookies:
							</p>
							<ul className="list-disc list-inside space-y-2 ml-4">
								<li>
									<strong>Google Analytics</strong> – analiza statystyk (jeśli
									Użytkownik wyrazi zgodę)
								</li>
								<li>
									<strong>Stripe</strong> – obsługa płatności
								</li>
							</ul>
							<p className="mt-3">
								Administratorzy tych usług mają własne polityki prywatności i
								zarządzają plikami cookies niezależnie od PPLA Academy.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§6 Zgodność z prawem
							</h2>
							<p className="mb-2">Niniejsza Polityka Cookies jest zgodna z:</p>
							<ul className="list-disc list-inside space-y-1 ml-4">
								<li>Rozporządzeniem RODO (UE 2016/679)</li>
								<li>Dyrektywą ePrivacy (2002/58/WE)</li>
								<li>
									Ustawą o świadczeniu usług drogą elektroniczną (Dz.U. 2002 nr
									144 poz. 1204)
								</li>
							</ul>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">§7 Kontakt</h2>
							<p>
								W razie pytań dotyczących plików cookies, prosimy o kontakt pod
								adresem e-mail: [adres e-mail].
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

export default CookiesPolicy;
