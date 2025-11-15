import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { Plane, Book, Stethoscope, GraduationCap, FileCheck, ClipboardCheck, Clock, AlertCircle, CheckCircle } from 'lucide-react';

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
            <Button size="lg">
              Rozpocznij przygotowania do egzaminu
            </Button>
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
              <strong>PPL(A)</strong> (Private Pilot Licence – Aeroplane) to licencja pilota prywatnego samolotowego,
              która uprawnia do prowadzenia samolotów jednodwusilnikowych w celach niekomercyjnych.
              Jest to podstawowe uprawnienie lotnicze, które otwiera drogę do dalszego rozwoju lotniczej kariery.
            </p>
            <p className="text-muted-foreground">
              Z licencją PPL(A) możesz latać samolotem z pasażerami, odkrywać nowe miejsca z powietrza
              i realizować marzenie o lotnictwie. Jest to pierwszy krok w karierze każdego pilota.
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
                  <strong>Wiek:</strong> minimum 17 lat (szkolenie można rozpocząć wcześniej)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Wykształcenie:</strong> ukończone minimum 8 klas szkoły podstawowej
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Badania lekarskie:</strong> pierwsza klasa medyczna lub LAPL Medical (świadectwo zdrowia lotniczego)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Znajomość języka polskiego:</strong> wymagana do nauki i egzaminu
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
              Szkolenie teoretyczne obejmuje <strong>minimum 100 godzin</strong> zajęć z następujących przedmiotów:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-muted-foreground">✈️ Prawo lotnicze (Air Law)</li>
              <li className="text-muted-foreground">🛩️ Budowa i systemy statku powietrznego (Aircraft General Knowledge)</li>
              <li className="text-muted-foreground">📊 Osiągi i planowanie lotu (Flight Performance and Planning)</li>
              <li className="text-muted-foreground">🌦️ Meteorologia (Meteorology)</li>
              <li className="text-muted-foreground">🧭 Nawigacja (Navigation)</li>
              <li className="text-muted-foreground">📋 Procedury operacyjne (Operational Procedures)</li>
              <li className="text-muted-foreground">🔄 Zasady lotu (Principles of Flight)</li>
              <li className="text-muted-foreground">📻 Łączność (Communications)</li>
            </ul>
            <p className="text-muted-foreground">
              Szkolenie można odbyć w <strong>szkole lotniczej</strong> (forma stacjonarna)
              lub samodzielnie przygotować się do egzaminu teoretycznego za pomocą platform takich jak PPLA Academy.
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
              Część praktyczna wymaga <strong>minimum 45 godzin lotu</strong>, w tym:
            </p>
            <div className="space-y-3 ml-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>25 godzin</strong> lotu z instruktorem (dual)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>10 godzin</strong> lotu solo (samodzielnie)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>5 godzin</strong> lotu nawigacyjnego solo (w tym jeden lot min. 270 km)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>3 godziny</strong> lotu przyrządowego pod osłoną
                </div>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">
              Szkolenie praktyczne odbywa się w <strong>szkole lotniczej</strong> posiadającej certyfikat ULC (Urząd Lotnictwa Cywilnego).
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
              Egzamin teoretyczny przeprowadza <strong>Urząd Lotnictwa Cywilnego (ULC)</strong>.
              Składa się z 8 testów (po jednym z każdego przedmiotu), każdy zawiera 16-24 pytania.
            </p>
            <div className="space-y-3 ml-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Próg zaliczenia:</strong> minimum 75% poprawnych odpowiedzi w każdym teście
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Czas trwania:</strong> każdy test trwa ok. 30-45 minut
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Ważność:</strong> wyniki egzaminu są ważne przez 24 miesiące
                </div>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">
              Przygotuj się skutecznie do egzaminu z <strong>PPLA Academy</strong> – naszą platformą
              z prawdziwymi pytaniami egzaminacyjnymi!
            </p>
          </CardContent>
        </Card>

        {/* Egzamin praktyczny */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Plane className="h-8 w-8 text-primary" />
              Egzamin praktyczny (Skill Test)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Po zdaniu egzaminu teoretycznego i ukończeniu wymaganej liczby godzin lotu,
              kandydat przystępuje do <strong>egzaminu praktycznego</strong> z egzaminatorem ULC.
            </p>
            <p className="text-muted-foreground">
              Egzamin obejmuje:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-muted-foreground">✈️ Część ustną (planowanie lotu, procedury, wiedza teoretyczna)</li>
              <li className="text-muted-foreground">🛫 Lot egzaminacyjny (starty, lądowania, manewry, nawigacja, procedury awaryjne)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Po zdaniu egzaminu praktycznego otrzymujesz <strong>licencję PPL(A)</strong>!
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
              <li className="text-muted-foreground">⏱️ Intensywności nauki (ile dni w tygodniu latasz)</li>
              <li className="text-muted-foreground">💰 Budżetu (możliwości finansowania kolejnych godzin lotu)</li>
              <li className="text-muted-foreground">🌤️ Warunków pogodowych (loty wymagają dobrej pogody)</li>
              <li className="text-muted-foreground">📚 Tempa nauki teorii</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              <strong>Średni czas:</strong> od 6 miesięcy do 2 lat. Przy intensywnym szkoleniu (np. wakacje)
              możliwe jest uzyskanie licencji w <strong>3-6 miesięcy</strong>.
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
                  <strong>Откładanie teorii na ostatnią chwilę</strong> – teoria wymaga czasu i systematycznej nauki
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                <div>
                  <strong>Zbyt długie przerwy między lotami</strong> – umiejętności trzeba regularnie ćwiczyć
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                <div>
                  <strong>Niedocenianie kosztów</strong> – należy zaplanować budżet z zapasem
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                <div>
                  <strong>Wybór niewłaściwej szkoły lotniczej</strong> – warto sprawdzić opinie i certyfikaty
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                <div>
                  <strong>Brak systematyczności</strong> – zarówno teoria jak i praktyka wymagają regularności
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
              Przygotuj się skutecznie do egzaminu teoretycznego z prawdziwymi pytaniami ULC,
              szczegółowymi wyjaśnieniami i systemem śledzenia postępów.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg">
                  Zacznij naukę już dziś
                </Button>
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