import { ScrollView, View } from "react-native";
import React, { useState } from "react";
import {
  Button,
  Searchbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import useMedSearch from "../hooks/useMedSearch";
import useFetch from "../hooks/useFetch";

export default function MedsSearch({setMed}) {
  const theme = useTheme();

  // const [searchTerm, setSearchTerm] = useState('');
  const { searchMed, medsResults } = useMedSearch();


  const handleSelectMed = (id) => {
    const meds = medsResults.filter(m => m.id === id);
    if (meds.length > 0) {
      setMed(meds[0]);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Searchbar onChangeText={(text) => searchMed(text)} />

      <View style={{ flex: 1, marginTop: 10 }}>
        <Text style={{ textAlign: "center", marginVertical: 5 }}>
          {!medsResults && "procure pelo medicamento desejado"}
          {medsResults && `Resultados: ${medsResults.length}`}
        </Text>

        {medsResults &&
          medsResults.map((med) => (
            <Button
              key={med.id}
              mode="elevated"
              style={{ borderRadius: 5, marginBottom: 10 }}
              onPress={() => handleSelectMed(med.id)}
            >
              {med.name} {med.unitAmount}
            </Button>
          ))}
      </View>

    </View>
  );
}
