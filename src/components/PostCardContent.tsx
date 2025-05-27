
import { MealDataDisplay } from "./MealDataDisplay";

interface PostCardContentProps {
  post: {
    content: string;
    image_url: string | null;
    meal_data: any;
  };
}

export const PostCardContent = ({ post }: PostCardContentProps) => {
  return (
    <div className="pt-0">
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
      
      <MealDataDisplay mealData={post.meal_data} />
    </div>
  );
};
