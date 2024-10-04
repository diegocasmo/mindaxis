import { CreateProjectForm } from "@/components/create-project-form";

export default async function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Your Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CreateProjectForm />
      </div>
    </div>
  );
}
