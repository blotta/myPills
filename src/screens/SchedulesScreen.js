import { useNavigation } from "@react-navigation/native";
import { ScrollView, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Loading from "../components/Loading";
import useMoment from "../hooks/useMoment";
import useSchedules from "../hooks/useSchedules";

export default function SchedulesScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { moment } = useMoment();

  const { schedules, loading, error } = useSchedules(
    "_sort=createdAt&_order=desc"
  );

  if (loading) {
    return <Loading />;
  }

  // console.log(JSON.stringify(theme, null, 2));

  return (
    <ScrollView>
      {schedules &&
        schedules.map((schedule) => (
          <View
            key={schedule.id}
            style={{
              borderWidth: 1,
              borderRadius: 5,
              borderColor: "gray",
              marginVertical: 10,
              padding: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                variant="headlineSmall"
                style={{ color: theme.colors.primary }}
              >
                {schedule.med.name}
              </Text>
              <Text>
                {schedule.med.containerType}{" "}
                {[schedule.med.containerAmount, schedule.med.unitAmount]
                  .filter((x) => x != null)
                  .join(" ")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text variant="titleSmall">
                Criado {moment().to(moment(schedule.createdAt))}
              </Text>

              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    color: schedule.active ? "green" : theme.colors.error,
                  }}
                >
                  {schedule.active ? "Ativo" : "Desativado"}
                </Text>

                <Text>{" | "}</Text>

                <Text
                  style={{
                    color: schedule.med.discarded
                      ? "green"
                      : theme.colors.error,
                  }}
                >
                  {schedule.med.discarded ? "Descartado" : "Não descartado"}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text variant="titleSmall">
                Expira {moment().to(moment(schedule.medExpireDate))}
              </Text>
              <Button compact={true} onPress={() => navigation.navigate("ScheduleDetails", {scheduleId: schedule.id})}>Detalhes</Button>
            </View>
          </View>
        ))}
    </ScrollView>
  );
}
