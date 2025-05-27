
import { Clock, Utensils } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PostCardOptionsMenu } from "./PostCardOptionsMenu";

interface PostCardHeaderProps {
  post: {
    created_at: string;
    post_type: string;
    profiles: {
      display_name: string | null;
      first_name: string | null;
      last_name: string | null;
    } | null;
  };
  isOwnPost: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const PostCardHeader = ({ post, isOwnPost, onEdit, onDelete }: PostCardHeaderProps) => {
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

  return (
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
        <PostCardOptionsMenu onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
};
