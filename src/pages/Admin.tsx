import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CheckCircle, AlertCircle, FileJson, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { parsePdfTableQuestions } from "@/utils/parsePdfTableQuestions";
import { parseJsonQuestions } from "@/utils/parseJsonQuestions";
const Admin = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; count: number } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<{ processed: number; failed: number; batchSize: number; remaining: number } | null>(null);
  const { toast } = useToast();

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleJsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJsonFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handlePdfUpload = async () => {
    if (!pdfFile) {
      toast({
        title: "Brak pliku",
        description: "Wybierz plik PDF z pytaniami",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Configure PDF.js worker
      // @ts-ignore
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      // Extract text from PDF in browser
      setProgress(20);
      const arrayBuffer = await pdfFile.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;

      let text = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = (content.items as any[]).map((i: any) => i.str).join(' ');
        text += pageText + '\n';
      }

      setProgress(50);

      // Parse text into questions using utility function
      console.log('Extracted text length:', text.length);
      const questions = parsePdfTableQuestions(text);
      console.log(`Parsed ${questions.length} questions from PDF`);

      if (!questions.length) throw new Error('Nie udało się znaleźć pytań w PDF.');

      await insertQuestions(questions);
    } catch (error: any) {
      console.error('Upload error:', error);
      setResult({ success: false, count: 0 });
      toast({ title: 'Błąd importu', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleJsonUpload = async () => {
    if (!jsonFile) {
      toast({
        title: "Brak pliku",
        description: "Wybierz plik JSON z pytaniami",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      setProgress(20);
      const text = await jsonFile.text();
      
      setProgress(40);
      const questions = parseJsonQuestions(text);
      console.log(`Parsed ${questions.length} questions from JSON`);

      if (!questions.length) throw new Error('Nie udało się znaleźć pytań w JSON.');

      await insertQuestions(questions);
    } catch (error: any) {
      console.error('Upload error:', error);
      setResult({ success: false, count: 0 });
      toast({ title: 'Błąd importu', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const insertQuestions = async (questions: any[]) => {
    setProgress(60);

    // Get existing questions by text to avoid duplicates
    const { data: existingQuestions } = await supabase
      .from('questions')
      .select('question');
    
    const existingTexts = new Set(
      existingQuestions?.map(q => q.question) || []
    );

    // Filter out duplicates
    const newQuestions = questions.filter(q => {
      return !existingTexts.has(q.question);
    });

    console.log(`Filtered to ${newQuestions.length} new questions (${questions.length - newQuestions.length} duplicates skipped)`);

    if (!newQuestions.length) {
      throw new Error('Wszystkie pytania już istnieją w bazie danych.');
    }

    setProgress(80);

    // Insert new questions (RLS allows admin inserts)
    const { data, error } = await supabase
      .from('questions')
      .insert(newQuestions)
      .select();

    if (error) throw error;

    setProgress(100);
    setResult({ success: true, count: data?.length || 0 });
    toast({ title: 'Sukces!', description: `Zaimportowano ${data?.length || 0} pytań do bazy.` });
  };

  const handleGenerateExplanations = async () => {
    setGenerating(true);
    setGenResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-explanations');

      if (error) throw error;

      setGenResult({
        processed: data.processed || 0,
        failed: data.failed || 0,
        batchSize: data.batchSize || 0,
        remaining: data.remaining || 0,
      });

      const remainingMsg = data.remaining > 0 
        ? ` Pozostało: ${data.remaining} pytań.`
        : ' Wszystkie gotowe!';

      toast({
        title: data.remaining > 0 ? 'Batch wygenerowany' : 'Wszystko gotowe!',
        description: `Wygenerowano ${data.processed} wyjaśnień.${remainingMsg}`,
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: 'Błąd generowania',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel administratora</h1>
        <p className="text-muted-foreground mt-2">
          Wgraj plik PDF z pytaniami egzaminacyjnymi PPLA
        </p>
      </div>

      <Tabs defaultValue="json" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="json">Import JSON</TabsTrigger>
          <TabsTrigger value="pdf">Import PDF</TabsTrigger>
          <TabsTrigger value="generate">Generuj AI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                Import pytań z JSON
              </CardTitle>
              <CardDescription>
                Obsługuje dwa formaty: stary (numer, pytanie, odp1-4) oraz nowy (id, question, answers[], correct).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="json-file">Wybierz plik JSON</Label>
                <Input
                  id="json-file"
                  type="file"
                  accept=".json"
                  onChange={handleJsonFileChange}
                  disabled={uploading}
                />
              </div>

              {jsonFile && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">{jsonFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Rozmiar: {(jsonFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground text-center">
                    Przetwarzanie JSON...
                  </p>
                </div>
              )}

              {result && (
                <div className={`p-4 rounded-md flex items-start gap-3 ${
                  result.success ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {result.success ? 'Import zakończony sukcesem!' : 'Wystąpił błąd podczas importu'}
                    </p>
                    {result.success && (
                      <p className="text-sm opacity-90">
                        Dodano {result.count} pytań do bazy danych
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleJsonUpload} 
                disabled={!jsonFile || uploading}
                className="w-full"
              >
                {uploading ? 'Importowanie...' : 'Importuj pytania'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdf">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import pytań z PDF
              </CardTitle>
              <CardDescription>
                PDF powinien zawierać pytania w formacie tabelarycznym z kodem pytania (PL010-xxx).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdf-file">Wybierz plik PDF</Label>
                <Input
                  id="pdf-file"
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfFileChange}
                  disabled={uploading}
                />
              </div>

              {pdfFile && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">{pdfFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Rozmiar: {(pdfFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground text-center">
                    Przetwarzanie PDF...
                  </p>
                </div>
              )}

              {result && (
                <div className={`p-4 rounded-md flex items-start gap-3 ${
                  result.success ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {result.success ? 'Import zakończony sukcesem!' : 'Wystąpił błąd podczas importu'}
                    </p>
                    {result.success && (
                      <p className="text-sm opacity-90">
                        Dodano {result.count} pytań do bazy danych
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button 
                onClick={handlePdfUpload} 
                disabled={!pdfFile || uploading}
                className="w-full"
              >
                {uploading ? 'Importowanie...' : 'Importuj pytania'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Generuj wyjaśnienia AI
              </CardTitle>
              <CardDescription>
                Automatycznie wygeneruj wyjaśnienia AI dla wszystkich pytań, które jeszcze ich nie mają.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generating && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span className="font-medium text-sm">Generowanie wyjaśnień...</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    To może potrwać kilka minut w zależności od liczby pytań
                  </p>
                </div>
              )}

              {genResult && (
                <div className={`p-4 rounded-md border ${
                  genResult.remaining === 0 
                    ? 'bg-success/10 border-success/20' 
                    : 'bg-primary/10 border-primary/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className={`h-5 w-5 mt-0.5 ${
                      genResult.remaining === 0 ? 'text-success' : 'text-primary'
                    }`} />
                    <div className="space-y-1">
                      <p className="font-medium">
                        {genResult.remaining === 0 ? 'Wszystko gotowe!' : 'Batch przetworzony'}
                      </p>
                      <div className="text-sm space-y-0.5">
                        <p>✅ Wygenerowano: {genResult.processed}</p>
                        {genResult.failed > 0 && <p>❌ Błędy: {genResult.failed}</p>}
                        {genResult.remaining > 0 ? (
                          <p className="font-medium text-primary">
                            📊 Pozostało: {genResult.remaining} pytań - kliknij ponownie!
                          </p>
                        ) : (
                          <p className="font-medium text-success">
                            🎉 Wszystkie pytania mają wyjaśnienia!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted rounded-md space-y-2">
                <p className="text-sm font-medium">ℹ️ Jak to działa:</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Funkcja przetwarza 20 pytań na raz (unikanie timeoutów)</li>
                  <li>Po zakończeniu batcha, kliknij ponownie aby kontynuować</li>
                  <li>Powtarzaj aż wszystkie pytania będą gotowe</li>
                  <li>Pytania z istniejącymi wyjaśnieniami są pomijane</li>
                </ul>
              </div>

              <Button 
                onClick={handleGenerateExplanations} 
                disabled={generating || (genResult?.remaining === 0)}
                className="w-full"
              >
                {generating ? 'Generowanie batcha...' : 
                 genResult?.remaining === 0 ? 'Wszystkie pytania gotowe ✓' :
                 genResult?.remaining ? `Generuj kolejne 20 (pozostało ${genResult.remaining})` :
                 'Rozpocznij generowanie wyjaśnień'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
