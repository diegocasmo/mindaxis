import type { List } from "@prisma/client";
import type { ProjectWithLists } from "@/types";
import { ProjectList } from "./project-list";

type ProjectBoardProps = {
  project: ProjectWithLists;
};

export function ProjectBoard({ project }: ProjectBoardProps) {
  return (
    <div className="flex-1 overflow-x-auto p-4 bg-muted/40">
      <div className="flex space-x-4 min-h-full">
        {project.lists.length > 0 ? (
          project.lists.map((list: List) => (
            <ProjectList key={list.id} list={list} />
          ))
        ) : (
          <div className="bg-background rounded-lg shadow-sm p-4 w-80 flex-shrink-0 flex items-center justify-center text-muted-foreground">
            Future lists will appear here
          </div>
        )}
      </div>
    </div>
  );
}
