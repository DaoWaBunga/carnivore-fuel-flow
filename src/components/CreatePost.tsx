
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { PostTypeSelector } from "./PostTypeSelector";
import { PostContentInput } from "./PostContentInput";
import { useImageUpload } from "@/hooks/useImageUpload";

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
  const { uploadImage } = useImageUpload();

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
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
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
        <PostTypeSelector value={postType} onChange={setPostType} />
        
        <PostContentInput value={content} onChange={setContent} />

        <ImageUpload
          imageFile={imageFile}
          imagePreview={imagePreview}
          onImageSelect={setImageFile}
          onImagePreviewChange={setImagePreview}
        />

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
