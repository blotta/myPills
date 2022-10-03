import { Image, View } from "react-native";
import React from "react";
import { Button, Text, useTheme } from "react-native-paper";

import * as images from "../../assets/images";
import useMed from "../hooks/useMed";
import Loading from "./Loading";

export default function MedDetails({ medId }) {
  const theme = useTheme();

  const { med, loading, error } = useMed(medId);

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!med || loading) {
    return <Loading />;
  }

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View style={{ flex: 1, justifyContent: "flex-start" }}>
          <Image
            source={images[med.image]}
            resizeMode="center"
            // resizeMethod="scale"
            style={{
              flex: 1,
              marginBottom: 10,
              resizeMode: "center",
              width: "100%",
              height: undefined,
              aspectRatio: 1,
              backgroundColor: "blue",
            }}
          />
          <Button mode="elevated" uppercase={true}>
            BULA
          </Button>
        </View>

        <View style={{ flex: 1, paddingLeft: 15 }}>
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <Text variant="titleLarge" style={{ textAlign: "center" }}>
              {med.name}
            </Text>

            <View>
              <Text
                variant="titleSmall"
                style={{ color: theme.colors.primary }}
              >
                Tipo
              </Text>
              <Text variant="titleMedium">{med.type}</Text>
            </View>

            <View>
              <Text
                variant="titleSmall"
                style={{ color: theme.colors.primary }}
              >
                Dosagem
              </Text>
              <Text variant="titleMedium">{med.unitAmount}</Text>
            </View>

            <View>
              <Text
                variant="titleSmall"
                style={{ color: theme.colors.primary }}
              >
                Via
              </Text>
              <Text variant="titleMedium">{med.intakeMethod}</Text>
            </View>
          </View>
        </View>
      </View>

      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
            Detentor
          </Text>
          <Text variant="titleMedium">{med.detentor}</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
            Registro
          </Text>
          <Text variant="titleMedium">{med.registry}</Text>
        </View>
      </View>
    </View>
  );
}
