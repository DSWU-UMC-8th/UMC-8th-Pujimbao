import { useQuery } from "@tanstack/react-query";
import { ResponseSearchByTagDto } from "../../types/lp";
import { QUERY_KEY } from "../../constants/key";
import axiosInstance from "../../apis/axiosInstance"; // ✅ axiosInstance import

export async function getLpListByTag(tagName: string) {
  console.log("🔍 태그 검색 요청됨:", tagName);
  const res = await axiosInstance.get(`/v1/lps/tag/${tagName}`, {
    params: {
      cursor: 0,
      limit: 10,
      order: "asc",
    },
  });
  return res.data;
}

function useSearchLpList(tagName: string, enabled: boolean) {
  return useQuery<ResponseSearchByTagDto>({
    queryKey: [QUERY_KEY.search, tagName],
    queryFn: () => getLpListByTag(tagName),
    enabled,
  });
}

export default useSearchLpList;
