
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostEditForm } from "./PostEditForm";
import { PostCardHeader } from "./PostCardHeader";
import { PostCardContent } from "./PostCardContent";
import { PostCardActions } from "./PostCardActions";
import { PostCardDeleteDialog } from "./PostCardDeleteDialog";
import { useAuth } from "@/contexts/AuthContext";

interface PostCardProps {
  post: {
    id: string;
    user_id: string;
    content: string;
    image_url: string | null;
    post_type: string;
    meal_data: any;
    like_count: number;
    created_at: string;
    profiles: {
      display_name: string | null;
      first_name: string | null;
      last_name: string | null;
    } | null;
    user_liked: boolean;
  };
  onLikeToggle: (postId: string, currentlyLiked: boolean) => void;
  onPostUpdate?: (updatedPost: any) => void;
  onPostDelete?: (postId: string) => void;
}

export const PostCard = ({ post, onLikeToggle, onPostUpdate, onPostDelete }: PostCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useAuth();

  const isOwnPost = user?.id === post.user_id;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onPostDelete?.(post.id);
    setShowDeleteDialog(false);
  };

  const handleEditComplete = (updatedPost: any) => {
    onPostUpdate?.(updatedPost);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <PostEditForm
        post={post}
        onSave={handleEditComplete}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="pb-3">
          <PostCardHeader
            post={post}
            isOwnPost={isOwnPost}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardHeader>
        
        <CardContent>
          <PostCardContent post={post} />
          <PostCardActions post={post} onLikeToggle={onLikeToggle} />
        </CardContent>
      </Card>

      <PostCardDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={confirmDelete}
      />
    </>
  );
};
