import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { View } from "./ui";
import { Text } from "./ui/Text";
import Thumbnail from "./ui/Thumbnail";
import { Database } from "../utils/types/database.types";

type Match = Database["public"]["Functions"]["get_user_matches"]["Returns"][0];

interface MatchRowProps {
  item: Match;
}

export default function MatchRow({ item }: MatchRowProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/(stacks)/chat/[conversation]",
          params: { conversation: item.id },
        });
      }}
    >
      <View
        style={{
          paddingLeft: 18,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,

          height: 106,
        }}
      >
        <Thumbnail url={item.member_avatar} size={66} />
        <View
          style={{
            flex: 1,
            paddingHorizontal: 13,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 9 }}>
            <Text
              style={{
                fontWeight: "700",
              }}
            >
              {item.username}
            </Text>
            <Text variant="secondary" style={{ fontSize: 13, marginLeft: "auto" }}>
              {item.updated_at || "✨ New Match ✨ "}
            </Text>
          </View>

          <Text variant="secondary" lineBreakMode="tail" textBreakStrategy="balanced" numberOfLines={2}>
            {item.last_msg || "No Messages yet"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
