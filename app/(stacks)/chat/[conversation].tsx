import { Redirect, Stack, router, useLocalSearchParams } from "expo-router";
import { Animated, Easing, FlatList, InputAccessoryView, Platform, TextInput, TouchableOpacity } from "react-native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";

import Thumbnail from "../../../components/ui/Thumbnail";
import { useCreateMessage, useMessage } from "../../../components/hooks/use-messages";
import { useAuth } from "../../../components/providers/AuthProvider";
import { Database, Tables } from "../../../utils/types/database.types";
import { useMatch } from "../../../components/hooks/use-matches";
import { supabase } from "../../../utils/initSupabase";
import { View, Text, Icon, Button } from "../../../components/ui";
import { Image } from "react-native";
import { Screen } from "../../../components/ui";

type Message = Tables<"message">;
type Match = Database["public"]["Functions"]["get_user_matches"]["Returns"][0];

function MessageHeader({ match }: { match?: Match }) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Thumbnail url={match ? match.member_avatar : ""} size={30} />
      <Text
        style={{
          marginLeft: 10,
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {match ? match.username : "Loading..."}
      </Text>
    </View>
  );
}

function MessageBubbleMe({ text }: { text: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        paddingRight: 12,
      }}
    >
      <View style={{ flex: 1 }} />
      <View
        variant="muted"
        style={{
          borderRadius: 21,
          maxWidth: "75%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          marginRight: 8,
          minHeight: 42,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            lineHeight: 18,
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

function MessageBubbleFriend({ text = "", avatar, typing = false }: { text?: string; avatar: string; typing?: boolean }) {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        paddingLeft: 16,
      }}
    >
      <Thumbnail url={avatar} size={42} download={false} />
      <View
        variant="primary"
        style={{
          borderRadius: 21,
          maxWidth: "75%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          marginLeft: 8,
          minHeight: 42,
        }}
      >
        <Text
          variant="primary"
          style={{
            fontSize: 16,
            lineHeight: 18,
          }}
        >
          {text}
        </Text>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}

interface MessageInputProps {
  message: string;
  setMessage: (value: string) => void;
  onSend: () => void;
}

function MessageInput({ message, setMessage, onSend }: MessageInputProps) {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextInput
        placeholder="Message..."
        placeholderTextColor="#909090"
        value={message}
        onChangeText={setMessage}
        style={{
          flex: 1,
          paddingHorizontal: 18,
          borderWidth: 1,
          borderRadius: 25,
          borderColor: "#d0d0d0",
          backgroundColor: "white",
          height: 50,
        }}
      />
      <TouchableOpacity onPress={onSend}>
        <Icon
          name="paper-plane-outline"
          size={22}
          style={{
            marginHorizontal: 12,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function MessagesScreen() {
  const messagesRef = useRef<FlatList<Message>>(null);
  const [message, setMessage] = useState("");
  const { conversation } = useLocalSearchParams();
  const { data: messagesList } = useMessage(conversation as string);

  const { mutate: messageSend } = useCreateMessage();
  const [avatarUrl, setAvatarUrl] = useState("");
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const { data: match } = useMatch(session?.user.id);

  const currentMatch = match?.find((m) => m.id === conversation);
  // Update the header
  if (!currentMatch) return;

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from("avatars").download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }
  useEffect(() => {
    console.log(currentMatch, "currentMatch");
    if (currentMatch.member_avatar) {
      downloadImage(currentMatch.member_avatar);
    }
  }, [currentMatch]);
  useEffect(() => {
    const subscription = supabase
      .channel(`message`)
      .on("postgres_changes", { event: "*", schema: "public", table: "message", filter: `match_id=eq.${currentMatch.id}` }, (payload) => {
        // TODO: add new user to cache if their profile doesn't exisT

        if (payload.eventType === "INSERT") {
          const newMessage = payload.new as Message;
          const snapshot = queryClient.getQueryData(["message", currentMatch.id]);

          queryClient.setQueryData(["message", currentMatch.id], (old: Message[]) => {
            return [...old, newMessage];
          });
          queryClient.invalidateQueries({ queryKey: ["message", newMessage.match_id] });
          if (messagesRef.current) {
            messagesRef.current.scrollToEnd({ animated: true });
          }
        } else {
          queryClient.invalidateQueries({ queryKey: ["message", currentMatch.id] });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onSend = () => {
    if (!session) return;
    const cleaned = message.replace(/\s+/g, " ").trim();
    if (cleaned.length === 0) return;
    messageSend({ match_id: conversation as string, content: cleaned, member_id: session.user.id });
    setMessage("");
  };

  function onType(value: string) {
    setMessage(value);
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => (
            <Button
              icon
              onPress={() => {
                // Navigate back to the home screen
                router.push("/(tabs)/chat");
              }}
            >
              <Icon name="arrow-back" size={24} />
            </Button>
          ),
          headerTitle: () => <MessageHeader match={currentMatch} />,
        }}
      />
      <View
        style={{
          flex: 1,
          marginBottom: Platform.OS === "ios" ? 60 : 0,
        }}
      >
        <FlatList
          ref={messagesRef}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{
            paddingTop: 30,
          }}
          data={messagesList}
          inverted={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) =>
            item.member_id === session?.user.id ? (
              <MessageBubbleMe text={item.content} />
            ) : item.member_id === currentMatch.member_id && !item.visible_to ? (
              <MessageBubbleFriend text={item.content} avatar={avatarUrl} />
            ) : item.visible_to === session?.user.id || !item.visible_to ? (
              <MessageBubbleAI text={item.content} />
            ) : null
          }
        />
      </View>

      {Platform.OS === "ios" ? (
        <InputAccessoryView>
          <MessageInput message={message} setMessage={onType} onSend={onSend} />
        </InputAccessoryView>
      ) : (
        <MessageInput message={message} setMessage={onType} onSend={onSend} />
      )}
    </View>
  );
}

function MessageBubbleAI({ text = "", typing = false }: { text?: string; typing?: boolean }) {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        paddingLeft: 16,
      }}
    >
      <Image
        source={require("../../../assets/images/icon.png")}
        style={{
          height: 42,
          width: 42,
          objectFit: "cover",
          paddingTop: 0,
          borderRadius: 100,
          overflow: "hidden",
        }}
      />
      <View
        style={{
          backgroundColor: "#d0d2db",
          borderRadius: 21,
          maxWidth: "75%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          marginLeft: 8,
          minHeight: 42,
        }}
      >
        <Text
          style={{
            color: "#202020",
            fontSize: 16,
            lineHeight: 18,
          }}
        >
          {text}
        </Text>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}
// function MessageTypingAnimation({offset }:{offset:  number}) {
//   const y = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const total = 1000;
//     const bump = 200;

//     const animation = Animated.loop(
//       Animated.sequence([
//         Animated.delay(bump * offset),
//         Animated.timing(y, {
//           toValue: 1,
//           duration: bump,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//         Animated.timing(y, {
//           toValue: 0,
//           duration: bump,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//         Animated.delay(total - bump * 2 - bump * offset),
//       ])
//     );
//     animation.start();
//     return () => {
//       animation.stop();
//     };
//   }, []);

//   const translateY = y.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -8],
//   });

//   return (
//     <Animated.View
//       style={{
//         width: 8,
//         height: 8,
//         marginHorizontal: 1.5,
//         borderRadius: 4,
//         backgroundColor: "#606060",
//         transform: [{ translateY }],
//       }}
//     />
//   );
// }
