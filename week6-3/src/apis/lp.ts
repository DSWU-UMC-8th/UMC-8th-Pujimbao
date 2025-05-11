import { PaginationDto } from "../types/common.ts";
import { axiosInstance } from "./axios";
import { ResponseLpListDto } from "../types/lp.ts";

export const getLpById = async (lpId: string | number) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data.data; // data.data 구조 동일
};

export const getLpList = async(paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
  const {data} = await axiosInstance.get('/v1/lps', {
    params: paginationDto,
  });

  return data;
};