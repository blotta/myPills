import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react"
import useFetch from "./useFetch";
import useMeds from "./useMeds";


export default function useMedSearch() {
  const [search, setSearch] = useState('');
  const [medsResults, setMedsResults] = useState(null);
  // const [loading, setLoading] = useState(false);

  // const {data, loading, error} = useFetch(search ? '/meds?name_like=' + search : '');
  const {meds, loading, error} = useMeds();

  useEffect(() => {
    if (!search) {
      setMedsResults(null);
      return;
    }

    const query = meds.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    setMedsResults(query);

  }, [search])

  const searchMed = (term) => {
    setSearch(term);
  }

  return { searchMed, medsResults, loading };
}
