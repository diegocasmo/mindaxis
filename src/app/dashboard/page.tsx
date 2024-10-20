import { Suspense } from "react";
import { ProjectList } from "@/domains/projects/components/project-list";
import { fetchProjectsAction } from "@/app/dashboard/actions/fetch-projects-action";

export default async function Dashboard() {
  const initialProjects = await fetchProjectsAction({ page: 1, perPage: 20 });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Your Projects</h1>
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectList initialProjects={initialProjects} />
      </Suspense>
    </div>
  );
}
