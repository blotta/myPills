import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Divider, Text, useTheme } from "react-native-paper";
import MedDetails from "../components/MedDetails";
import MedsSearch from "../components/MedsSearch";
import useMoment from "../hooks/useMoment";

export default function NewMedScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { moment } = useMoment();
  const [med, setMed] = useState(null);
  const [expireDate, setExpireDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
          Medicamento
        </Text>
        {/* {med && (
          <Text>
            {med.name} {med.unitAmount}
          </Text>
        )} */}
      </View>

      {!med && (
        <ScrollView style={{ flex: 1 }}>
          <MedsSearch setMed={setMed} />
        </ScrollView>
      )}

      {med && (
        <>
          <ScrollView>
            <MedDetails medId={med.id} />
            {!expireDate && !showDatePicker && (
              <Button
                mode="contained-tonal"
                onPress={() => setShowDatePicker(true)}
              >
                Selecione a data de expiração
              </Button>
            )}

            {expireDate && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.primary }}
                >
                  Validade
                </Text>
                <Button
                  mode="elevated"
                  textColor="white"
                  onPress={() => setShowDatePicker(true)}
                >
                {moment(expireDate).format('DD/MM/yyyy')}
                {/* {`${expireDate.getDate()}/${(expireDate.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}/${expireDate.getFullYear()}`} */}
                  </Button>
              </View>
            )}

            {showDatePicker && (
              <RNDateTimePicker
                value={expireDate ? expireDate : new Date()}
                themeVariant="dark"
                minimumDate={new Date()}
                onChange={(e, date) => {
                  setShowDatePicker(false);
                  setExpireDate(date);
                }}
              />
            )}
          </ScrollView>

          {med && expireDate && (
            <Button
              uppercase={true}
              mode="contained"
              style={{ borderRadius: 5, marginVertical: 5 }}
              onPress={() => {
                navigation.navigate("NewSchedule", {
                  medId: med.id,
                  expireDate: moment(expireDate).format('yyyy-MM-DD')
                })
              }}
            >
              Continuar
            </Button>
          )}
        </>
      )}
    </View>
  );
}
