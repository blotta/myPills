import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState } from "react";

import useFetch from "./useFetch";

export default function useMed(medId) {
  const { loading, error, data: med } = useFetch(`/meds/${medId}`);

  const createMyMed = () => {
    const myMed = { ...med, medId: med.id, id: uuid() };
    console.log(myMed);
  };

  return { med, loading, error, createMyMed };
}
