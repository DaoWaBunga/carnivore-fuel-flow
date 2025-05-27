
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImagePlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CreatePostProps {
  onPostCreated: () => void;
}

export const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<string>("general");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('community-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('community-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a post",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your post",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const { error } = await (supabase as any)
        .from('community_posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          post_type: postType,
          image_url: imageUrl,
          is_public: true
        });

      if (error) throw error;

      // Reset form
      setContent("");
      setPostType("general");
      setImageFile(null);
      setImagePreview(null);
      
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error creating post",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create a New Post</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="post-type">Post Type</Label>
          <Select value={postType} onValueChange={setPostType}>
            <SelectTrigger>
              <SelectValue placeholder="Select post type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="meal">Meal Share</SelectItem>
              <SelectItem value="progress">Progress Update</SelectItem>
              <SelectItem value="tip">Carnivore Tip</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Share something with the community..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <div className="text-sm text-gray-500 text-right">
            {content.length}/500
          </div>
        </div>

        <div className="space-y-2">
          <Label>Image (optional)</Label>
          <div className="flex items-center gap-4">
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <ImagePlus className="h-4 w-4" />
                <span className="text-sm">Add Image</span>
              </div>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </Label>
          </div>

          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={uploading || !content.trim()}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {uploading ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
    </>
  );
};
