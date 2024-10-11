import { useQueryClient } from "@tanstack/react-query";
import type { PaginatedResult } from "@/lib/utils/pagination";

type ResourceQueryData<T> = {
  pages: PaginatedResult<T>[];
  pageParams: number[];
};

type Operation = "upsert" | "delete";

export function useUpdateResourceCache<T extends { id: string | number }>(
  queryKey: string[]
) {
  const queryClient = useQueryClient();

  const updateResourceCache = (operation: Operation, resource: T): void => {
    queryClient.setQueryData<ResourceQueryData<T>>(queryKey, (oldData) =>
      oldData ? updatePages(oldData, operation, resource) : oldData
    );
  };

  return updateResourceCache;
}

const updatePages = <T extends { id: string | number }>(
  oldData: ResourceQueryData<T>,
  operation: Operation,
  resource: T
): ResourceQueryData<T> => ({
  ...oldData,
  pages: oldData.pages.map((page, pageIndex) =>
    updatePage(page, pageIndex, operation, resource)
  ),
});

const updatePage = <T extends { id: string | number }>(
  page: PaginatedResult<T>,
  pageIndex: number,
  operation: Operation,
  resource: T
): PaginatedResult<T> => {
  let newData: T[];
  let totalDelta = 0;

  if (operation === "upsert") {
    if (pageIndex === 0) {
      const existingIndex = page.data.findIndex(
        (item) => item.id === resource.id
      );
      if (existingIndex !== -1) {
        newData = [
          ...page.data.slice(0, existingIndex),
          resource,
          ...page.data.slice(existingIndex + 1),
        ];
      } else {
        newData = [resource, ...page.data];
        if (newData.length > page.metadata.perPage) {
          newData.pop();
        } else {
          totalDelta = 1;
        }
      }
    } else {
      newData = page.data.map((item) =>
        item.id === resource.id ? resource : item
      );
    }
  } else {
    // delete
    newData = page.data.filter((item) => item.id !== resource.id);
    if (pageIndex === 0 && newData.length < page.data.length) {
      totalDelta = -1;
    }
  }

  const newTotal = page.metadata.total + totalDelta;

  return {
    ...page,
    data: newData,
    metadata: {
      ...page.metadata,
      total: newTotal,
      totalPages: Math.ceil(newTotal / page.metadata.perPage),
    },
  };
};
