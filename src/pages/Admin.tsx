import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
      const formData = new FormData();
      formData.append('file', file);

      setProgress(30);

      const { data, error } = await supabase.functions.invoke('parse-pdf', {
        body: formData,
      });

      setProgress(100);

      if (error) throw error;

      setResult({ success: true, count: data.count });
      toast({
        title: "Sukces!",
        description: `Zaimportowano ${data.count} pytań do bazy danych.`,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      setResult({ success: false, count: 0 });
      toast({
        title: "Błąd importu",
        description: error.message,
        variant: "destructive",
      });
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
            PDF powinien zawierać pytania w formacie: numer, treść pytania, odpowiedzi A, B, C, D.
            Odpowiedź A jest zawsze prawidłowa.
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
