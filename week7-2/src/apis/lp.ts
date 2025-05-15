import { PaginationDto } from "../types/common.ts";
import { axiosInstance } from "./axios";
import { ResponseLpListDto, RequestLpDto, ResponseLpDto, ResponseLikeLpDto } from "../types/lp.ts";

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

// export const getLpDetail = async({
//   lpId,
// }: RequestLpDto) : Promise<ResponseLpDto> => {
//   const {data} = await axiosInstance.get(`/v1/lps/${lpId}`);

//   return data;
// }

export const postLike = async({lpId}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const {data} = await axiosInstance.post(`v1/lps/${lpId}/likes`);

  return data;
}

export const deleteLike = async({lpId}: RequestLpDto) => {
  const {data} = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

  return data;
}

export const postLp = async (lpData: {
  title: string;
  content: string;
  tags: string[];
  thumbnail: string;
  published: boolean;
}) => {
  const { data } = await axiosInstance.post("/v1/lps", lpData);
  return data;
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosInstance.post("/v1/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data.imageUrl; // 서버 응답 구조에 따라 수정
};