import type { Project } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectDetailsProps = {
  project: Project;
};

export function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Created at: {project.createdAt.toLocaleString()}</p>
        <p>Updated at: {project.updatedAt?.toLocaleString()}</p>
        {/* Add more project details here as needed */}
      </CardContent>
    </Card>
  );
}
