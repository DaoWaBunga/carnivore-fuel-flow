
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CommunityPost {
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
}

export const useCommunityFeed = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const { data: postsData, error } = await (supabase as any)
        .from('community_posts')
        .select(`
          *,
          profiles!community_posts_user_id_fkey (
            display_name,
            first_name,
            last_name
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Check which posts the current user has liked
      if (user && postsData) {
        const postIds = postsData.map((post: any) => post.id);
        const { data: likesData } = await (supabase as any)
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);

        const likedPostIds = new Set(likesData?.map((like: any) => like.post_id) || []);

        const postsWithLikes = postsData.map((post: any) => ({
          ...post,
          user_liked: likedPostIds.has(post.id)
        }));

        setPosts(postsWithLikes);
      } else {
        setPosts(postsData?.map((post: any) => ({ ...post, user_liked: false })) || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error loading posts",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (postId: string, currentlyLiked: boolean) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to like posts",
        variant: "destructive"
      });
      return;
    }

    try {
      if (currentlyLiked) {
        // Unlike the post
        await (supabase as any)
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like the post
        await (supabase as any)
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
      }

      // Update the posts state
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              like_count: currentlyLiked ? post.like_count - 1 : post.like_count + 1,
              user_liked: !currentlyLiked
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return {
    posts,
    loading,
    fetchPosts,
    handleLikeToggle
  };
};
