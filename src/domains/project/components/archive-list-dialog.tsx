import { useState } from "react";
import { useRouter } from "next/navigation";
import type { List } from "@prisma/client";
import { archiveListAction } from "@/app/dashboard/projects/[projectId]/actions/archive-list-action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ArchiveListDialogProps = {
  list: List;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ArchiveListDialog({
  list,
  open,
  onOpenChange,
}: ArchiveListDialogProps) {
  const [isArchiving, setIsArchiving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      await archiveListAction({ input: { listId: list.id } });
      toast({
        title: "List archived",
        description: `${list.name} has been successfully archived.`,
      });
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error("List archiving error:", error);
      toast({
        title: "Error",
        description: "Failed to archive the list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive List</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive the list "{list.name}"? This action
            can be undone later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleArchive}
            disabled={isArchiving}
          >
            {isArchiving ? "Archiving..." : "Archive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
