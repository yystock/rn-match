import { supabase } from "../../utils/initSupabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tables } from "../../utils/types/database.types";

export type Profile = Tables<"profiles">;
type PartialProfile = Partial<Profile>;

export const useProfile = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
      return data as Profile;
      // if (error) throw new Error(error.message);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: PartialProfile) => {
      const { id, ...rest } = profile;
      if (!id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .update({ ...rest })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return data as Profile;
    },
    onMutate: async (newProfile) => {
      // Cancel any outgoing refetches

      await queryClient.cancelQueries({ queryKey: ["profile", newProfile.id] });

      // Snapshot the previous value
      const snapshot = queryClient.getQueryData(["profile", newProfile.id]);

      queryClient.setQueryData(["profile", newProfile.id], (old: Profile) => {
        return { ...old, ...newProfile };
      });

      // Optimistically update to the new value

      // Return a context object with the snapshotted value
      return { snapshot };
    },
    onError: (err, newProfile, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back

      queryClient.setQueryData(["profile", newProfile.id], context?.snapshot);
    },
    onSettled: (data, error, newProfile, context) => {
      // Always refetch after error or success

      queryClient.invalidateQueries({ queryKey: ["profile", newProfile.id] });
      // queryClient.setQueryData(["profile", data.id], data);
    },
  });
};
