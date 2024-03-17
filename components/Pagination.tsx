import { StyleSheet, View } from "react-native";
import React from "react";
import { SharedValue } from "react-native-reanimated";
import { OnboardingType } from "../constants/onboarding";
import Dot from "./Dot";
import { Profile } from "./hooks/use-profiles";

type Props = {
  data: OnboardingType[] | Profile["profile_pic"];
  x: SharedValue<number>;
};
const Pagination = ({ data, x }: Props) => {
  return (
    <View style={styles.paginationContainer}>
      {data &&
        data.map((_, index) => {
          return <Dot index={index} x={x} key={index} />;
        })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
