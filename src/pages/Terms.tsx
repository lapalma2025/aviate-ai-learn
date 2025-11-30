import { Card } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
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
						Regulamin Serwisu PPLA Academy
					</h1>

					<div className="prose prose-slate max-w-none space-y-6 text-foreground">
						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§1 Postanowienia wstępne
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Niniejszy Regulamin określa zasady korzystania z serwisu
									internetowego PPLA Academy, dostępnego pod adresem
									internetowym pplacademy.pl prowadzonego przez Michała
									Zborowskiego prowadzącego działalność gospodarczą pod firmą
									CodeWithMe Michał Zborowski, wpisaną do Centralnej Ewidencji i
									Informacji o Działalności Gospodarczej (CEIDG) prowadzonej
									przez ministra właściwego ds. gospodarki, NIP 8831870587,
									REGON 387076173.
								</li>
								<li>
									Serwis dostępny jest pod adresem internetowym: pplacademy.pl
								</li>
								<li>
									Regulamin określa zasady świadczenia usług drogą
									elektroniczną, w tym w szczególności rejestracji konta,
									logowania, dokonywania płatności oraz korzystania z treści
									edukacyjnych.
								</li>
								<li>
									Użytkownik przed rozpoczęciem korzystania z Serwisu
									zobowiązany jest zapoznać się z treścią niniejszego Regulaminu
									oraz Polityki Prywatności.
								</li>
								<li>
									Korzystanie z Serwisu oznacza akceptację niniejszego
									Regulaminu.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">§2 Definicje</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									<strong>Usługodawca</strong> – osoba fizyczna prowadząca
									działalność gospodarczą pod firmą CodeWithMe Michał Zborowski,
									wpisaną do Centralnej Ewidencji i Informacji o Działalności
									Gospodarczej (CEIDG) prowadzonej przez ministra właściwego ds.
									gospodarki, NIP 8831870587, REGON 387076173.
								</li>
								<li>
									<strong>Usługobiorca (Użytkownik)</strong> – każdy podmiot
									korzystający z Serwisu, w tym dokonujący zakupu za
									pośrednictwem Serwisu.
								</li>
								<li>
									<strong>Konsument</strong> – osoba fizyczna dokonująca z
									przedsiębiorcą czynności prawnej niezwiązanej bezpośrednio z
									jej działalnością gospodarczą lub zawodową.
								</li>
								<li>
									<strong>Przedsiębiorca</strong> – osoba fizyczna, osoba prawna
									i jednostka organizacyjna niebędąca osobą prawną, której
									odrębna ustawa przyznaje zdolność prawną, wykonująca we
									własnym imieniu działalność gospodarczą, która korzysta ze
									Serwisu.
								</li>
								<li>
									<strong>Serwis (Platforma)</strong> – platforma edukacyjna
									prowadzona przez Usługodawcę pod adresem internetowym
									pplacademy.pl
								</li>
								<li>
									<strong>Umowa zawarta na odległość</strong> – umowa zawarta z
									Klientem w ramach zorganizowanego systemu zawierania umów na
									odległość (w ramach Serwisu), bez jednoczesnej fizycznej
									obecności stron, z wyłącznym wykorzystaniem jednego lub
									większej liczby środków porozumiewania się na odległość do
									chwili zawarcia umowy włącznie.
								</li>
								<li>
									<strong>Regulamin</strong> – niniejszy regulamin Serwisu.
								</li>
								<li>
									<strong>Zamówienie</strong> – oświadczenie woli Klienta
									składane za pomocą Formularza zamówienia i zmierzające
									bezpośrednio do zawarcia Umowy Świadczenia Usługi z
									Usługodawcą.
								</li>
								<li>
									<strong>Konto</strong> – konto klienta w Serwisie, w którym
									gromadzone są dane podane przez Klienta oraz informacje o
									złożonych przez niego Zamówieniach w Serwisie.
								</li>
								<li>
									<strong>Formularz rejestracji</strong> – formularz dostępny w
									Serwisie, umożliwiający utworzenie Konta.
								</li>
								<li>
									<strong>Formularz zamówienia</strong> – interaktywny formularz
									dostępny w Serwisie umożliwiający złożenie Zamówienia oraz
									określenie warunków Umowy Usługi, w tym sposobu płatności.
								</li>
								<li>
									<strong>Produkt (Usługa)</strong> – dostępna na stronie
									internetowej Serwisu usługa edukacyjna przygotowująca do
									egzaminu PPL(A), będąca przedmiotem Umowy o świadczenie usług
									między Usługobiorcą a Usługodawcą.
								</li>
								<li>
									<strong>Umowa Świadczenia Usługi (Umowa)</strong> – umowa
									udostępnienia treści edukacyjnych dotyczących egzaminu PPL(A),
									zawierana albo zawarta między Usługodawcą a Usługobiorcą za
									pośrednictwem strony internetowej Serwisu.
								</li>
								<li>
									<strong>Opłata</strong> – jednorazowa płatność w wysokości
									30,00 zł (słownie: trzydzieści złotych i zero groszy). Cena
									zawiera podatek VAT zgodnie z obowiązującymi przepisami.
								</li>
								<li>
									<strong>Treść cyfrowa</strong> – dane wytwarzane i dostarczane
									w postaci cyfrowej, w szczególności materiały edukacyjne,
									pytania egzaminacyjne, wyjaśnienia i inne treści dostępne w
									Serwisie.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§3 Kontakt z Serwisem
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>Adres e-mail Usługodawcy: kontakt@pplacademy.pl</li>
								<li>
									Klient może porozumiewać się z Usługodawcą za pomocą adresu
									e-mail podanego w punkcie 1.
								</li>
								<li>
									Usługodawca zobowiązuje się do odpowiedzi na wiadomości e-mail
									w terminie do 3 dni roboczych od ich otrzymania.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§4 Wymagania techniczne
							</h2>
							<p className="mb-2">
								Do korzystania z usługi edukacyjnej udzielanej za pomocą
								Serwisu, w tym przeglądania treści edukacyjnych przygotowujących
								do egzaminu PPL(A), niezbędne są:
							</p>
							<ol className="list-[lower-alpha] list-inside space-y-2 ml-4">
								<li>
									urządzenie końcowe z dostępem do sieci Internet i przeglądarką
									internetową (Chrome, Firefox, Safari, Edge w aktualnych
									wersjach),
								</li>
								<li>aktywne konto poczty elektronicznej (e-mail),</li>
								<li>włączona obsługa plików cookies,</li>
								<li>
									włączona obsługa JavaScript w przeglądarce internetowej.
								</li>
								<li>
									Serwis jest zoptymalizowany do działania na urządzeniach
									mobilnych, jednak pełna funkcjonalność może być dostępna
									wyłącznie w przeglądarkach desktopowych.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§5 Zakres usług / Przedmiot umowy
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Usługodawca umożliwia dostęp do treści edukacyjnych
									Usługobiorcom po uprzednim uiszczeniu opłaty, tym samym
									umożliwiając naukę do egzaminu PPL(A) poprzez dostęp do bazy
									pytań, odpowiedzi oraz wyjaśnień udostępnianych w Serwisie.
								</li>
								<li>
									Opłata wymieniona w §2 pkt 14 jest jednorazowa oraz
									udostępniona w widocznym miejscu na stronie internetowej
									Serwisu. Usługodawca zastrzega sobie prawo do zmian ceny
									prowadzonej usługi z zastrzeżeniem, że zmiany cen nie dotyczą
									umów już zawartych.
								</li>
								<li>
									Usługodawca ma prawo zmieniać i ulepszać stronę internetową
									Serwisu w trakcie obowiązywania umowy, co może na jakiś czas
									ograniczyć funkcje platformy edukacyjnej. Użytkownik
									oświadcza, że został z tym faktem zaznajomiony i wyraża na tę
									ewentualność zgodę.
								</li>
								<li>
									Usługodawca w najszerszym dopuszczalnym przez prawo zakresie
									nie ponosi odpowiedzialności za zakłócenia, w tym przerwy w
									funkcjonowaniu strony internetowej prowadzonej przez
									Usługodawcę spowodowane siłą wyższą, niedozwolonym działaniem
									osób trzecich lub niekompatybilnością Serwisu internetowego z
									infrastrukturą techniczną Klienta.
								</li>
								<li>
									Serwis ma charakter edukacyjny – nie jest oficjalnym źródłem
									Urzędu Lotnictwa Cywilnego ani nie gwarantuje pozytywnego
									wyniku egzaminu PPL(A).
								</li>
								<li>
									Usługodawca dołoży wszelkich starań, aby materiały na
									platformie były zgodne z obowiązującymi przepisami dotyczącymi
									egzaminu PPL(A), jednak nie ponosi odpowiedzialności za wyniki
									egzaminu Użytkownika ani za ewentualne błędy w materiałach.
								</li>
								<li>
									Usługodawca zastrzega sobie prawo do aktualizacji, modyfikacji
									lub usuwania treści edukacyjnych w celu dostosowania ich do
									aktualnych wymogów egzaminacyjnych lub przepisów prawnych.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§6 Sposób realizacji usługi
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Usługodawca po zaksięgowaniu jednorazowej opłaty (poprzez
									system płatności Stripe Payments Europe, Ltd., BLIK, kartę
									płatniczą lub Klarna) natychmiastowo udostępnia platformę
									edukacyjną na stronie internetowej Serwisu wraz z wszystkimi
									materiałami edukacyjnymi niezbędnymi do prawidłowego
									realizowania przedmiotu Umowy.
								</li>
								<li>
									Dostęp do platformy jest udzielany na okres 12 (dwunastu)
									miesięcy, licząc od daty założenia konta oraz zaksięgowania
									opłaty przez Usługobiorcę.
								</li>
								<li>
									Po upływie okresu, o którym mowa w punkcie 2, dostęp do
									platformy wygasa automatycznie, chyba że Użytkownik dokona
									ponownej opłaty za przedłużenie dostępu.
								</li>
								<li>
									Usługodawca poinformuje Użytkownika o zbliżającym się terminie
									wygaśnięcia dostępu za pośrednictwem wiadomości e-mail na co
									najmniej 7 dni przed upływem okresu dostępu.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§7 Zasady rejestracji i korzystania z konta
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Korzystanie z pełnej funkcjonalności platformy wymaga
									rejestracji i utworzenia konta Użytkownika.
								</li>
								<li>
									Użytkownik zobowiązany jest do podania prawdziwych i
									aktualnych danych podczas rejestracji oraz do ich niezwłocznej
									aktualizacji w przypadku zmian.
								</li>
								<li>
									Użytkownik ponosi pełną odpowiedzialność za zachowanie w
									tajemnicy danych dostępowych do swojego konta (login i hasło).
								</li>
								<li>
									W przypadku podejrzenia, że dane dostępowe zostały
									nieautoryzowanie wykorzystane przez osoby trzecie, Użytkownik
									zobowiązany jest niezwłocznie poinformować o tym Usługodawcę
									oraz zmienić hasło.
								</li>
								<li>
									Zabrania się udostępniania swojego konta osobom trzecim oraz
									korzystania z platformy w sposób naruszający prawo, dobra
									innych użytkowników lub zasady współżycia społecznego.
								</li>
								<li>
									Usługodawca ma prawo zablokować lub usunąć konto Użytkownika w
									przypadku naruszenia postanowień niniejszego Regulaminu, po
									uprzednim wezwaniu do zaprzestania naruszeń, chyba że
									charakter naruszenia wymaga natychmiastowego działania.
								</li>
								<li>
									Użytkownik może w każdej chwili usunąć swoje konto,
									kontaktując się z Usługodawcą. Usunięcie konta nie skutkuje
									zwrotem opłaty za niewykorzystany okres dostępu.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§8 Sposób dokonywania opłaty za usługi
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Opłata za dostęp do Serwisu jest dokonywana za pośrednictwem
									systemu płatności Stripe Payments Europe, Ltd. z
									wykorzystaniem jednej z następujących metod płatności:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>system płatności mobilnej BLIK,</li>
										<li>
											płatność kartą płatniczą (karty debetowe i kredytowe:
											Visa, Mastercard, American Express),
										</li>
										<li>
											płatność ratalna za pośrednictwem systemu Klarna (zgodnie
											z warunkami oferowanymi przez Klarna).
										</li>
									</ol>
								</li>
								<li>
									Wszystkie płatności są realizowane za pośrednictwem
									bezpiecznego systemu płatności elektronicznych Stripe Payments
									Europe, Ltd. (Irlandia), który zapewnia szyfrowanie danych
									oraz zgodność z międzynarodowymi standardami bezpieczeństwa
									(PCI DSS).
								</li>
								<li>
									Usługodawca nie przechowuje danych kart płatniczych
									Użytkowników - wszystkie dane płatnicze są przetwarzane
									bezpośrednio przez operatora płatności Stripe.
								</li>
								<li>
									W przypadku wybrania płatności ratalnej Klarna, Użytkownik
									zawiera odrębną umowę bezpośrednio z Klarna, a warunki
									ratalnego zakupu są określone przez Klarna zgodnie z jej
									regulaminem. Usługodawca nie jest stroną tej umowy.
								</li>
								<li>
									Po zaksięgowaniu płatności (lub w przypadku płatności ratalnej
									Klarna - po autoryzacji płatności) Użytkownik uzyskuje
									natychmiastowy dostęp do wszystkich materiałów i funkcji
									platformy na okres 12 miesięcy.
								</li>
								<li>
									W przypadku płatności ratalnej Klarna, brak uregulowania rat
									zgodnie z harmonogramem może skutkować zablokowaniem dostępu
									do konta, zgodnie z warunkami określonymi przez Klarna.
								</li>
								<li>
									Zgodnie z art. 38 pkt 13 ustawy o prawach konsumenta,
									Użytkownik przy zakupie wyraża zgodę na rozpoczęcie
									świadczenia usługi przed upływem 14 dni od zawarcia umowy i
									traci prawo odstąpienia od umowy (szczegóły w §12).
								</li>
								<li>
									W przypadku problemów technicznych z płatnością Użytkownik
									może skontaktować się z Usługodawcą pod adresem
									kontakt@pplacademy.pl
								</li>
								<li>
									Usługodawca nie dokonuje zwrotu opłat za dostęp do Serwisu,
									chyba że usługa nie została świadczona z przyczyn leżących po
									stronie Usługodawcy lub Użytkownikowi przysługuje prawo
									odstąpienia od umowy zgodnie z obowiązującymi przepisami
									prawa.
								</li>
								<li>
									W przypadku anulowania transakcji przez operatora płatności
									lub bank Użytkownika, dostęp do Serwisu nie zostanie
									aktywowany do czasu poprawnego zaksięgowania płatności.
								</li>
								<li>
									Usługodawca wystawia potwierdzenie zakupu (paragon
									elektroniczny lub fakturę VAT na żądanie Użytkownika), które
									jest przesyłane na adres e-mail podany podczas rejestracji.
									Faktura wystawiana jest na podstawie danych podanych przez
									Użytkownika oraz zgodnie z obowiązującymi przepisami ustawy o
									podatku od towarów i usług.
								</li>
								<li>
									Wszystkie ceny podane w Serwisie są cenami ostatecznymi i
									zawierają wszystkie składniki, w tym podatek VAT (jeśli ma
									zastosowanie).
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§9 Prawa autorskie i własność intelektualna
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Wszelkie treści zamieszczone na platformie, w tym pytania
									egzaminacyjne, wyjaśnienia, grafiki, materiały edukacyjne,
									interfejs graficzny oraz kod źródłowy, są chronione prawem
									autorskim i stanowią własność Usługodawcy lub podmiotów
									trzecich, którzy udzielili Usługodawcy licencji.
								</li>
								<li>
									Zabronione jest kopiowanie, rozpowszechnianie, modyfikowanie,
									publikowanie, udostępnianie osobom trzecim lub wykorzystywanie
									w jakikolwiek inny sposób treści platformy bez uprzedniej
									pisemnej zgody Usługodawcy.
								</li>
								<li>
									Użytkownik może korzystać z materiałów wyłącznie na użytek
									własny, w celach edukacyjnych związanych z przygotowaniem do
									egzaminu PPL(A).
								</li>
								<li>
									Jakiekolwiek naruszenie praw autorskich może skutkować
									odpowiedzialnością cywilną i karną, a także natychmiastowym
									zablokowaniem dostępu do konta bez prawa do zwrotu opłaty.
								</li>
								<li>
									Użytkownik nie nabywa żadnych praw do treści udostępnianych w
									Serwisie poza prawem do korzystania z nich zgodnie z
									niniejszym Regulaminem.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§10 Odpowiedzialność
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Usługodawca nie ponosi odpowiedzialności za:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>wyniki egzaminu PPL(A) zdawanego przez Użytkownika,</li>
										<li>
											ewentualne błędy lub nieścisłości w materiałach
											edukacyjnych, które mogą wynikać ze zmian w przepisach lub
											wymaganiach egzaminacyjnych,
										</li>
										<li>
											szkody wynikłe z niewłaściwego korzystania z Serwisu przez
											Użytkownika lub przekazania danych dostępowych osobom
											trzecim,
										</li>
										<li>
											przerwy w dostępie do Serwisu spowodowane siłą wyższą,
											działaniem osób trzecich, atakami hakerskimi, awariami
											infrastruktury internetowej lub problemami technicznymi po
											stronie Użytkownika,
										</li>
										<li>
											utratę danych spowodowaną działaniem oprogramowania
											Użytkownika lub awarią jego urządzeń.
										</li>
									</ol>
								</li>
								<li>
									Usługodawca zastrzega sobie prawo do czasowego wyłączenia
									platformy w celach konserwacyjnych, aktualizacyjnych lub
									technicznych, informując o tym Użytkowników z odpowiednim
									wyprzedzeniem (co najmniej 24 godziny), o ile jest to możliwe.
									W przypadku pilnych prac konserwacyjnych czas ten może być
									krótszy.
								</li>
								<li>
									Użytkownik korzysta z Serwisu na własną odpowiedzialność i
									ponosi pełną odpowiedzialność za działania podejmowane na
									swoim koncie.
								</li>
								<li>
									Odpowiedzialność Usługodawcy z tytułu niewykonania lub
									nienależytego wykonania umowy jest ograniczona do wysokości
									uiszczonej przez Użytkownika opłaty za dostęp do Serwisu.
								</li>
								<li>
									Usługodawca zobowiązuje się do regularnego aktualizowania
									materiałów edukacyjnych, jednak nie gwarantuje, że wszystkie
									treści będą w każdym momencie w pełni aktualne i zgodne z
									najnowszymi wymaganiami egzaminacyjnymi.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">§11 Reklamacje</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Użytkownik ma prawo zgłosić reklamację dotyczącą
									funkcjonowania platformy lub świadczonych usług.
								</li>
								<li>
									Reklamację należy składać na adres e-mail:
									kontakt@pplacademy.pl
								</li>
								<li>
									Reklamacja powinna zawierać:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>
											dane kontaktowe Użytkownika (imię, nazwisko, adres e-mail
											przypisany do konta),
										</li>
										<li>szczegółowy opis problemu lub nieprawidłowości,</li>
										<li>datę i okoliczności wystąpienia problemu,</li>
										<li>
											żądanie Użytkownika związane z reklamacją (np. usunięcie
											błędu, zwrot opłaty, przedłużenie dostępu).
										</li>
									</ol>
								</li>
								<li>
									Usługodawca rozpatrzy reklamację w terminie 14 dni roboczych
									od jej otrzymania i poinformuje Użytkownika o sposobie jej
									rozpatrzenia na adres e-mail podany w reklamacji.
								</li>
								<li>
									W przypadku uznania reklamacji Usługodawca podejmie działania
									naprawcze, zaproponuje inne rozwiązanie satysfakcjonujące
									Użytkownika lub dokona zwrotu opłaty (w całości lub części) w
									zależności od charakteru reklamacji. Zwrot opłaty nastąpi w
									terminie nie dłuższym niż 14 dni od dnia uznania reklamacji.
								</li>
								<li>
									W przypadku odrzucenia reklamacji Usługodawca przedstawi
									szczegółowe uzasadnienie swojej decyzji.
								</li>
								<li>
									Konsument ma prawo skorzystać z pozasądowych sposobów
									rozpatrywania reklamacji i dochodzenia roszczeń, w
									szczególności poprzez:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>
											zwrócenie się do stałego polubownego sądu konsumenckiego
											działającego przy Inspekcji Handlowej,
										</li>
										<li>
											zwrócenie się do wojewódzkiego inspektora Inspekcji
											Handlowej z wnioskiem o wszczęcie postępowania
											mediacyjnego,
										</li>
										<li>
											skorzystanie z pomocy powiatowego (miejskiego) rzecznika
											konsumentów lub organizacji społecznej,
										</li>
									</ol>
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§12 Prawo odstąpienia od umowy
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									<strong>Dla Konsumentów:</strong>
								</li>
								<li>
									Zgodnie z ustawą z dnia 30 maja 2014 r. o prawach konsumenta,
									Konsument ma prawo odstąpić od umowy zawartej na odległość bez
									podania przyczyny w terminie 14 dni od dnia zawarcia umowy.
								</li>
								<li>
									Jednakże zgodnie z art. 38 pkt 13 ustawy o prawach konsumenta,
									prawo odstąpienia od umowy nie przysługuje Konsumentowi w
									przypadku umów o dostarczanie treści cyfrowych, które nie są
									zapisane na nośniku materialnym, jeżeli spełnianie świadczenia
									rozpoczęło się za wyraźną zgodą Konsumenta przed upływem
									terminu do odstąpienia od umowy i po poinformowaniu go przez
									przedsiębiorcę o utracie prawa odstąpienia od umowy.
								</li>
								<li>
									<strong>
										Wyrażenie zgody na natychmiastowe rozpoczęcie świadczenia
										usługi:
									</strong>
								</li>
								<li>
									Dokonując zakupu dostępu do Serwisu, Użytkownik (Konsument)
									wyraża wyraźną zgodę na natychmiastowe rozpoczęcie świadczenia
									usługi (natychmiastowy dostęp do treści cyfrowych w postaci
									materiałów edukacyjnych, pytań egzaminacyjnych i wyjaśnień).
								</li>
								<li>
									Użytkownik (Konsument) przyjmuje jednocześnie do wiadomości,
									że w związku z wyrażeniem zgody na natychmiastowe rozpoczęcie
									świadczenia usługi przed upływem 14-dniowego terminu na
									odstąpienie od umowy, traci prawo do odstąpienia od umowy.
								</li>
								<li>
									Powyższe oświadczenie jest składane poprzez zaznaczenie
									odpowiedniego checkboxa podczas procesu zakupu oraz
									potwierdzenie zakupu poprzez kliknięcie przycisku „Zapłać" lub
									równoważnego.
								</li>
								<li>
									<strong>
										Formularz odstąpienia od umowy (w przypadkach, gdy
										przysługuje takie prawo):
									</strong>
								</li>
								<li>
									W przypadku gdy Konsumentowi przysługuje prawo odstąpienia od
									umowy (np. gdy nie wyraził zgody na natychmiastowe rozpoczęcie
									świadczenia usługi lub gdy usługa nie została jeszcze
									rozpoczęta), może skorzystać z wzoru formularza odstąpienia od
									umowy:
								</li>
							</ol>

							<div className="ml-8 my-4 p-4 border border-border rounded-lg bg-muted/50">
								<p className="font-semibold mb-2">
									WZÓR FORMULARZA ODSTĄPIENIA OD UMOWY
								</p>
								<p className="mb-2">
									(formularz ten należy wypełnić i odesłać tylko w przypadku
									chęci odstąpienia od umowy)
								</p>
								<div className="space-y-2 text-sm">
									<p>Adresat:</p>
									<p>CodeWithMe Michał Zborowski</p>
									<p>kontakt@pplacademy.pl</p>
									<p className="mt-4">
										Ja/My(*) niniejszym informuję/informujemy(*) o
										moim/naszym(*) odstąpieniu od umowy o świadczenie
										następującej usługi(*)
									</p>
									<p>
										Data zawarcia umowy(*)/odbioru(*): ........................
									</p>
									<p>
										Imię i nazwisko konsumenta(-ów): ........................
									</p>
									<p>Adres konsumenta(-ów): ........................</p>
									<p>
										Adres poczty elektronicznej konsumenta:
										........................
									</p>
									<p className="mt-4">
										Podpis konsumenta(-ów) (tylko jeżeli formularz jest
										przesyłany w wersji papierowej): ........................
									</p>
									<p>Data: ........................</p>
									<p className="mt-4 text-xs italic">
										(*) Niepotrzebne skreślić
									</p>
								</div>
							</div>

							<ol
								className="list-decimal list-inside space-y-2 ml-4"
								start={10}
							>
								<li>
									Oświadczenie o odstąpieniu od umowy można przesłać na adres
									e-mail: kontakt@pplacademy.pl
								</li>
								<li>
									W przypadku skutecznego odstąpienia od umowy, Usługodawca
									zwróci Konsumentowi wszystkie otrzymane od niego płatności
									niezwłocznie, nie później niż w terminie 14 dni od dnia
									otrzymania oświadczenia o odstąpieniu od umowy.
								</li>
								<li>
									Zwrot płatności zostanie dokonany przy użyciu takich samych
									metod płatności, jakie zostały użyte przez Konsumenta w
									pierwotnej transakcji, chyba że Konsument wyraźnie zgodził się
									na inne rozwiązanie, które nie wiąże się dla niego z żadnymi
									kosztami.
								</li>
								<li>
									<strong>Dla Przedsiębiorców:</strong>
								</li>
								<li>
									Prawo odstąpienia od umowy w terminie 14 dni bez podania
									przyczyny przysługuje wyłącznie Konsumentom. Przedsiębiorcy
									nie mają prawa do odstąpienia od umowy na podstawie ustawy o
									prawach konsumenta.
								</li>
								<li>
									Przedsiębiorca może odstąpić od umowy wyłącznie w przypadkach
									przewidzianych w Kodeksie Cywilnym lub niniejszym Regulaminie.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§13 Ochrona danych osobowych
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Administratorem danych osobowych Użytkowników jest Michał
									Zborowski prowadzący działalność gospodarczą pod firmą
									CodeWithMe Michał Zborowski, NIP 8831870587, REGON 387076173.
								</li>
								<li>
									Dane osobowe Użytkowników są przetwarzane zgodnie z
									obowiązującymi przepisami prawa, w szczególności
									Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z
									dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w
									związku z przetwarzaniem danych osobowych i w sprawie
									swobodnego przepływu takich danych (RODO).
								</li>
								<li>
									Szczegółowe informacje dotyczące przetwarzania danych
									osobowych, w tym celu, zakresu, podstawy prawnej oraz praw
									Użytkowników, znajdują się w Polityce Prywatności dostępnej na
									stronie Serwisu.
								</li>
								<li>
									Użytkownik ma prawo do:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>dostępu do swoich danych osobowych,</li>
										<li>sprostowania (poprawiania) swoich danych osobowych,</li>
										<li>
											usunięcia danych osobowych („prawo do bycia zapomnianym"),
										</li>
										<li>ograniczenia przetwarzania danych osobowych,</li>
										<li>
											przenoszenia danych osobowych do innego administratora,
										</li>
										<li>wniesienia sprzeciwu wobec przetwarzania danych,</li>
										<li>
											cofnięcia zgody na przetwarzanie danych (jeśli
											przetwarzanie odbywa się na podstawie zgody).
										</li>
									</ol>
								</li>
								<li>
									W celu skorzystania z powyższych praw należy skontaktować się
									z Usługodawcą pod adresem: kontakt@pplacademy.pl
								</li>
								<li>
									Użytkownik ma prawo wniesienia skargi do organu nadzorczego
									(Prezesa Urzędu Ochrony Danych Osobowych), jeżeli uzna, że
									przetwarzanie jego danych osobowych narusza przepisy RODO.
								</li>
								<li>
									Dane osobowe są przetwarzane w celu:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>
											realizacji umowy o świadczenie usług (podstawa prawna:
											art. 6 ust. 1 lit. b RODO),
										</li>
										<li>
											prowadzenia rozliczeń i księgowości (podstawa prawna: art.
											6 ust. 1 lit. c RODO - obowiązek prawny),
										</li>
										<li>
											marketingu bezpośredniego (podstawa prawna: art. 6 ust. 1
											lit. f RODO - prawnie uzasadniony interes administratora),
										</li>
										<li>
											obsługi zapytań i reklamacji (podstawa prawna: art. 6 ust.
											1 lit. f RODO).
										</li>
									</ol>
								</li>
								<li>
									Dane osobowe mogą być przekazywane dostawcom usług
									technicznych niezbędnych do funkcjonowania Serwisu, w tym:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>
											operatorowi płatności Stripe Payments Europe, Ltd.
											(Irlandia),
										</li>
										<li>
											dostawcy infrastruktury bazodanowej Supabase Inc. (USA, z
											serwerami w UE),
										</li>
										<li>
											dostawcy usług hostingowych i infrastruktury chmurowej,
										</li>
										<li>
											dostawcy usług e-mail marketingowych (jeśli Użytkownik
											wyraził na to zgodę).
										</li>
									</ol>
									Wszyscy odbiorcy danych są zobowiązani do zachowania poufności
									i przetwarzania danych zgodnie z RODO.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§14 Polityka cookies
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Serwis wykorzystuje pliki cookies (ciasteczka) w celu
									zapewnienia prawidłowego funkcjonowania platformy, analizy
									ruchu, zapamiętywania preferencji oraz dostosowania treści do
									potrzeb Użytkowników.
								</li>
								<li>
									Rodzaje wykorzystywanych plików cookies:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>
											<strong>Niezbędne</strong> - umożliwiają podstawowe
											funkcjonowanie Serwisu (logowanie, sesje użytkownika),
										</li>
										<li>
											<strong>Funkcjonalne</strong> - zapamiętują preferencje
											Użytkownika,
										</li>
										<li>
											<strong>Analityczne</strong> - służą do analizy ruchu i
											sposobu korzystania z Serwisu,
										</li>
										<li>
											<strong>Marketingowe</strong> - służą do personalizacji
											reklam (jeśli dotyczy).
										</li>
									</ol>
								</li>
								<li>
									Szczegółowe informacje dotyczące wykorzystywania plików
									cookies znajdują się w Polityce Prywatności.
								</li>
								<li>
									Użytkownik może w każdej chwili zmienić ustawienia dotyczące
									plików cookies w swojej przeglądarce internetowej.
									Ograniczenie lub wyłączenie plików cookies może wpłynąć na
									funkcjonalność Serwisu.
								</li>
								<li>
									Przy pierwszej wizycie w Serwisie Użytkownik jest informowany
									o wykorzystywaniu plików cookies i ma możliwość wyrażenia
									zgody lub odmowy na poszczególne kategorie cookies (z
									wyjątkiem niezbędnych).
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§15 Zmiany Regulaminu
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Usługodawca zastrzega sobie prawo do wprowadzania zmian w
									niniejszym Regulaminie z ważnych przyczyn, takich jak:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>
											zmiana przepisów prawa mających wpływ na świadczenie
											usług,
										</li>
										<li>
											zmiana zakresu lub sposobu świadczenia usług w Serwisie,
										</li>
										<li>
											konieczność usunięcia niejasności lub błędów w
											Regulaminie,
										</li>
										<li>zmiana danych Usługodawcy,</li>
										<li>
											wprowadzenie nowych funkcjonalności lub usług w Serwisie.
										</li>
									</ol>
								</li>
								<li>
									O planowanych zmianach Regulaminu Użytkownicy zostaną
									poinformowani za pośrednictwem:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>
											wiadomości e-mail przesłanej na adres przypisany do konta,
										</li>
										<li>
											komunikatu wyświetlanego na stronie głównej Serwisu,
										</li>
									</ol>
									z co najmniej 7-dniowym wyprzedzeniem przed wejściem zmian w
									życie.
								</li>
								<li>
									Zmiany Regulaminu nie wpływają na umowy już zawarte i
									wykonywane w chwili wejścia w życie zmian, chyba że Użytkownik
									wyrazi zgodę na obowiązywanie nowego Regulaminu.
								</li>
								<li>
									W przypadku braku akceptacji zmian w Regulaminie Użytkownik ma
									prawo wypowiedzieć umowę ze skutkiem natychmiastowym przed
									wejściem w życie nowych postanowień, kontaktując się z
									Usługodawcą. W takim przypadku dostęp do Serwisu zostanie
									zachowany do końca opłaconego okresu.
								</li>
								<li>
									Kontynuowanie korzystania z Serwisu po wejściu w życie zmian
									Regulaminu oznacza akceptację nowych postanowień.
								</li>
								<li>
									Poprzednie wersje Regulaminu są archiwizowane i dostępne na
									żądanie Użytkownika.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§16 Rozwiązanie umowy
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Umowa o świadczenie usług zawarta jest na czas określony - 12
									miesięcy od dnia zaksięgowania opłaty i aktywacji konta.
								</li>
								<li>
									Umowa ulega rozwiązaniu z mocy prawa po upływie 12 miesięcy od
									dnia jej zawarcia, chyba że Użytkownik dokona przedłużenia
									dostępu poprzez uiszczenie kolejnej opłaty.
								</li>
								<li>
									Użytkownik może w każdej chwili zrezygnować z korzystania z
									Serwisu i usunąć swoje konto, kontaktując się z Usługodawcą.
									Rezygnacja z usługi lub usunięcie konta nie skutkuje zwrotem
									opłaty za niewykorzystany okres dostępu.
								</li>
								<li>
									Usługodawca może rozwiązać umowę ze skutkiem natychmiastowym w
									przypadku:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>
											rażącego naruszenia przez Użytkownika postanowień
											Regulaminu,
										</li>
										<li>
											udostępniania konta osobom trzecim lub nieautoryzowanego
											rozpowszechniania treści z platformy,
										</li>
										<li>
											korzystania z Serwisu w sposób naruszający prawo lub dobra
											innych użytkowników,
										</li>
										<li>
											działania Użytkownika zagrażającego bezpieczeństwu lub
											stabilności Serwisu.
										</li>
									</ol>
								</li>
								<li>
									W przypadku rozwiązania umowy z winy Użytkownika (pkt 4),
									Usługodawca nie zwraca opłaty za niewykorzystany okres dostępu
									oraz może dochodzić odszkodowania za powstałe szkody.
								</li>
							</ol>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								§17 Postanowienia końcowe
							</h2>
							<ol className="list-decimal list-inside space-y-2 ml-4">
								<li>
									Umowy o świadczenie usług zawierane są w języku polskim.
								</li>
								<li>
									W sprawach nieuregulowanych niniejszym Regulaminem
									zastosowanie mają przepisy prawa polskiego, w szczególności:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>ustawy z dnia 23 kwietnia 1964 r. Kodeks cywilny,</li>
										<li>ustawy z dnia 30 maja 2014 r. o prawach konsumenta,</li>
										<li>
											ustawy z dnia 18 lipca 2002 r. o świadczeniu usług drogą
											elektroniczną,
										</li>
										<li>
											Rozporządzenia Parlamentu Europejskiego i Rady (UE)
											2016/679 (RODO).
										</li>
									</ol>
								</li>
								<li>
									Wszelkie spory wynikłe z realizacji niniejszego Regulaminu
									będą rozstrzygane przez sąd właściwy dla siedziby Usługodawcy,
									z zastrzeżeniem bezwzględnie obowiązujących przepisów prawa
									dotyczących właściwości sądów dla Konsumentów.
								</li>
								<li>
									Konsument ma prawo do pozasądowego rozstrzygania sporów,
									korzystając z:
									<ol className="list-[lower-alpha] list-inside ml-6 mt-2 space-y-1">
										<li>
											mediacji prowadzonej przez właściwy terenowo Wojewódzki
											Inspektorat Inspekcji Handlowej,
										</li>
										<li>
											postępowania przed stałym polubownym sądem konsumenckim
											działającym przy Wojewódzkim Inspektoracie Inspekcji
											Handlowej,
										</li>
									</ol>
								</li>
								<li>
									Usługodawca nie jest zobowiązany ani nie zobowiązuje się do
									skorzystania z pozasądowych sposobów rozwiązywania sporów.
								</li>
								<li>
									W przypadku gdyby którekolwiek z postanowień niniejszego
									Regulaminu okazało się nieważne lub nieskuteczne, nie wpływa
									to na ważność pozostałych postanowień. W miejsce postanowienia
									nieważnego zastosowanie znajdzie odpowiedni przepis prawa
									polskiego.
								</li>
								<li>
									Regulamin wchodzi w życie z dniem jego publikacji na stronie
									internetowej Serwisu.
								</li>
								<li>
									Niniejszy Regulamin jest dostępny bezpłatnie w formie
									elektronicznej na stronie Serwisu, w sposób umożliwiający jego
									pozyskanie, odtwarzanie i utrwalanie za pomocą systemu
									teleinformatycznego, którym posługuje się Użytkownik.
								</li>
								<li>
									Pytania dotyczące Regulaminu można kierować na adres e-mail:
									kontakt@pplacademy.pl
								</li>
							</ol>
						</section>

						<div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
							<p>Data wejścia w życie Regulaminu: 30 listopad 2025 r.</p>
						</div>
					</div>
				</Card>
			</div>
			<Footer />
		</div>
	);
};

export default Terms;
