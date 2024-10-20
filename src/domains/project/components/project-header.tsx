"use client";

import { useState } from "react";
import { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateProjectFormDialog } from "@/domains/project/components/update-project-form-dialog";
import { DeleteProjectDialog } from "@/domains/project/components/delete-project-dialog";

type ProjectHeaderProps = {
  project: Project;
};

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 bg-background border-b">
      <h1 className="text-2xl font-semibold">{project.name}</h1>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add List
        </Button>
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
      </div>
      <UpdateProjectFormDialog
        project={project}
        isOpen={isUpdateFormVisible}
        onClose={() => setIsUpdateFormVisible(false)}
      />
      <DeleteProjectDialog
        project={project}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
