import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
const Admin = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; count: number } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
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
      const arrayBuffer = await file.arrayBuffer();
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

      // Parse text into questions - more flexible parsing
      console.log('Extracted text length:', text.length);
      console.log('First 500 chars:', text.substring(0, 500));
      
      const textLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const questions: any[] = [];
      let currentQuestion: any = null;

      for (let i = 0; i < textLines.length; i++) {
        const line = textLines[i];
        
        // Match question number more flexibly
        const questionMatch = line.match(/^(\d+)[\.\)]\s*(.+)/);
        if (questionMatch) {
          const potentialQuestion = questionMatch[2].trim();
          // Only treat as new question if it doesn't start with A/B/C/D
          if (!potentialQuestion.match(/^[A-D][\.\)]/)) {
            // Save previous question if complete
            if (currentQuestion && currentQuestion.answer_a && currentQuestion.answer_b && currentQuestion.answer_c && currentQuestion.answer_d) {
              questions.push(currentQuestion);
            }
            currentQuestion = {
              question: potentialQuestion,
              answer_a: '',
              answer_b: '',
              answer_c: '',
              answer_d: '',
              correct_answer: 'A',
              category: 'operational_procedures'
            };
            continue;
          }
        }
        
        // Parse answers - support both . and ) formats
        if (currentQuestion) {
          const answerMatch = line.match(/^([A-D])[\.\)]\s*(.+)/);
          if (answerMatch) {
            const key = answerMatch[1];
            const text = answerMatch[2].trim();
            if (key === 'A') currentQuestion.answer_a = text;
            else if (key === 'B') currentQuestion.answer_b = text;
            else if (key === 'C') currentQuestion.answer_c = text;
            else if (key === 'D') currentQuestion.answer_d = text;
          } else if (line.length > 0) {
            // Continuation of previous text
            if (currentQuestion.answer_d) currentQuestion.answer_d += ' ' + line;
            else if (currentQuestion.answer_c) currentQuestion.answer_c += ' ' + line;
            else if (currentQuestion.answer_b) currentQuestion.answer_b += ' ' + line;
            else if (currentQuestion.answer_a) currentQuestion.answer_a += ' ' + line;
            else currentQuestion.question += ' ' + line;
          }
        }
      }
      
      // Add last question
      if (currentQuestion && currentQuestion.answer_a && currentQuestion.answer_b && currentQuestion.answer_c && currentQuestion.answer_d) {
        questions.push(currentQuestion);
      }

      console.log(`Parsed ${questions.length} questions from PDF`);

      if (!questions.length) throw new Error('Nie udało się znaleźć pytań w PDF.');

      setProgress(70);

      // Insert directly (RLS allows admin inserts)
      const { data, error } = await supabase
        .from('questions')
        .insert(questions)
        .select();

      if (error) throw error;

      setProgress(100);
      setResult({ success: true, count: data?.length || 0 });
      toast({ title: 'Sukces!', description: `Zaimportowano ${data?.length || 0} pytań do bazy.` });
    } catch (error: any) {
      console.error('Upload error:', error);
      setResult({ success: false, count: 0 });
      toast({ title: 'Błąd importu', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import pytań z PDF
          </CardTitle>
          <CardDescription>
            PDF powinien zawierać pytania w formacie: numer, treść pytania, odpowiedzi A, B, C, D. W PDF poprawna jest odpowiedź A; w aplikacji kolejność odpowiedzi jest mieszana.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pdf-file">Wybierz plik PDF</Label>
            <Input
              id="pdf-file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          {file && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                Rozmiar: {(file.size / 1024).toFixed(2)} KB
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
            onClick={handleUpload} 
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? 'Importowanie...' : 'Importuj pytania'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
