import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import { Tables } from "../utils/types/database.types";
import { supabase } from "../utils/initSupabase";
import { useAuth } from "./providers/AuthProvider";
import Colors from "../constants/colors";
import { Text } from "./ui/Text";

type ProfileCacheType = Record<string, Tables<"profiles">>;

const Message = ({
  message,
  profile,
  setProfileCache,
}: {
  profile: Tables<"profiles">;
  message: Tables<"message">;
  setProfileCache: Dispatch<SetStateAction<ProfileCacheType>>;
}) => {
  const { session } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.from("profiles").select("*").match({ id: message.member_id }).single();

      if (data) {
        setProfileCache((current) => ({
          ...current,
          [data.id]: data,
        }));
      }
    };
    if (!profile) {
      fetchProfile();
    }
  }, [profile, message.member_id]);

  return (
    <View key={message.id} style={message.member_id === session?.user.id ? styles.self : styles.another}>
      <Text variant="secondary">{profile?.username ?? "Loading..."}</Text>
      <Text variant="secondary">{message.content}</Text>
    </View>
  );
};

interface MessagesProps {
  conversationId: string;
  profileCache: ProfileCacheType;
  setProfileCache: Dispatch<SetStateAction<ProfileCacheType>>;
}

export default function Messages({ conversationId, profileCache, setProfileCache }: MessagesProps) {
  const [messages, setMessages] = useState<Tables<"message">[]>([]);
  const messagesRef = useRef<ScrollView>(null);

  const getData = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*, profile: profiles(id, username)")
      .match({ conversationId: conversationId })
      .order("created_at");

    if (!data) {
      alert("no data");
      return;
    }

    const newProfiles = Object.fromEntries(
      data
        .map((message) => message.profile)
        .filter(Boolean) // is truthy
        .map((profile) => [profile!.id, profile!])
    );

    setProfileCache((current) => ({
      ...current,
      ...newProfiles,
    }));

    setMessages(data);

    if (messagesRef.current) {
      messagesRef.current.scrollTo();
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("conversation")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        // TODO: add new user to cache if their profile doesn't exist
        const newMessage = payload.new as Tables<"message">;
        setMessages((current) => [...current, newMessage]);
        if (messagesRef.current) {
          messagesRef.current.scrollToEnd();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <ScrollView style={styles.container} ref={messagesRef}>
      <View style={styles.innerContainer}>
        {messages.map((message) => (
          <Message key={message.id} message={message} profile={profileCache[message.member_id]} setProfileCache={setProfileCache} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  self: {
    alignSelf: "flex-end",
    borderRadius: 10,
    padding: 10,
  },
  another: {
    alignSelf: "flex-start",
    borderRadius: 10,
    padding: 10,
  },
  container: {
    flex: 1,
    overflowY: "scroll",
  },
  innerContainer: {
    justifyContent: "flex-end",
    gap: 2,
    padding: 4,
  },
});
