import { FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import { View } from "../../../components/ui/View";
import { useAuth } from "../../../components/providers/AuthProvider";
import Push from "../../../components/Push";
import { useDeleteMatch, useMatch } from "../../../components/hooks/use-matches";
import MatchRow from "../../../components/MatchRow";
import { Text } from "../../../components/ui/Text";
import { Button, Screen } from "../../../components/ui";

export default function TabChatScreen() {
  const { session } = useAuth();
  const { mutate: removeMatch } = useDeleteMatch();
  const { data: matches, isFetching, isRefetching, isLoading, refetch } = useMatch(session?.user.id);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Screen variant="safe">
      <View>
        <FlatList
          style={{ minHeight: "100%" }}
          data={matches}
          renderItem={({ item }) => <MatchRow item={item} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 16, backgroundColor: "red" }} />}
          ListEmptyComponent={noMatch()}
          ListHeaderComponent={
            <View style={{ alignItems: "center", paddingVertical: 8, borderBottomWidth: 1 }}>
              <Text type="title">Match</Text>
            </View>
          }
          refreshing={isFetching || isLoading || isRefetching}
          onRefresh={handleRefresh}
        ></FlatList>
        <Button onPress={() => removeMatch({ id: matches![0].id, userId: session?.user.id })} title="remove" />
        <Push session={session} />
      </View>
    </Screen>
  );
}

const noMatch = () => {
  return (
    <View style={{ flex: 3, alignItems: "center", justifyContent: "center", height: 500 }}>
      <Text>You have not found any match yet.</Text>
      <Text>Press Heart to Start Match</Text>
      <Text>👇</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
