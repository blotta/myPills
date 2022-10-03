import { View, ScrollView } from "react-native";
import React, { useMemo, useState } from "react";
import { Button, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import useFetch from "../hooks/useFetch";
import Loading from "../components/Loading";
import useMoment from "../hooks/useMoment";
import useScheduleService from "../hooks/useScheduleService";

const meds = [
  {
    id: 1,
    name: "Oceral",
    expiredFor: "2 dias",
    containerType: "Frasco",
    containerAmount: "20ml",
    discarded: false,
  },
  {
    id: 2,
    name: "NiQuitin",
    expiredFor: "1 semana",
    containerType: "Adesivo",
    unitAmount: "21mg",
    discarded: false,
  },
  {
    id: 3,
    name: "Tylenol",
    expiredFor: "3 meses",
    containerType: "Comprimido",
    unitAmount: "500mg",
    discarded: true,
  },
];

export default function ExpiredMedsScreen() {
  const {moment} = useMoment();

  const { data: schedules, loading, error, resendFetch: refresh } = useFetch('/schedules');
  const {updateSchedule} = useScheduleService();
  const navigation = useNavigation();
  const theme = useTheme();

  const expiredSchedules = useMemo(() => {
    if (!schedules) {
      return [];
    }
    return schedules.filter(s => moment(s.medExpireDate).isSameOrBefore(moment()));
  }, [schedules])

  const handleDiscardPress = async (scheduleId) => {
    const idx = schedules.findIndex(s => s.id === scheduleId);
    if (idx < 0) {
      return;
    }
    // const sch = {...(schedules[idx])};
    // sch.medDiscarded = !sch.medDiscarded;
    console.log(schedules[idx].medDiscarded, 'to', !schedules[idx].medDiscarded);
    await updateSchedule(scheduleId, {medDiscarded: !schedules[idx].medDiscarded });
    refresh();
  }

  if (loading || !schedules) {
    return <Loading />
  }

  if (expiredSchedules.length == 0) {
    return <View>Não há medicamentos vencidos</View>
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginVertical: 20,
        }}
      >
        <Text
          variant="displayMedium"
          style={{ flex: 1, textAlign: "center", color: theme.colors.primary }}
        >
          {(100 * expiredSchedules.filter(s => s.medDiscarded).length / expiredSchedules.length).toFixed(0)} %
        </Text>
        <Text variant="headlineMedium" style={{ flex: 2, textAlign: "center" }}>
          medicamentos descartados
        </Text>
      </View>

      <Text variant="bodyLarge" style={{ textAlign: "center" }}>
        Os seguintes medicamentos passaram da validade e precisam ser
        descartados
      </Text>

      {expiredSchedules.map((schedule) => (
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
            <Text variant="titleMedium">Expirou {moment().to(moment(schedule.medExpireDate))}</Text>
            <Button
              compact={true}
              labelStyle={{ color: schedule.medDiscarded ? "green" : "red" }}
              onPress={() => handleDiscardPress(schedule.id)}
            >
              {schedule.medDiscarded ? "Descartado" : "Não descartado"}
            </Button>
          </View>
        </View>
      ))}

      <Button uppercase={true} mode="outlined" onPress={() => {navigation.navigate("DiscardInfo")}}>
        Como descartar
      </Button>
    </ScrollView>
  );
}
