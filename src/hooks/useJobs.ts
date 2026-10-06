import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Job } from "../types";
import { api } from "./apiConfig";

const queryJobs = (): Promise<Job[]> => {
  return api.get("v1/job").then((response) => response.data);
};

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: queryJobs,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
}

const createJob = async ({ jobData }: { jobData: Job }) => {
  if (jobData.jobsId) {
    return api.put(`v1/job`, jobData);
  }
  return api.post(`v1/job`, jobData);
};

export function useSavejob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}


const updateBatchJobStatus = async ({
  ids,
  status,
}: {
  ids: number[];
  status: Job["status"];
}) => {
  return api.patch("v1/job/batch-status", { ids, status });
};

// Custom Hook para TanStack Query
export function useUpdateBatchStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBatchJobStatus,
    onSuccess: () => {
      // Invalida la query ["jobs"] para que la tabla se recargue automáticamente
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}