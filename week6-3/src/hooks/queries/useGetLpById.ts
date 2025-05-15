import { useQuery } from "@tanstack/react-query";
import { getLpById } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpById(lpId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY.lp, lpId],
    queryFn: () => getLpById(lpId!),
    enabled: !!lpId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpById;
