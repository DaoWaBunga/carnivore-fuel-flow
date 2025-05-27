
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Utensils, MoreVertical, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PostEditForm } from "./PostEditForm";
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
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const { user } = useAuth();

  const isOwnPost = user?.id === post.user_id;

  const getDisplayName = () => {
    if (post.profiles?.display_name) {
      return post.profiles.display_name;
    }
    if (post.profiles?.first_name || post.profiles?.last_name) {
      return `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim();
    }
    return 'Anonymous User';
  };

  const getPostTypeIcon = () => {
    switch (post.post_type) {
      case 'meal':
        return <Utensils className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const formatMealData = () => {
    if (!post.meal_data) return null;
    
    return (
      <div className="mt-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
        <div className="flex items-center gap-2 mb-2">
          <Utensils className="h-4 w-4 text-orange-600" />
          <span className="font-medium text-orange-800">Meal Details</span>
        </div>
        <div className="text-sm text-orange-700 space-y-1">
          {post.meal_data.food_name && (
            <p><strong>Food:</strong> {post.meal_data.food_name}</p>
          )}
          {post.meal_data.quantity && post.meal_data.unit && (
            <p><strong>Quantity:</strong> {post.meal_data.quantity} {post.meal_data.unit}</p>
          )}
          {post.meal_data.calories && (
            <p><strong>Calories:</strong> {post.meal_data.calories}</p>
          )}
          {(post.meal_data.protein || post.meal_data.fat || post.meal_data.carbs) && (
            <div className="flex gap-4 mt-2">
              {post.meal_data.protein && <span>Protein: {post.meal_data.protein}g</span>}
              {post.meal_data.fat && <span>Fat: {post.meal_data.fat}g</span>}
              {post.meal_data.carbs && <span>Carbs: {post.meal_data.carbs}g</span>}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptionsMenu(false);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
    setShowOptionsMenu(false);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold text-lg">
                  {getDisplayName().charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{getDisplayName()}</p>
                  {getPostTypeIcon()}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
            
            {isOwnPost && (
              <Popover open={showOptionsMenu} onOpenChange={setShowOptionsMenu}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-1 bg-white border shadow-lg">
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      onClick={handleEdit}
                      className="flex items-center gap-2 justify-start px-3 py-2 h-auto"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Post
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleDelete}
                      className="flex items-center gap-2 justify-start px-3 py-2 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Post
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">{post.content}</p>
          
          {post.image_url && (
            <div className="mb-3">
              <img
                src={post.image_url}
                alt="Post image"
                className="w-full h-auto max-h-96 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          )}
          
          {formatMealData()}
          
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
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
