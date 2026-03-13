import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Equipment } from "../types";
import { api } from "./apiConfig";

const queryEquipments = (): Promise<Equipment[]> => {
  return api.get("v1/equipments").then((response) => response.data);
};

export function useEquipments() {
  return useQuery({
    queryKey: ["equipments"],
    queryFn: queryEquipments,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
}

const createEquipment = async ({
  equipmentData,
}: {
  equipmentData: Equipment;
}) => {
  if (equipmentData.equipmentsId) {
    return api.put(`v1/equipment`, equipmentData);
  }
  return api.post(`v1/equipment`, equipmentData);
};

export function useSaveEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    }
  });
}
