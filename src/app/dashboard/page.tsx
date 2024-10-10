import { Suspense } from "react";
import { ProjectList } from "@/domains/projects/components/project-list";
import { listProjectsAction } from "@/app/actions/list-projects-action";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Your Projects</h1>
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectListContent />
      </Suspense>
    </div>
  );
}

async function ProjectListContent() {
  try {
    const initialProjects = await listProjectsAction({ page: 1, perPage: 20 });
    return <ProjectList initialProjects={initialProjects} />;
  } catch (error) {
    return (
      <p className="text-red-500">
        Error loading projects. Please try again later.
      </p>
    );
  }
}
