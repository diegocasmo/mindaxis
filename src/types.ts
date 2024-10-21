import type { Project, List } from "@prisma/client";

export type ProjectWithLists = Project & {
  lists: List[];
};
