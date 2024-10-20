import { notFound } from "next/navigation";
import { getProjectAction } from "@/app/dashboard/projects/[projectId]/actions/get-project-action";
import { ProjectDetails } from "@/domains/project/components/project-details";

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
    <div>
      <h1 className="text-2xl font-semibold mb-6">Project: {project.name}</h1>
      <ProjectDetails project={project} />
    </div>
  );
}
