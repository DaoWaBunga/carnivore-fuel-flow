
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Users } from "lucide-react";
import { CreatePost } from "./CreatePost";

interface CommunityFeedHeaderProps {
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  onPostCreated: () => void;
}

export const CommunityFeedHeader = ({ 
  isCreatePostOpen, 
  setIsCreatePostOpen, 
  onPostCreated 
}: CommunityFeedHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-red-800 flex items-center gap-2">
        <Users className="h-6 w-6" />
        Community Feed
      </h2>
      
      <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
        <DialogTrigger asChild>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <CreatePost onPostCreated={onPostCreated} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
