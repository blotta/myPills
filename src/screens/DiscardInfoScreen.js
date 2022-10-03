import { View, Image } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text, useTheme } from "react-native-paper";

import img01 from "../../assets/images/01.jpg";
import img02 from "../../assets/images/02.jpg";
import img03 from "../../assets/images/03.jpg";
import img04 from "../../assets/images/04.jpg";

export default function DiscardInfoScreen() {
  const theme = useTheme();
  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <View style={{ paddingVertical: 20 }}>
        <Text
          variant="displaySmall"
          style={{
            textAlign: "center",
            color: theme.colors.primary,
            marginVertical: 15,
          }}
        >
          Descarte da Maneira Correta
        </Text>

        <Image
          style={{ resizeMode: "contain", width: "100%" }}
          source={img01}
        />

        <Text variant="bodyLarge">
          Jogar os remédios vencidos no lixo comum ou no vaso sanitário não é
          correto, pois o sistema de esgoto não foi montado para eliminar as
          substâncias químicas presentes nesses produtos e nem sempre o lixo é
          tratado do jeito que deveria, então pode contaminar o meio ambiente e
          causar danos aos seres vivos daquele local.
        </Text>

        <Image
          style={{ resizeMode: "contain", width: "100%" }}
          source={img02}
        />

        <Text variant="bodyLarge">
          O correto é levar até um posto de coleta, farmácia que realize esse
          tipo de coleta ou até um posto de saúde e pedir para que eles façam o
          descarte apropriado.
        </Text>

        <Image
          style={{ resizeMode: "contain", width: "100%" }}
          source={img03}
        />

        <Text variant="bodyLarge">
          Estando nos locais adequados, as caixas e bulas serão mandadas para o
          reciclável (essa primeira parte, a própria pessoa pode realizar em
          casa) e as seringas dos medicamentos serão levadas até usinas para
          serem descontaminadas e, em seguida, encaminhadas para aterros de
          sólidos.
        </Text>

        <Image
          style={{ resizeMode: "contain", width: "100%" }}
          source={img04}
        />

        <Text variant="bodyLarge">
          Já os medicamentos em comprimido, por normalmente possuírem produtos
          químicos, são incinerados em usinas preparadas ambientalmente para
          essa ação para haver contaminação.
        </Text>
      </View>
    </ScrollView>
  );
}
