import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Attachment } from "../types";
import { api } from "./apiConfig";

const queryAttachments = (): Promise<Attachment[]> => {
  return api.get("v1/attachments").then((response) => response.data);
};

export function useAttachments() {
  return useQuery({
    queryKey: ["attachments"],
    queryFn: queryAttachments,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
}

const createAttachment = async ({
  attachmentData,
}: {
  attachmentData: Attachment;
}) => {
  if (attachmentData.attachmentsId) {
    return api.put(`v1/attachment`, attachmentData);
  }
  return api.post(`v1/attachment`, attachmentData);
};

export function useSaveAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
    },
  });
}
