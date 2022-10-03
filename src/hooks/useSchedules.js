import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState } from "react";

import useFetch from "./useFetch";

export default function useSchedules(query) {
  const { loading, error, data: schedules } = useFetch(`/schedules${query ? "?" + query : ''}`);


  return { schedules, loading, error };
}
