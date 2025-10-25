import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Loader2, Database, Download } from "lucide-react";

// Stara baza danych (źródło)
const OLD_SUPABASE_URL = "https://exkmhzdwgiovivncdmtp.supabase.co";
const OLD_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4a21oemR3Z2lvdml2bmNkbXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNTgzNzUsImV4cCI6MjA3NjYzNDM3NX0.By2dpO-vlwxXEbzJOKCXhh6rzsvkqnPDhR5-Xw6X84Q";

import { createClient } from '@supabase/supabase-js';

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);

const DataMigration = () => {
  const { toast } = useToast();
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [results, setResults] = useState<{
    total: number;
    success: number;
    failed: number;
    errors: string[];
  }>({
    total: 0,
    success: 0,
    failed: 0,
    errors: []
  });

  const startMigration = async () => {
    setIsMigrating(true);
    setProgress(0);
    setStatus("Łączenie ze starą bazą danych...");
    
    try {
      // Krok 1: Pobierz wszystkie pytania ze starej bazy
      setStatus("Pobieranie pytań ze starej bazy (1,332 pytania)...");
      const { data: oldQuestions, error: fetchError } = await oldSupabase
        .from('questions')
        .select('question, answer_a, answer_b, answer_c, answer_d, correct_answer, category, question_code, explanation, image_url')
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw new Error(`Błąd pobierania danych: ${fetchError.message}`);
      }

      if (!oldQuestions || oldQuestions.length === 0) {
        throw new Error("Nie znaleziono pytań w starej bazie");
      }

      setResults(prev => ({ ...prev, total: oldQuestions.length }));
      setStatus(`Pobrano ${oldQuestions.length} pytań. Rozpoczynam import...`);
      setProgress(10);

      // Krok 2: Import w partiach po 50 pytań
      const BATCH_SIZE = 50;
      const batches = [];
      
      for (let i = 0; i < oldQuestions.length; i += BATCH_SIZE) {
        batches.push(oldQuestions.slice(i, i + BATCH_SIZE));
      }

      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        setStatus(`Importowanie partii ${i + 1}/${batches.length} (${successCount}/${oldQuestions.length} pytań)...`);
        
        try {
          const { error: insertError } = await supabase
            .from('questions')
            .insert(batch);

          if (insertError) {
            failedCount += batch.length;
            errors.push(`Partia ${i + 1}: ${insertError.message}`);
          } else {
            successCount += batch.length;
          }
        } catch (err) {
          failedCount += batch.length;
          errors.push(`Partia ${i + 1}: ${err instanceof Error ? err.message : 'Nieznany błąd'}`);
        }

        // Aktualizuj progress
        const currentProgress = 10 + ((i + 1) / batches.length) * 90;
        setProgress(Math.round(currentProgress));
      }

      setResults({
        total: oldQuestions.length,
        success: successCount,
        failed: failedCount,
        errors
      });

      if (successCount === oldQuestions.length) {
        setStatus("✅ Migracja zakończona pomyślnie!");
        toast({
          title: "Sukces!",
          description: `Zaimportowano ${successCount} pytań`,
        });
      } else {
        setStatus(`⚠️ Migracja zakończona z błędami: ${successCount}/${oldQuestions.length} pytań`);
        toast({
          title: "Migracja zakończona z błędami",
          description: `Zaimportowano: ${successCount}, Błędy: ${failedCount}`,
          variant: "destructive"
        });
      }
      
      setProgress(100);
    } catch (error) {
      console.error('Migration error:', error);
      setStatus(`❌ Błąd migracji: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
      toast({
        title: "Błąd migracji",
        description: error instanceof Error ? error.message : "Nieznany błąd",
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6" />
            Narzędzie Migracji Danych
          </CardTitle>
          <CardDescription>
            Automatyczny import 1,332 pytań egzaminacyjnych ze starej bazy do nowej
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status */}
          {status && (
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm font-medium">{status}</p>
            </div>
          )}

          {/* Progress Bar */}
          {isMigrating && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">{progress}%</p>
            </div>
          )}

          {/* Results */}
          {results.total > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{results.total}</div>
                      <div className="text-xs text-muted-foreground mt-1">Całkowita</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-6 h-6" />
                        {results.success}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Sukces</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 flex items-center justify-center gap-1">
                        <XCircle className="w-6 h-6" />
                        {results.failed}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Błędy</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Errors */}
              {results.errors.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Błędy podczas importu:
                    </h3>
                    <ul className="text-xs text-red-600 space-y-1 max-h-40 overflow-y-auto">
                      {results.errors.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={startMigration} 
            disabled={isMigrating}
            size="lg"
            className="w-full"
          >
            {isMigrating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Migracja w toku...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Rozpocznij Migrację
              </>
            )}
          </Button>

          {/* Instructions */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-700 mb-2">📋 Instrukcje:</h3>
              <ol className="text-sm text-blue-600 space-y-1">
                <li>1. Upewnij się, że wykonałeś skrypt struktury bazy w Supabase</li>
                <li>2. Kliknij przycisk "Rozpocznij Migrację"</li>
                <li>3. Poczekaj 1-2 minuty na zakończenie (1,332 pytania)</li>
                <li>4. Po zakończeniu sprawdź sekcję "Nauka" - pytania powinny się wyświetlać</li>
              </ol>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataMigration;
