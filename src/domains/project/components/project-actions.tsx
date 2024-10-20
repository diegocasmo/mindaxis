import { useState } from "react";
import type { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { UpdateProjectFormDialog } from "@/domains/project/components/update-project-form-dialog";
import { DeleteProjectDialog } from "@/domains/project/components/delete-project-dialog";

type ProjectActionsProps = {
  project: Project;
};

export function ProjectActions({ project }: ProjectActionsProps) {
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setIsUpdateFormVisible(true)}
          >
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isUpdateFormVisible ? (
        <UpdateProjectFormDialog
          project={project}
          onClose={() => setIsUpdateFormVisible(false)}
        />
      ) : null}
      {isDeleteDialogOpen ? (
        <DeleteProjectDialog
          project={project}
          redirectPath="/dashboard"
          onClose={() => setIsDeleteDialogOpen(false)}
        />
      ) : null}
    </>
  );
}
