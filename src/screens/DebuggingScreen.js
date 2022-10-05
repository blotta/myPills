import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import useSchedules from "../hooks/useSchedules";

export default function DebuggingScreen() {
  const { schedules, loading, refresh } = useSchedules();

  const handleClearSchedules = async () => {
    await AsyncStorage.removeItem("@mypills:schedules");
    console.log('removido');
    refresh();
  };

  const handleClearMeds = async () => {
    await AsyncStorage.removeItem("@mypills:meds");
    console.log('removido');
    refresh();
  };

  const handleLogMeds = async () => {
    const value = await AsyncStorage.getItem("@mypills:meds");
    console.log(JSON.stringify(JSON.parse(value), null, 2));
  };

  const handleLogSchedules = async () => {
    const value = await AsyncStorage.getItem("@mypills:schedules");
    console.log(JSON.stringify(JSON.parse(value), null, 2));
  };

  return (
    <View>
      <Text>
        Schedules: {schedules && schedules.length} {!schedules && "null"}
      </Text>
      <Button onPress={handleClearSchedules}>Limpar Schedules</Button>
      <Button onPress={handleLogSchedules}>Logar Schedules</Button>

      <Button onPress={handleClearMeds}>Limpar Meds</Button>
      <Button onPress={handleLogMeds}>Logar Meds</Button>

      {schedules && schedules.map(schedule => (

        <View key={schedule.id} style={{margin: 10}}>
        {['id', 'createdAt', 'medExpireDate'].map(k => (
          <Text key={schedule.id+k}>{k}: {schedule[k]}</Text>
        ))}
        </View>
      ))}
    </View>
  );
}
