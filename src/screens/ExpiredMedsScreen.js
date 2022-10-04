import { View, ScrollView } from "react-native";
import React, { useMemo, useState } from "react";
import { Button, Chip, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import useFetch from "../hooks/useFetch";
import Loading from "../components/Loading";
import useMoment from "../hooks/useMoment";
import useScheduleService from "../hooks/useScheduleService";
import useSchedules from "../hooks/useSchedules";

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
  const { moment } = useMoment();

  // const { data: schedules, loading, error, resendFetch: refresh } = useFetch('/schedules');
  const { schedules, loading, error, refresh } = useSchedules();
  const { toggleDiscardScheduleMed } = useScheduleService();
  const navigation = useNavigation();
  const theme = useTheme();

  const [showAll, setShowAll] = useState(false);

  const expiredSchedules = useMemo(() => {
    if (!schedules) {
      return [];
    }
    return schedules.filter((s) =>
      moment(s.medExpireDate).isSameOrBefore(moment())
    );
  }, [schedules]);

  const results = useMemo(() => {
    if (showAll) {
      return schedules;
    }
    return expiredSchedules;
  }, [expiredSchedules, showAll]);

  const handleDiscardPress = async (scheduleId) => {
    await toggleDiscardScheduleMed(scheduleId);
    refresh();
  };

  if (loading || !schedules) {
    return <Loading />;
  }

  return (
    <View style={{flex: 1, padding: 10}}>
      <ScrollView style={{ flex: 1}}>
        <View style={{ flexDirection: "row-reverse", padding: 10 }}>
          <Chip selected={showAll} onPress={() => setShowAll((p) => !p)}>
            Incluir não expirados
          </Chip>
        </View>
        {showAll == false && expiredSchedules.length == 0 && (
          <Text style={{ textAlign: "center" }}>
            Não há medicamentos vencidos
          </Text>
        )}
        {showAll && results.length == 0 && (
          <Text style={{ textAlign: "center" }}>
            Não há medicamentos registrados
          </Text>
        )}

        {results.length > 0 && (
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
              style={{
                flex: 1,
                textAlign: "center",
                color: theme.colors.primary,
              }}
            >
              {(
                (100 * results.filter((s) => s.medDiscarded).length) /
                results.length
              ).toFixed(0)}{" "}
              %
            </Text>
            <Text
              variant="headlineMedium"
              style={{ flex: 2, textAlign: "center" }}
            >
              medicamentos descartados
            </Text>
          </View>
        )}

        {results.length > 0 && showAll == false && (
          <Text variant="bodyLarge" style={{ textAlign: "center" }}>
            Os seguintes medicamentos passaram da validade e precisam ser
            descartados
          </Text>
        )}

        {results.map((schedule) => (
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
              <Text variant="titleMedium">
                {moment().isSameOrAfter(moment(schedule.medExpireDate))
                  ? "Expirou "
                  : "Expira "}
                {moment().to(moment(schedule.medExpireDate))}
              </Text>
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
      </ScrollView>
      <Button
        icon="information"
        uppercase={true}
        mode="outlined"
        onPress={() => {
          navigation.navigate("DiscardInfo");
        }}
      >
        Como descartar
      </Button>
    </View>
  );
}
