
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PostTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PostTypeSelector = ({ value, onChange }: PostTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="post-type">Post Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select post type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="general">General</SelectItem>
          <SelectItem value="meal">Meal Share</SelectItem>
          <SelectItem value="progress">Progress Update</SelectItem>
          <SelectItem value="tip">Carnivore Tip</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
