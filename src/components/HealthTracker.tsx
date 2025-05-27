
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Heart, Trash2, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseData, HealthNote } from "@/hooks/useSupabaseData";

export const HealthTracker = () => {
  const [healthNotes, setHealthNotes] = useState<HealthNote[]>([]);
  const [newNote, setNewNote] = useState({
    notes: "",
    mood: 5,
    energy: 5,
    sleep: 5,
    digestion: 5
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Partial<HealthNote>>({});
  
  const { toast } = useToast();
  const {
    loading,
    addHealthNote,
    getHealthNotes,
    deleteHealthNote
  } = useSupabaseData();

  // Load health notes on component mount
  useEffect(() => {
    const loadHealthNotes = async () => {
      try {
        const notes = await getHealthNotes();
        setHealthNotes(notes);
      } catch (error) {
        console.error('Error loading health notes:', error);
        toast({
          title: "Error Loading Notes",
          description: "Failed to load your health notes",
          variant: "destructive"
        });
      }
    };

    loadHealthNotes();
  }, [getHealthNotes, toast]);

  const handleAddNote = async () => {
    if (!newNote.notes.trim()) {
      toast({
        title: "Note Required",
        description: "Please enter a note",
        variant: "destructive"
      });
      return;
    }

    const result = await addHealthNote({
      notes: newNote.notes,
      mood: newNote.mood,
      energy: newNote.energy,
      sleep: newNote.sleep,
      digestion: newNote.digestion
    });

    if (result) {
      setHealthNotes(prev => [result, ...prev]);
      setNewNote({
        notes: "",
        mood: 5,
        energy: 5,
        sleep: 5,
        digestion: 5
      });
      
      toast({
        title: "Health Note Added! 📝",
        description: "Your health tracking has been saved"
      });
    }
  };

  const handleDeleteNote = async (id: string) => {
    const success = await deleteHealthNote(id);
    
    if (success) {
      setHealthNotes(prev => prev.filter(note => note.id !== id));
      toast({
        title: "Note Deleted",
        description: "Health note has been removed"
      });
    }
  };

  const startEditing = (note: HealthNote) => {
    setEditingId(note.id);
    setEditingNote({
      notes: note.notes,
      mood: note.mood,
      energy: note.energy,
      sleep: note.sleep,
      digestion: note.digestion
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingNote({});
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 3) return "text-red-600";
    if (rating <= 6) return "text-yellow-600";
    return "text-green-600";
  };

  const getRatingText = (rating: number) => {
    if (rating <= 2) return "Poor";
    if (rating <= 4) return "Below Average";
    if (rating <= 6) return "Average";
    if (rating <= 8) return "Good";
    return "Excellent";
  };

  return (
    <div className="space-y-6">
      {/* Add New Health Note */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Daily Health Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Health Metrics Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Mood: {newNote.mood}/10 - {getRatingText(newNote.mood)}</Label>
              <Slider
                value={[newNote.mood]}
                onValueChange={(value) => setNewNote({ ...newNote, mood: value[0] })}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Energy: {newNote.energy}/10 - {getRatingText(newNote.energy)}</Label>
              <Slider
                value={[newNote.energy]}
                onValueChange={(value) => setNewNote({ ...newNote, energy: value[0] })}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sleep Quality: {newNote.sleep}/10 - {getRatingText(newNote.sleep)}</Label>
              <Slider
                value={[newNote.sleep]}
                onValueChange={(value) => setNewNote({ ...newNote, sleep: value[0] })}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Digestion: {newNote.digestion}/10 - {getRatingText(newNote.digestion)}</Label>
              <Slider
                value={[newNote.digestion]}
                onValueChange={(value) => setNewNote({ ...newNote, digestion: value[0] })}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="healthNotes">Health Notes</Label>
            <Textarea
              id="healthNotes"
              placeholder="How are you feeling today? Any symptoms, improvements, or observations..."
              value={newNote.notes}
              onChange={(e) => setNewNote({ ...newNote, notes: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={handleAddNote}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <Heart className="h-4 w-4 mr-2" />
            Save Health Entry
          </Button>
        </CardContent>
      </Card>

      {/* Health Notes History */}
      {healthNotes.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-red-800">Health History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {healthNotes.map((note) => (
                <div key={note.id} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm text-gray-500">
                      {new Date(note.date).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(note)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {editingId === note.id ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editingNote.notes || ""}
                        onChange={(e) => setEditingNote({ ...editingNote, notes: e.target.value })}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditing}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-600">Mood:</span>
                          <span className={`ml-2 font-medium ${getRatingColor(note.mood || 5)}`}>
                            {note.mood}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Energy:</span>
                          <span className={`ml-2 font-medium ${getRatingColor(note.energy || 5)}`}>
                            {note.energy}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Sleep:</span>
                          <span className={`ml-2 font-medium ${getRatingColor(note.sleep || 5)}`}>
                            {note.sleep}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Digestion:</span>
                          <span className={`ml-2 font-medium ${getRatingColor(note.digestion || 5)}`}>
                            {note.digestion}/10
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-800">{note.notes}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
