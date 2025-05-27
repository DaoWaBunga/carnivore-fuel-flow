
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PostCard } from "./PostCard";
import { CommunityFeedHeader } from "./CommunityFeedHeader";
import { CommunityFeedLoading } from "./CommunityFeedLoading";
import { CommunityFeedEmpty } from "./CommunityFeedEmpty";
import { useCommunityFeed } from "@/hooks/useCommunityFeed";

export const CommunityFeed = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { toast } = useToast();
  const { 
    posts, 
    loading, 
    fetchPosts, 
    handleLikeToggle, 
    handlePostUpdate, 
    handlePostDelete 
  } = useCommunityFeed();

  const handlePostCreated = () => {
    fetchPosts();
    setIsCreatePostOpen(false);
    toast({
      title: "Post created successfully! 🎉",
      description: "Your post has been shared with the community"
    });
  };

  if (loading) {
    return <CommunityFeedLoading />;
  }

  return (
    <div className="space-y-6">
      <CommunityFeedHeader
        isCreatePostOpen={isCreatePostOpen}
        setIsCreatePostOpen={setIsCreatePostOpen}
        onPostCreated={handlePostCreated}
      />

      {posts.length === 0 ? (
        <CommunityFeedEmpty onCreatePost={() => setIsCreatePostOpen(true)} />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLikeToggle={handleLikeToggle}
              onPostUpdate={handlePostUpdate}
              onPostDelete={handlePostDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
