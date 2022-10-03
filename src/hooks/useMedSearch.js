import { useEffect, useRef, useState } from "react"
import useFetch from "./useFetch";


export default function useMedSearch() {
  const [search, setSearch] = useState('');

  const {data, loading, error} = useFetch(search ? '/meds?name_like=' + search : '');

  const searchMed = (term) => {
    setSearch(term);
  }

  return { searchMed, medsResults: data, loading };
}
