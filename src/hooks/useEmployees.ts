import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Employee } from "../types";
import { api } from "./apiConfig";

const queryEmployees = (): Promise<Employee[]> => {
  return api.get("v1/employee").then((response) => response.data);
};

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: queryEmployees,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
}

const createEmployee = async ({ employeeData }: { employeeData: Employee }) => {
  if (employeeData.employeesId) {
    return api.put(`v1/employee`, employeeData);
  }
  return api.post(`v1/employee`, employeeData);
};

export function useSaveEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
