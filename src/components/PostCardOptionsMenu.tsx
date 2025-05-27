
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PostCardOptionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const PostCardOptionsMenu = ({ onEdit, onDelete }: PostCardOptionsMenuProps) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handleEdit = () => {
    onEdit();
    setShowOptionsMenu(false);
  };

  const handleDelete = () => {
    onDelete();
    setShowOptionsMenu(false);
  };

  return (
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
  );
};
