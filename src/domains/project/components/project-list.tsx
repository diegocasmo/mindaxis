import type { List } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ListActions } from "@/domains/list/components/list-actions";

type ProjectListProps = {
  list: List;
};

export function ProjectList({ list }: ProjectListProps) {
  return (
    <Card className="bg-background rounded-lg shadow-sm p-4 w-80 flex-shrink-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{list.name}</CardTitle>
        <ListActions list={list} />
      </CardHeader>
      <CardContent>{/* Add content for the list card here */}</CardContent>
    </Card>
  );
}
