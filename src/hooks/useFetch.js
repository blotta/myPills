import { useEffect, useState } from "react";

import { API_URL } from '@env';

const baseUrl = API_URL;

export default function useFetch(url, sendData = null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [resend, setResend] = useState(0);

  useEffect(() => {
    setError(null);
    if (!url) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('fetching data: ', baseUrl + url);
        const response = await fetch(baseUrl + url);
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, resend]);

  const resendFetch = () => setResend(prev => prev + 1);

  return { data, error, loading, resendFetch };
}
