import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState } from "react";

import useFetch from "./useFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

const key = '@mypills:schedules';
const initial = [];

export default function useSchedules(query) {
  // const { loading, error, data: schedules } = useFetch(`/schedules${query ? "?" + query : ''}`);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    async function fetchSchedules() {

      setError(null);
      setLoading(true);
      try {
        const value = await AsyncStorage.getItem(key);
        if (value == null) {
          await AsyncStorage.setItem(key, JSON.stringify(initial));
        }

        setSchedules(JSON.parse(value ? value : await AsyncStorage.getItem(key)));
      } catch (e) {
        setError(e.message);
      }

      // console.log('allkeys', await AsyncStorage.getAllKeys());
      // console.log('getItem', key, await AsyncStorage.getItem(key));

      setLoading(false);
    }

    fetchSchedules();
  }, [counter]);

  const add = async (schedule) => {
    const list = [...schedules, schedule];
    await AsyncStorage.setItem(key, JSON.stringify(list));
  }

  const update = async (scheduleId, schedule) => {
    const idx = schedules.findIndex(s => s.id === scheduleId);
    if (idx < 0) {
      return;
    }
    const list = [...schedules];
    list[idx] = {...schedules[idx], ...schedule};
    await AsyncStorage.setItem(key, JSON.stringify(list));
    refresh();
  }

  const remove = async (scheduleId) => {
    refresh();
    const idx = schedules.findIndex(s => s.id === scheduleId);
    if (idx < 0) {
      return;
    }
    const list = [...schedules];
    list.splice(idx, 1);
    await AsyncStorage.setItem(key, JSON.stringify(list));
    refresh();
  }

  const refresh = () => {
    setLoading(true);
    setCounter(p => p + 1);
  }

  return { schedules, loading, error, refresh, add, update, remove };
}
