
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";

export const CommunityFeedLoading = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-red-800 flex items-center gap-2">
          <Users className="h-6 w-6" />
          Community Feed
        </h2>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
