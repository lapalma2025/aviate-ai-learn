import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieBanner = () => {
  const { showBanner, preferences, acceptAll, rejectAll, savePreferences } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [tempPreferences, setTempPreferences] = useState(preferences);

  if (!showBanner) return null;

  const handleSaveCustom = () => {
    savePreferences(tempPreferences);
    setShowDetails(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-md border-t border-border shadow-lg animate-in slide-in-from-bottom duration-500">
        <div className="container mx-auto max-w-6xl">
          <Card className="p-6 border-primary/20">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Ta strona używa plików cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Używamy plików cookies, aby zapewnić prawidłowe działanie platformy oraz analizować ruch na
                    stronie. Możesz zarządzać swoimi preferencjami w dowolnym momencie.{' '}
                    <Link to="/cookies-policy" className="text-primary hover:underline">
                      Dowiedz się więcej
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button variant="outline" onClick={() => setShowDetails(true)} className="whitespace-nowrap">
                  Dostosuj
                </Button>
                <Button variant="outline" onClick={rejectAll} className="whitespace-nowrap">
                  Odrzuć wszystkie
                </Button>
                <Button onClick={acceptAll} className="whitespace-nowrap">
                  Akceptuj wszystkie
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ustawienia plików cookies</DialogTitle>
            <DialogDescription>
              Wybierz, które kategorie plików cookies chcesz aktywować. Pliki niezbędne są zawsze wymagane.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
              <Checkbox checked disabled />
              <div className="space-y-1 flex-1">
                <Label className="font-semibold">Pliki niezbędne</Label>
                <p className="text-sm text-muted-foreground">
                  Wymagane do prawidłowego działania platformy (uwierzytelnianie, sesja, preferencje).
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-muted/30 transition-colors">
              <Checkbox
                checked={tempPreferences.analytics}
                onCheckedChange={(checked) =>
                  setTempPreferences((prev) => ({ ...prev, analytics: checked as boolean }))
                }
              />
              <div className="space-y-1 flex-1">
                <Label className="font-semibold cursor-pointer">Pliki analityczne</Label>
                <p className="text-sm text-muted-foreground">
                  Pomagają nam zrozumieć, jak korzystasz z platformy i ulepszać jej funkcjonalność.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-muted/30 transition-colors">
              <Checkbox
                checked={tempPreferences.marketing}
                onCheckedChange={(checked) =>
                  setTempPreferences((prev) => ({ ...prev, marketing: checked as boolean }))
                }
              />
              <div className="space-y-1 flex-1">
                <Label className="font-semibold cursor-pointer">Pliki marketingowe</Label>
                <p className="text-sm text-muted-foreground">
                  Służą do personalizacji reklam i powiadomień o nowych funkcjach platformy.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={rejectAll}>
              Tylko niezbędne
            </Button>
            <Button onClick={handleSaveCustom}>Zapisz preferencje</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
