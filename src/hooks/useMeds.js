import { useEffect, useRef, useState } from "react"

import {medsAll} from '../db'
import useFetch from "./useFetch";

export default function useMeds() {
  // const {status, data: meds} = useFetch('https://localhost:3000/meds')

  const meds = useRef(medsAll).current;

  const getById = (medId) => {
    const res = meds.filter(m => m.id === medId);
    if (res.length > 0) {
      return res[0];
    }
    return null;
  }


  return { getById };
}
