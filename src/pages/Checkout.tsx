import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { PRICE_AMOUNT } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

interface CheckoutProps {
  email: string;
  password: string;
}

const Checkout = ({ email, password }: CheckoutProps) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie pola karty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Symulacja płatności Stripe (zastąp prawdziwą integracją)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Po udanej płatności - zarejestruj użytkownika
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Płatność zatwierdzona!",
          description: "Twoje konto zostało utworzone. Możesz się teraz zalogować.",
        });
        navigate("/auth");
      }
    } catch (error: any) {
      toast({
        title: "Błąd płatności",
        description: error.message || "Nie udało się przetworzyć płatności",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Płatność</CardTitle>
        <CardDescription>
          Bezpieczna płatność przez Stripe
        </CardDescription>
        <div className="pt-4">
          <div className="text-4xl font-bold text-primary">{PRICE_AMOUNT} PLN</div>
          <p className="text-sm text-muted-foreground mt-2">Jednorazowa płatność za dożywotni dostęp</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Numer karty</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                maxLength={19}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Data ważności</Label>
              <Input
                id="expiry"
                type="text"
                placeholder="MM/RR"
                value={expiryDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                  }
                  setExpiryDate(value);
                }}
                maxLength={5}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength={3}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <Lock className="h-4 w-4" />
            <span>Płatność zabezpieczona przez Stripe</span>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Przetwarzanie...
              </>
            ) : (
              `Zapłać ${PRICE_AMOUNT} PLN`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Checkout;