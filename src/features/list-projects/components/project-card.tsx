import type { Project } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card key={project.id} className="w-full">
      <CardContent className="p-6">
        <h3 className="font-semibold mb-2">{project.name}</h3>
        <p className="text-sm text-gray-500">
          Created: {new Date(project.createdAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          Updated:{" "}
          {project.updatedAt
            ? new Date(project.updatedAt).toLocaleString()
            : "N/A"}
        </p>
      </CardContent>
    </Card>
  );
}
