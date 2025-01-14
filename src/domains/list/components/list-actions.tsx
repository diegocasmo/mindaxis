"use client";

import { useState } from "react";
import type { List } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ArchiveListDialog } from "@/domains/project/components/archive-list-dialog";

type ListActionsProps = {
  list: List;
};

export function ListActions({ list }: ListActionsProps) {
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setIsArchiveDialogOpen(true)}
          >
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ArchiveListDialog
        list={list}
        open={isArchiveDialogOpen}
        onOpenChange={setIsArchiveDialogOpen}
      />
    </>
  );
}
