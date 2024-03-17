import { supabase } from "../../utils/initSupabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tables } from "../../utils/types/database.types";

export type Message = Tables<"message">;
type PartialMessage = Partial<Message> & { id: string };
type insertMessage = Pick<Message, "content" | "member_id" | "match_id">;

export const useMessage = (match_id: string | undefined) => {
  return useQuery({
    queryKey: ["message", match_id],
    queryFn: async () => {
      if (!match_id) return null;

      const { data, error } = await supabase.from("message").select("*").eq("match_id", match_id).order("created_at");

      return data as Message[];
      // if (error) throw new Error(error.message);
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: PartialMessage) => {
      const { id, ...rest } = message;

      const { data, error } = await supabase
        .from("message")
        .update({ ...rest })
        .eq("id", id)
        .select()
        .single();

      // if (error) throw new Error(error.message);

      return data as Message;
    },
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches

      await queryClient.cancelQueries({ queryKey: ["message", newMessage.match_id] });

      // Snapshot the previous value
      const snapshot = queryClient.getQueryData(["message", newMessage.match_id]);

      queryClient.setQueryData(["message", newMessage.match_id], (old: Message[]) => {
        const updated = old.find((m) => m.id === newMessage.id);
        return [...old.filter((m) => m.id !== newMessage.id), { ...updated, ...newMessage }];
      });

      // Optimistically update to the new value

      // Return a context object with the snapshotted value
      return { snapshot };
    },
    onError: (err, newMessage, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back

      queryClient.setQueryData(["message", newMessage.match_id], context?.snapshot);
    },
    onSettled: (data, error, newMessage, context) => {
      // Always refetch after error or success

      queryClient.invalidateQueries({ queryKey: ["message", newMessage.match_id] });
      // queryClient.setQueryData(["message", data.id], data);
    },
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMessage: insertMessage) => {
      const { data, error } = await supabase.functions.invoke("send-chat", { body: JSON.stringify(newMessage) });
      if (error) throw new Error(error.message);

      return data as Message;
    },
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches

      await queryClient.cancelQueries({ queryKey: ["message", newMessage.match_id] });

      // Snapshot the previous value
      const snapshot = queryClient.getQueryData(["message", newMessage.match_id]);

      queryClient.setQueryData(["message", newMessage.match_id], (old: Message[]) => {
        return [...old, { ...newMessage, id: "-1" }];
      });

      // Optimistically update to the new value

      // Return a context object with the snapshotted value
      return { snapshot };
    },
    onError: (err, newMessage, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back

      queryClient.setQueryData(["message", newMessage.match_id], context?.snapshot);
    },
    onSettled: (data, error, newMessage, context) => {
      // Always refetch after error or success

      queryClient.invalidateQueries({ queryKey: ["message", newMessage.match_id] });
      // queryClient.setQueryData(["message", data.id], data);
    },
  });
};
