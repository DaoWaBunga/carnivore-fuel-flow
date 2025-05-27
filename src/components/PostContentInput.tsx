
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PostContentInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export const PostContentInput = ({ 
  value, 
  onChange, 
  maxLength = 500 
}: PostContentInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        placeholder="Share something with the community..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] resize-none"
        maxLength={maxLength}
      />
      <div className="text-sm text-gray-500 text-right">
        {value.length}/{maxLength}
      </div>
    </div>
  );
};
