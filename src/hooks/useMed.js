import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState } from "react";

import useFetch from "./useFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useMeds from "./useMeds";

export default function useMed(medId) {
  // const { loading, error, data: med } = useFetch(`/meds/${medId}`);
  const [med, setMed] = useState(null);

  const { meds, loading, error } = useMeds();

  useEffect(() => {
    if (!meds) {
      return;
    }
    const idx = meds.findIndex(m => m.id === medId);
    setMed(idx < 0 ? null : meds[idx]);

  }, [meds])

  const createMyMed = () => {
    const myMed = { ...med, medId: med.id, id: uuid() };
    console.log(myMed);
  };

  return { med, loading, error, createMyMed };
}
