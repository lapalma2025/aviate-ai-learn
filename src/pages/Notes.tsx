import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Search, Copy, Download, Upload, ExternalLink, Plane } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Note {
  id: string;
  title: string;
  content: string;
  link?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    link: "",
    tags: "",
  });
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('user_notes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_notes'
        },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let filtered = notes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(note =>
        note.tags?.split(',').map(t => t.trim()).includes(selectedTag)
      );
    }

    setFilteredNotes(filtered);
  }, [notes, searchTerm, selectedTag]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
      setFilteredNotes(data || []);
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Nie jesteś zalogowany");

      if (editingNote) {
        const { error } = await supabase
          .from('user_notes')
          .update({
            title: formData.title,
            content: formData.content,
            link: formData.link || null,
            tags: formData.tags || null,
          })
          .eq('id', editingNote.id);

        if (error) throw error;
        
        toast({
          title: "Sukces",
          description: "Notatka została zaktualizowana",
        });
      } else {
        const { error } = await supabase
          .from('user_notes')
          .insert({
            title: formData.title,
            content: formData.content,
            link: formData.link || null,
            tags: formData.tags || null,
            user_id: user.id,
          });

        if (error) throw error;
        
        toast({
          title: "Sukces",
          description: "Notatka została dodana",
        });
      }

      setFormData({ title: "", content: "", link: "", tags: "" });
      setEditingNote(null);
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sukces",
        description: "Notatka została usunięta",
      });
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      link: note.link || "",
      tags: note.tags || "",
    });
    setIsDialogOpen(true);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Skopiowano",
      description: "Link został skopiowany do schowka",
    });
  };

  const isLongContent = (text: string) => (text?.length || 0) > 280;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `notatki_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Eksportowano",
      description: "Notatki zostały wyeksportowane",
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedNotes = JSON.parse(event.target?.result as string);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Nie jesteś zalogowany");

        const notesToInsert = importedNotes.map((note: Note) => ({
          title: note.title,
          content: note.content,
          link: note.link || null,
          tags: note.tags || null,
          user_id: user.id,
        }));

        const { error } = await supabase
          .from('user_notes')
          .insert(notesToInsert);

        if (error) throw error;
        
        toast({
          title: "Zaimportowano",
          description: `Dodano ${notesToInsert.length} notatek`,
        });
      } catch (error: any) {
        toast({
          title: "Błąd importu",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const getAllTags = () => {
    const tagsSet = new Set<string>();
    notes.forEach(note => {
      if (note.tags) {
        note.tags.split(',').forEach(tag => tagsSet.add(tag.trim()));
      }
    });
    return Array.from(tagsSet);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Ładowanie notatek...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/20">
        <div className="flex items-center gap-3">
          <Plane className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Twoje notatki lotnicze ✈️</h1>
            <p className="text-muted-foreground">Organizuj swoją wiedzę o lotnictwie</p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj po tytule lub treści..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleExport} title="Eksportuj notatki">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" asChild title="Importuj notatki">
              <label className="cursor-pointer">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                />
              </label>
            </Button>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingNote(null);
            setFormData({ title: "", content: "", link: "", tags: "" });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nowa notatka
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNote ? "Edytuj notatkę" : "Nowa notatka"}</DialogTitle>
              <DialogDescription>
                {editingNote ? "Zaktualizuj" : "Dodaj"} swoją notatkę lotniczą
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Tytuł</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="np. Procedury VFR"
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Treść</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Twoja notatka..."
                  rows={6}
                  required
                />
              </div>
              <div>
                <Label htmlFor="link">Link (opcjonalny)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://..."
                  type="url"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tagi (oddzielone przecinkami)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="np. Air Law, Meteorology, Navigation"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Anuluj
                </Button>
                <Button type="submit">
                  {editingNote ? "Zapisz zmiany" : "Dodaj notatkę"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tags Filter */}
      {getAllTags().length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtruj po tagu:</span>
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            Wszystkie
          </Button>
          {getAllTags().map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            {notes.length === 0 ? (
              <>
                <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Brak notatek</p>
                <p className="text-sm">Dodaj swoją pierwszą notatkę lotniczą!</p>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Nie znaleziono notatek</p>
                <p className="text-sm">Spróbuj zmienić kryteria wyszukiwania</p>
              </>
            )}
          </div>
        </Card>
      ) : filteredNotes.length > 6 ? (
        <ScrollArea className="h-[calc(100vh-400px)] pr-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow rounded-2xl">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(note)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Usunąć notatkę?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tej operacji nie można cofnąć. Notatka zostanie trwale usunięta.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Anuluj</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(note.id)}>
                              Usuń
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <CardDescription className="text-xs">
                    {new Date(note.created_at).toLocaleDateString('pl-PL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className={`text-sm text-muted-foreground ${expandedIds.has(note.id) ? "" : "line-clamp-4"}`}>{note.content}</p>
                  {isLongContent(note.content) && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => toggleExpand(note.id)}
                    >
                      {expandedIds.has(note.id) ? "Zwiń" : "Rozwiń"}
                    </Button>
                  )}
                  
                  {note.link && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 flex-1"
                        asChild
                      >
                        <a href={note.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                          Otwórz link
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopyLink(note.link!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  {note.tags && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow rounded-2xl">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(note)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Usunąć notatkę?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tej operacji nie można cofnąć. Notatka zostanie trwale usunięta.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Anuluj</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(note.id)}>
                            Usuń
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardDescription className="text-xs">
                  {new Date(note.created_at).toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className={`text-sm text-muted-foreground ${expandedIds.has(note.id) ? "" : "line-clamp-4"}`}>{note.content}</p>
                {isLongContent(note.content) && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto"
                    onClick={() => toggleExpand(note.id)}
                  >
                    {expandedIds.has(note.id) ? "Zwiń" : "Rozwiń"}
                  </Button>
                )}
                
                {note.link && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 flex-1"
                      asChild
                    >
                      <a href={note.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                        Otwórz link
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopyLink(note.link!)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {note.tags && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.split(',').map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;