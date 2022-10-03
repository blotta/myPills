import { ScrollView, View } from "react-native";
import React, { useState } from "react";
import {
  Button,
  Divider,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import useMoment from "../hooks/useMoment";
import useMed from "../hooks/useMed";
import Loading from "../components/Loading";
import useScheduleService from "../hooks/useScheduleService";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

export default function NewScheduleScreen({ route }) {
  const { expireDate, medId } = route.params;

  const navigation = useNavigation();
  const theme = useTheme();

  const { moment } = useMoment();

  const { med, medLoading, error } = useMed(medId);

  const { createSchedule } = useScheduleService();

  const [frequency, setFrequency] = useState("3");
  const [intervalDays, setIntervalDays] = useState("1");
  const [duration, setDuration] = useState("2");
  const [startDateTime, setStartDateTime] = useState(
    moment().add(1, "hours").toDate()
  );
  const [addToCalendar, setAddToCalendar] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const handleSave = async () => {
    setCreateLoading(true);
    const createdSchedule = await createSchedule(
      med,
      expireDate,
      {
        frequency: parseInt(frequency),
        intervalDays: parseInt(intervalDays),
        duration: parseInt(duration),
      },
      startDateTime
    );
    setCreateLoading(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }]
    })
    navigation.navigate("ScheduleDetails", {scheduleId: createdSchedule.id})
  };

  if (medLoading || createLoading) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView>
        {med && (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                variant="titleLarge"
                style={{ color: theme.colors.primary }}
              >
                Medicamento
              </Text>
              <Text>
                {med.name} {med.unitAmount}
              </Text>
            </View>
            <Divider style={{ marginVertical: 15 }} />
          </>
        )}

        <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
          Posologia
        </Text>

        <Text style={{ textAlign: "center" }}>Indique o plano de dosagem</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text variant="titleMedium">Frequência</Text>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <TextInput
              mode="outlined"
              maxLength={1}
              keyboardType="numeric"
              value={frequency}
              onChangeText={(text) => setFrequency(text)}
            />
            <Text variant="titleMedium" style={{ marginLeft: 5 }}>
              x
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text variant="titleMedium">Intervalo</Text>
          <Button uppercase mode="elevated" disabled>
            ao dia
          </Button>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text variant="titleMedium">Duração</Text>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <TextInput
              mode="outlined"
              maxLength={1}
              keyboardType="numeric"
              value={duration}
              onChangeText={(text) => setDuration(text)}
            />
            <Text variant="titleMedium" style={{ marginLeft: 5 }}>
              Dias
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
          <Text variant="titleMedium">Início</Text>
          <View style={{ flexDirection: "row" }}>
            <Button
              mode="elevated"
              textColor="white"
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              onPress={() => setShowDatePicker(true)}
            >
              {moment(startDateTime).format("DD/MM/yyyy")}
            </Button>

            <Button
              mode="elevated"
              textColor="white"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              onPress={() => setShowTimePicker(true)}
            >
              {moment(startDateTime).format("HH:mm")}
            </Button>
          </View>
          {showDatePicker && (
            <RNDateTimePicker
              mode="date"
              value={startDateTime}
              themeVariant="dark"
              onChange={(e, date) => {
                setShowDatePicker(false);
                setStartDateTime(date);
              }}
            />
          )}

          {showTimePicker && (
            <RNDateTimePicker
              mode="time"
              value={startDateTime}
              themeVariant="dark"
              onChange={(e, date) => {
                setShowTimePicker(false);
                setStartDateTime(date);
              }}
            />
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text variant="titleMedium">Adiconar ao calendário</Text>
          <Switch
            value={addToCalendar}
            onValueChange={() => setAddToCalendar((prev) => !prev)}
          />
        </View>
        <Text style={{ textAlign: "center" }}>
          Pedirá permissão para ler, criar e editar eventos no seu calendário
        </Text>
      </ScrollView>

      <Button
        uppercase={true}
        mode="contained"
        style={{ borderRadius: 5, marginVertical: 5 }}
        onPress={() => handleSave()}
      >
        Salvar
      </Button>
    </View>
  );
}
