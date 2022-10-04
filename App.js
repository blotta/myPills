import "react-native-gesture-handler";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Provider as PaperProvider,
  MD3DarkTheme as PaperDarkTheme,
} from "react-native-paper";

import HomeScreen from "./src/screens/HomeScreen.js";
import ExpiredMedsScreen from "./src/screens/ExpiredMedsScreen.js";
import CustomNavigationBar from "./src/components/CustomNavigationBar.js";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import DiscardInfoScreen from "./src/screens/DiscardInfoScreen.js";
import NewMedScreen from "./src/screens/NewMedScreen.js";
import NewScheduleScreen from "./src/screens/NewScheduleScreen.js";
import SchedulesScreen from "./src/screens/SchedulesScreen.js";
import ScheduleDetailsScreen from "./src/screens/ScheduleDetailsScreen.js";

const theme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: "#EEFF2E",
    // secondary: 'blue'
  },
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              header: (props) => <CustomNavigationBar {...props} />,
            }}
          >
            <Stack.Screen name="Home" options={{title: "Resumo"}} component={HomeScreen} />
            <Stack.Screen name="ExpiredMeds" options={{title: "Medicamentos Vencidos"}} component={ExpiredMedsScreen} />
            <Stack.Screen name="DiscardInfo" options={{title: "Descarte"}} component={DiscardInfoScreen} />
            <Stack.Screen name="NewMed" options={{title: "Novo Medicamento"}} component={NewMedScreen} />
            <Stack.Screen name="NewSchedule" options={{title: "Novo Agendamento"}} component={NewScheduleScreen} />
            <Stack.Screen name="Schedules" options={{title: "Meus Medicamentos"}} component={SchedulesScreen} />
            <Stack.Screen name="ScheduleDetails" options={{title: "Delhes do Medicamento"}} component={ScheduleDetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}
