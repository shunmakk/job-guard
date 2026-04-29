import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


export const HistorySkeleton = () => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-20" />
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex gap-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </CardContent>
  </Card>
);

export const DetailSkeleton = () => (
  <Card className="w-full">
    <CardHeader className="space-y-3">
      <Skeleton className="h-7 w-2/3" />
      <Skeleton className="h-4 w-1/4" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-28 w-full" />
    </CardContent>
  </Card>
);