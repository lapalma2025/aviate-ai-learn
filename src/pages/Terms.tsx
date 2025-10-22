import { Card } from '@/components/ui/card';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
          <h1 className="text-4xl font-bold mb-8 text-center">Regulamin korzystania z platformy PPLA Academy</h1>

          <div className="prose prose-slate max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">§1 Postanowienia ogólne</h2>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  Niniejszy Regulamin określa zasady korzystania z platformy internetowej PPLA Academy, dostępnej pod
                  adresem [adres strony].
                </li>
                <li>
                  Administratorem platformy jest [Nazwa firmy/osoby], z siedzibą w [adres], NIP: [numer], REGON:
                  [numer].
                </li>
                <li>
                  Korzystanie z platformy jest równoznaczne z akceptacją niniejszego Regulaminu oraz Polityki
                  Prywatności.
                </li>
                <li>Regulamin wchodzi w życie z dniem jego publikacji na stronie internetowej.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">§2 Definicje</h2>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <strong>Platforma</strong> – serwis internetowy PPLA Academy wraz z wszystkimi jego funkcjonalnościami.
                </li>
                <li>
                  <strong>Użytkownik</strong> – osoba fizyczna korzystająca z platformy, posiadająca pełną zdolność do
                  czynności prawnych.
                </li>
                <li>
                  <strong>Konto</strong> – indywidualne konto Użytkownika umożliwiające dostęp do treści platformy.
                </li>
                <li>
                  <strong>Usługa</strong> – dostęp do materiałów edukacyjnych, pytań egzaminacyjnych oraz funkcji
                  platformy.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">§3 Warunki korzystania z platformy</h2>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Korzystanie z platformy wymaga rejestracji i utworzenia konta Użytkownika.</li>
                <li>
                  Użytkownik zobowiązany jest do podania prawdziwych danych podczas rejestracji oraz do ich aktualizacji
                  w przypadku zmian.
                </li>
                <li>
                  Użytkownik ponosi pełną odpowiedzialność za zachowanie w tajemnicy danych dostępowych do swojego konta.
                </li>
                <li>
                  Zabrania się udostępniania swojego konta osobom trzecim oraz korzystania z platformy w sposób
                  naruszający prawo lub dobra innych użytkowników.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">§4 Zasady płatności i dostępu</h2>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Dostęp do pełnej funkcjonalności platformy jest płatny i wymaga jednorazowej opłaty w wysokości 30 PLN.</li>
                <li>Płatność jest realizowana za pośrednictwem systemu płatności elektronicznych Stripe.</li>
                <li>Po zaksięgowaniu płatności Użytkownik uzyskuje roczny dostęp do wszystkich materiałów i funkcji platformy.</li>
                <li>Administrator nie zwraca opłat za dostęp, chyba że usługa nie została świadczona z przyczyn leżących po stronie Administratora.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">§5 Prawa autorskie</h2>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  Wszelkie treści zamieszczone na platformie (pytania, wyjaśnienia, grafiki, materiały) są chronione
                  prawem autorskim.
                </li>
                <li>
                  Zabronione jest kopiowanie, rozpowszechnianie, modyfikowanie lub wykorzystywanie treści platformy bez
                  zgody Administratora.
                </li>
                <li>Użytkownik może korzystać z materiałów wyłącznie na użytek własny, w celach edukacyjnych.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">§6 Odpowiedzialność</h2>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  Administrator dołoży wszelkich starań, aby materiały na platformie były zgodne z obowiązującymi
                  przepisami dotyczącymi egzaminu PPLA.
                </li>
                <li>
                  Administrator nie ponosi odpowiedzialności za wyniki egzaminu Użytkownika ani za ewentualne błędy w
                  materiałach.
                </li>
                <li>
                  Administrator zastrzega sobie prawo do czasowego wyłączenia platformy w celach konserwacyjnych lub
                  aktualizacyjnych.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">§7 Reklamacje</h2>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  Użytkownik ma prawo zgłosić reklamację dotyczącą funkcjonowania platformy na adres e-mail:
                  [adres e-mail].
                </li>
                <li>Reklamacja powinna zawierać opis problemu oraz dane kontaktowe Użytkownika.</li>
                <li>Administrator rozpatrzy reklamację w terminie 14 dni od jej otrzymania.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">§8 Ochrona danych osobowych</h2>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  Administrator przetwarza dane osobowe Użytkowników zgodnie z obowiązującymi przepisami prawa,
                  w szczególności RODO.
                </li>
                <li>Szczegółowe informacje znajdują się w Polityce Prywatności.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">§9 Postanowienia końcowe</h2>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  Administrator zastrzega sobie prawo do zmiany Regulaminu. O zmianach Użytkownicy zostaną
                  poinformowani z 7-dniowym wyprzedzeniem.
                </li>
                <li>
                  W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego,
                  w szczególności Kodeksu Cywilnego.
                </li>
                <li>Spory będą rozstrzygane przez sąd właściwy dla siedziby Administratora.</li>
              </ol>
            </section>

            <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
              <p>Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}</p>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
