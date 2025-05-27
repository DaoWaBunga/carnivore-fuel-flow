
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PostContentInput } from "./PostContentInput";
import { PostTypeSelector } from "./PostTypeSelector";
import { ImageUpload } from "./ImageUpload";
import { useImageUpload } from "@/hooks/useImageUpload";

interface PostEditFormProps {
  post: {
    id: string;
    content: string;
    post_type: string;
    image_url: string | null;
    meal_data: any;
  };
  onSave: (updatedPost: any) => void;
  onCancel: () => void;
}

export const PostEditForm = ({ post, onSave, onCancel }: PostEditFormProps) => {
  const [content, setContent] = useState(post.content);
  const [postType, setPostType] = useState(post.post_type);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post.image_url);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { uploadImage } = useImageUpload();

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your post",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      let imageUrl = post.image_url;
      
      // Upload new image if one was selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { data, error } = await (supabase as any)
        .from('community_posts')
        .update({
          content: content.trim(),
          post_type: postType,
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id)
        .select(`
          *,
          profiles!community_posts_user_id_fkey (
            display_name,
            first_name,
            last_name
          )
        `)
        .single();

      if (error) throw error;

      onSave(data);
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error updating post",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <h3 className="text-lg font-semibold">Edit Post</h3>
      </CardHeader>
      <CardContent className="space-y-4">
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
            onClick={onCancel}
            variant="outline"
            disabled={saving}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
