
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardActionsProps {
  post: {
    id: string;
    like_count: number;
    user_liked: boolean;
  };
  onLikeToggle: (postId: string, currentlyLiked: boolean) => void;
}

export const PostCardActions = ({ post, onLikeToggle }: PostCardActionsProps) => {
  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onLikeToggle(post.id, post.user_liked)}
        className={cn(
          "flex items-center gap-2 hover:bg-red-50",
          post.user_liked ? "text-red-600" : "text-gray-600"
        )}
      >
        <Heart 
          className={cn(
            "h-4 w-4",
            post.user_liked && "fill-current"
          )} 
        />
        <span>{post.like_count}</span>
      </Button>
    </div>
  );
};
