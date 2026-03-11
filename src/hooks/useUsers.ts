import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RegisterRequest, User, PasswordRequest } from "../types";
import { api } from "./apiConfig";

const queryUsers = (): Promise<User[]> => {
  return api.get("auth/users").then((response) => response.data);
};

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: queryUsers,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
}

const updateUser = async (userData: User) => {
  const { id, ...updateDto } = userData;
  if (!id) throw new Error("User Id not found.");

  const { data } = await api.put(`auth/update-user/${id}`, updateDto);
  return data;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("User data udpated.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error udpating user data";
      alert(message);
    },
  });
}

const registerUser = async (registerData: RegisterRequest) => {
  const { data } = await api.post(`auth/register`, registerData);
  return data;
};

export function useRegisterUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

const updatePassword = async (payload: PasswordRequest) => {
  const { data } = await api.put(`/admin/update-password`, payload);
  return data;
};

export function useUpdatePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
