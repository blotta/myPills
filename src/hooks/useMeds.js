import { useEffect, useRef, useState } from "react";

import { medsAll } from "../db/index";

import AsyncStorage from "@react-native-async-storage/async-storage";

const key = '@mypills:meds';

export default function useMeds() {
  // const {status, data: meds} = useFetch('https://localhost:3000/meds')

  const dbmeds = useRef(medsAll);
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [counter, setCounter] = useState(0);



  useEffect(() => {
    async function fetchMeds() {

      setError(null);
      setLoading(true);
      try {
        const value = await AsyncStorage.getItem(key);
        if (value == null) {
          await AsyncStorage.setItem(key, JSON.stringify(dbmeds.current));
        }

        setMeds(JSON.parse(value ? value : await AsyncStorage.getItem(key)));
      } catch (e) {
        setError(e.message);
      }

      // console.log('allkeys', await AsyncStorage.getAllKeys());
      // console.log('getItem', key, await AsyncStorage.getItem(key));

      setLoading(false);
    }

    fetchMeds();
  }, [counter]);

  const refresh = () => {
    setCounter(p => p + 1);
  }

  return { meds, loading, error, refresh };
}
