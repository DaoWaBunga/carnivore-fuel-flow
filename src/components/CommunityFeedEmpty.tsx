
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

interface CommunityFeedEmptyProps {
  onCreatePost: () => void;
}

export const CommunityFeedEmpty = ({ onCreatePost }: CommunityFeedEmptyProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardContent className="p-8 text-center">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No posts yet
        </h3>
        <p className="text-gray-500 mb-4">
          Be the first to share something with the community!
        </p>
        <Button 
          onClick={onCreatePost}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create First Post
        </Button>
      </CardContent>
    </Card>
  );
};
