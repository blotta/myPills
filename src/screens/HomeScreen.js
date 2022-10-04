import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Badge, Button, Card, Chip, Text } from "react-native-paper";
import Loading from "../components/Loading";
import useFetch from "../hooks/useFetch";
import useMeds from "../hooks/useMeds";
import useMoment from "../hooks/useMoment";
import useSchedules from "../hooks/useSchedules";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function HomeScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  const { moment, calendarDayOnlyFormats } = useMoment();

  // const { data: schedules, loading, error, resendFetch: fetchRefresh } = useFetch("/schedules");
  const { schedules, loading, error, refreshSchedules, refresh } =
    useSchedules();

  const expiredSchedules = useMemo(() => {
    if (!schedules) {
      return [];
    }
    return schedules.filter((s) =>
      moment(s.medExpireDate).isSameOrBefore(moment())
    );
  }, [schedules]);

  const expiredNotDiscardedSchedules = useMemo(() => {
    return expiredSchedules.filter((s) => !s.medDiscarded);
  }, [expiredSchedules]);

  const weekMeds = useMemo(() => {
    if (!schedules) {
      return 0;
    }
    const start = moment().startOf("week");
    const end = moment().endOf("week");
    let total = 0;
    let taken = 0;

    for (let sch of schedules) {
      const events = sch.events.filter((e) =>
        moment(e.date).isBetween(start, end)
      );
      total += events.length;
      taken += events.filter((e) => e.taken).length;
    }

    return (100 * taken) / total;
  }, [schedules]);

  const groupedDayEvents = useMemo(() => {
    if (!schedules) {
      return [];
    }
    let gs = {};
    const start = moment().startOf("week");
    const end = moment().endOf("week");

    for (let sch of schedules) {
      gs = sch.events.reduce((acc, item) => {
        const date = moment(item.date).startOf("day");
        if (!date.isBetween(start, end)) {
          return acc;
        }
        const dateFmt = date.format("yyyy-MM-DD");
        if (!(dateFmt in acc)) {
          acc[dateFmt] = [];
        }
        acc[dateFmt].push({ ...item, scheduleId: sch.id, name: sch.med.name });
        return acc;
      }, gs);
    }

    const ret = [];
    const keys = Object.keys(gs).sort();
    for (let key of keys) {
      const e = {
        day: key,
        items: [...gs[key].sort((a, b) => a.date > b.date)],
      };
      ret.push(e);
    }
    return ret;
  }, [schedules]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  if (loading || !schedules) {
    return <Loading />;
  }

  if (schedules.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="headlineMedium">Olá!</Text>
        <Text variant="headlineSmall">Não há medicamentos para análise</Text>
        <Button onPress={() => navigation.navigate("NewMed")}>
          Criar um novo plano de medicamento
        </Button>
        <Button onPress={() => navigation.navigate("DiscardInfo")}>
          Mais informações sobre a importância do descarte
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card mode="outlined">
        <Card.Content>
          <View style={styles.dashContainer}>
            <View style={styles.dashItem}>
              <Text variant="headlineSmall" style={{ textAlign: "center" }}>
                Descarte
              </Text>
              <Button
                compact={true}
                onPress={() => navigation.navigate("ExpiredMeds")}
              >
                Saiba mais
              </Button>
            </View>
            <View style={styles.dashItem}>
              {expiredSchedules.length === 0 && <Text style={{textAlign: 'center'}}>Não há medicamentos expirados</Text>}
              {expiredSchedules.length > 0 && (

              <Text style={styles.title}>
                {(
                  (100 *
                    expiredSchedules.filter((s) => s.medDiscarded).length) /
                  expiredSchedules.length
                ).toFixed(0)}{" "}
                %
              </Text>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={{marginTop: 20}} mode="outlined">
        <Card.Content>
          <View style={styles.dashContainer}>
            <View style={styles.dashItem}>
              <Text style={styles.title}>{weekMeds.toFixed(0)} %</Text>
            </View>
            <View style={styles.dashItem}>
              <Text variant="headlineSmall" style={{ textAlign: "center" }}>
                Medicamentos da Semana
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View>
        <Text
          variant="titleMedium"
          style={{
            marginTop: 15,
            textAlign: "center",
            textTransform: "uppercase",
            color: theme.colors.primary,
          }}
        >
          Agenda da Semana
        </Text>

        {groupedDayEvents.map((dayEvents) => (
          <View key={dayEvents.day}>
            <Text variant="titleLarge" style={{ marginTop: 10 }}>
              {moment(dayEvents.day).calendar(null, calendarDayOnlyFormats)}
            </Text>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                {dayEvents.items.map((item) => (
                  <Chip
                    key={item.id}
                    elevated={true}
                    style={{ margin: 5 }}
                    icon={item.taken ? "check" : ""}
                    onPress={() =>
                      navigation.navigate("ScheduleDetails", {
                        scheduleId: item.scheduleId,
                      })
                    }
                  >
                    {item.name} {moment(item.date).format("HH:mm")}
                  </Chip>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ marginVertical: 15 }}>
        <Text
          variant="titleMedium"
          style={{
            marginTop: 15,
            textAlign: "center",
            textTransform: "uppercase",
            color: theme.colors.primary,
          }}
        >
          Medicamentos Vencidos
        </Text>

        {expiredNotDiscardedSchedules.length == 0 && (
          <Text style={{ textAlign: "center" }}>
            Você não possui medicamentos vencidos a descartar
          </Text>
        )}

        {expiredNotDiscardedSchedules.length > 0 && (
          <Text style={{ textAlign: "center" }}>
            Veja detalhes de como descartar os seguintes medicamentos
            corretamente
          </Text>
        )}

        {expiredNotDiscardedSchedules.map((schedule) => (
          <View
            key={schedule.id}
            style={{
              flexDirection: "row",
              marginTop: 10,
              alignItems: "center",
            }}
          >
            <Text variant="titleLarge" style={{ flex: 1 }}>
              {schedule.med.name} -{" "}
              {moment().to(moment(schedule.medExpireDate))}
            </Text>
            <Button
              mode="elevated"
              onPress={() => navigation.navigate("ExpiredMeds")}
            >
              ?
            </Button>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: "column",
    flex: 1,
    padding: 10,
  },
  dashContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 10,
  },
  dashItem: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    textAlign: "center",
  },
});
