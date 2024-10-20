import { notFound } from "next/navigation";
import { getProjectAction } from "@/app/dashboard/projects/actions/get-project-action";
import { ProjectBoard } from "@/domains/project/components/project-board";
import { ProjectHeader } from "@/domains/project/components/project-header";

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await getProjectAction({ projectId: params.projectId });

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
      <ProjectHeader project={project} />
      <ProjectBoard />
    </div>
  );
}
