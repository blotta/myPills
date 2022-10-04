import { ScrollView, View } from "react-native";
import React, { useMemo } from "react";
import {
  Button,
  Chip,
  Divider,
  Text,
  ThemeProvider,
  useTheme,
} from "react-native-paper";
import MedDetails from "../components/MedDetails";
import useSchedule from "../hooks/useSchedule";
import Loading from "../components/Loading";
import useMoment from "../hooks/useMoment";
import useScheduleService from "../hooks/useScheduleService";
import { useNavigation } from "@react-navigation/native";

export default function ScheduleDetailsScreen({ route }) {
  const { scheduleId } = route.params;
  const navigation = useNavigation();
  const theme = useTheme();
  const { schedule, loading, error, refresh, remove } = useSchedule(scheduleId);
  const { planString, toggleTaken } = useScheduleService();

  const { moment, calendarDayOnlyFormats } = useMoment();

  const groupedSchedules = useMemo(() => {
    if (!schedule) {
      return [];
    }
    const gs = schedule.events.reduce((acc, item) => {
      const date = moment(item.date).startOf("day");
      const dateFmt = date.format("yyyy-MM-DD");
      if (!(dateFmt in acc)) {
        acc[dateFmt] = [];
      }
      acc[dateFmt].push(item);
      return acc;
    }, {});

    const ret = [];
    const keys = Object.keys(gs).sort();
    for (let key of keys) {
      const e = {
        day: key,
        times: [...gs[key].sort((a, b) => a.date > b.date)],
      };
      ret.push(e);
    }
    return ret;
  }, [schedule]);

  if (loading || !schedule) {
    return <Loading />;
  }

  const handleToggleEvent = async (eventId) => {
    await toggleTaken(schedule.id, eventId);
    refresh();
  };

  const handleDeleteSchedule = async () => {
    await remove();
    navigation.navigate("Home");
  }

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <MedDetails medId={schedule.med.id} />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
          Validade
        </Text>
        <Text variant="titleMedium">
          {moment(schedule.medExpireDate).format("ll")} (
          {moment().to(moment(schedule.medExpireDate), true)})
        </Text>
      </View>

      <Divider style={{ marginVertical: 15 }} />

      <Text
        variant="headlineSmall"
        style={{
          color: theme.colors.primary,
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        Meu Uso
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
          Quantidade
        </Text>
        <Text variant="titleMedium">
          {schedule.medCount} / {schedule.med.containerCount}
        </Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
          Posologia
        </Text>
        <Text variant="titleMedium">{planString(schedule.plan)}</Text>
      </View>

      <Divider style={{ marginVertical: 15 }} />

      <Text
        variant="headlineSmall"
        style={{
          color: theme.colors.primary,
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        Agenda
      </Text>

      {groupedSchedules.map((sch) => (
        <View key={sch.day}>
          <Text variant="titleLarge" style={{ marginTop: 10 }}>
            {moment(sch.day, "yyyy-MM-DD").calendar(
              null,
              calendarDayOnlyFormats
            )}
          </Text>
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              {sch.times.map((event) => (
                <Chip
                  key={event.id}
                  elevated={true}
                  icon={event.taken ? "check" : ""}
                  style={{ margin: 5 }}
                  onPress={() => handleToggleEvent(event.id)}
                >
                  {moment(event.date).format("HH:mm")}
                </Chip>
              ))}
            </View>
          </View>
        </View>
      ))}

      <Button
        mode="elevated"
        buttonColor={theme.colors.error}
        textColor={theme.colors.onError}
        uppercase
        elevation={5}
        style={{ marginTop: 50, marginBottom: 20 }}
        onPress={handleDeleteSchedule}
      >
        Deletar
      </Button>
    </ScrollView>
  );
}
