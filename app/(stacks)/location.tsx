import { View, Text, Button } from "../../components/ui";
import useLocationStore from "../../store/locationStore";
export default function Location() {
  const location = useLocationStore((state) => state.location);
  const getLocation = useLocationStore((state) => state.getLocation);
  return (
    <View>
      <Text>Your Current Location is:</Text>
      <Text>{location ? JSON.stringify(location) : "Location Not Found"}</Text>
      <Button onPress={() => getLocation()}>Refresh</Button>
    </View>
  );
}
