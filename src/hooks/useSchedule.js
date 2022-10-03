import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState } from "react";

import useFetch from "./useFetch";

export default function useSchedule(scheduleId) {
  const { loading, error, data: schedule, resendFetch } = useFetch(`/schedules/${scheduleId}`);


  return { schedule, loading, error, refresh: resendFetch };
}
