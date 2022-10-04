import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState } from "react";

import useFetch from "./useFetch";
import useSchedules from "./useSchedules";

export default function useSchedule(scheduleId) {
  // const { loading, error, data: schedule, resendFetch } = useFetch(`/schedules/${scheduleId}`);

  const [schedule, setSchedule] = useState(null);

  const { schedules, loading, error, refresh, remove } = useSchedules();

  useEffect(() => {
    if (!schedules) {
      return;
    }
    const idx = schedules.findIndex(m => m.id === scheduleId);
    setSchedule(idx < 0 ? null : schedules[idx]);

  }, [schedules])

  const removeSelf = async () => {
    await remove(scheduleId);
  }

  return { schedule, loading, error, refresh, remove: removeSelf };

  // return { schedule, loading, error, refresh: resendFetch };
}
