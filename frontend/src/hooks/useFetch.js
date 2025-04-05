import { useEffect, useState, useCallback, useRef } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const refetch = useCallback(() => {
    setReloadFlag(prev => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    controllerRef.current = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(url, { signal: controllerRef.current.signal });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong');
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controllerRef.current?.abort();
    };
  }, [url, reloadFlag]);

  return { data, loading, error, refetch };
}

export default useFetch;
