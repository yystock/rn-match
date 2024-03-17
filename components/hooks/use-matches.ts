import { supabase } from "../../utils/initSupabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Database, Tables } from "../../utils/types/database.types";

type Match = Database["public"]["Functions"]["get_user_matches"]["Returns"][0];
type PartialMatch = Pick<Tables<"match">, "id"> & { userId?: string | null };
type Profile = Tables<"profiles">;
export type currentMatch = Database["public"]["Functions"]["get_current_match"]["Returns"];

export const useMatch = (id: string | undefined) => {
  return useQuery({
    queryKey: ["match", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.rpc("get_user_matches");
      if (error) throw new Error(error.message);

      return data as Match[];
    },
  });
};

export const useDeleteMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (match: PartialMatch) => {
      if (!match.id) return null;
      const { data, error } = await supabase.rpc("unmatch", { match_id: match.id });
      console.log("deleting.. ", data, error);
      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: async (newMatch) => {
      // Cancel any outgoing refetches
      if (!newMatch.userId) return null;

      await queryClient.cancelQueries({ queryKey: ["match", newMatch.userId] });
      await queryClient.cancelQueries({ queryKey: ["profiles", newMatch.userId] });

      // Snapshot the previous value
      const snapshot = queryClient.getQueryData(["match", newMatch.userId]);

      queryClient.setQueryData(["match", newMatch.userId], (old: Match[]) => {
        return [...old.filter((p) => p.id !== newMatch.id)];
      });
      queryClient.setQueryData(["profile", newMatch.userId], (old: Profile) => {
        return { ...old, status: "free" };
      });

      // Optimistically update to the new value

      // Return a context object with the snapshotted value
      return { snapshot };
    },
    onError: (err, newMatch, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back

      queryClient.setQueryData(["match", newMatch.userId], context?.snapshot);
      queryClient.setQueryData(["profile", newMatch.userId], (old: Profile) => {
        return { ...old, status: "matched" };
      });
    },
    onSettled: (data, error, newMatch, context) => {
      // Always refetch after error or success

      queryClient.invalidateQueries({ queryKey: ["match", newMatch.userId] });
      queryClient.invalidateQueries({ queryKey: ["profile", newMatch.userId] });
      // queryClient.setQueryData(["match", data.id], data);
    },
  });
};

export const useFindMatch = (userId?: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["find_match", userId],
    queryFn: async () => {
      if (!userId) return null;
      // const { data, error } = await supabase.rpc("find_match");
      const { data, error } = await supabase.functions.invoke("find-new-match", { body: JSON.stringify({ id: userId }) });
      console.log("finding.. ", data, error);
      if (error) throw new Error(error.message);
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["match"] });
      }

      return data;
    },
    enabled: false,
  });
};
export const useGetCurrentMatch = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["get_current_match"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_current_match");

      if (error) throw new Error(error.message);
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["match"] });
      }

      return data as currentMatch;
    },
  });
};
