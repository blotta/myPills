import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import useSchedules from "../hooks/useSchedules";

export default function DebuggingScreen() {
  const { schedules, loading, refresh } = useSchedules();

  const handleClearSchedules = async () => {
    await AsyncStorage.removeItem("@mypills:schedules");
    refresh();
  };

  const handleLogSchedules = async () => {
    const value = await AsyncStorage.getItem("@mypills:schedules");
    console.log(JSON.parse(value));
  };

  return (
    <View>
      <Text>
        Schedules: {schedules && schedules.length} {!schedules && "null"}
      </Text>
      <Button onPress={handleClearSchedules}>Limpar Schedules</Button>
      <Button onPress={handleLogSchedules}>Logar Schedules</Button>

      {schedules && schedules.map(schedule => (

        <View>
          <Text>{schedule.id}</Text>
        </View>
      ))}
    </View>
  );
}
