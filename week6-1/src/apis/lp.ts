import { PaginationDto } from "../types/common.ts";
import { axiosInstance } from "./axios";
import { ResponseLpListDto } from "../types/lp.ts";

export const getLpList = async(paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
  const {data} = await axiosInstance.get('/v1/ps', {
    params: paginationDto,
  });

  return data;
};