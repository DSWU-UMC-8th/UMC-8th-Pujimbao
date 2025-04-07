import { useEffect, useState } from "react";
import axios from "axios";

interface ApiResponse<T>{
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

type Language = "ko-KR" | "en-US";

function useCustomFetch<T>(url:string, language: Language = "en-US"): ApiResponse<T>{
    const [data, setData] = useState<T | null>(null);
    //로딩 상태
    const [isPending, setIsPending] = useState<boolean>(false);
    //에러 상태
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
      const fetchData = async () => {
        setIsPending(true);

        try {
          const {data} = await axios.get<T>(url, {
            // headers: {
            //   Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            // },
            params: {
              api_key: import.meta.env.VITE_TMDB_KEY,
              language,
            }
          });
          setData(data);
        } catch {
          setIsError(true);
        } finally {
          setIsPending(false);
        }
      }
      fetchData();
    }, [url]);

    return {data, isPending, isError};
  } 

export default useCustomFetch;