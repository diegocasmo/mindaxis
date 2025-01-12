import type { List } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ProjectListProps = {
  list: List;
};

export function ProjectList({ list }: ProjectListProps) {
  return (
    <Card className="bg-background rounded-lg shadow-sm p-4 w-80 flex-shrink-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{list.name}</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
