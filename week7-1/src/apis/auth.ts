import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { RequestSignupDto, ResponseSignupDto, RequestSigninDto, ResponseSigninDto, ResponseMyInfoDto } from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async(body: RequestSignupDto):Promise<ResponseSignupDto> => {
  const {data} = await axiosInstance.post('v1/auth/signup', body);

  return data;
}

export const postSignin = async(body: RequestSigninDto):Promise<ResponseSigninDto["data"]> => {
  const {data} = await axiosInstance.post('/v1/auth/signin', body);

  return data.data; //data 하나 추가
}

export const getMyInfo = async(): Promise<ResponseMyInfoDto> => {
  const {getItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken); //무시 가능한 경고래
  const token = getItem(); // 여기서 실제 토큰을 가져옴
  const {data} = await axiosInstance.get('/v1/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return data;
}

export const postLogout = async() => {
  const {data} = await axiosInstance.post("/v1/auth/signout");
  return data;
}

export const updateMyInfo = async ({
  name,
  bio,
  avatar,
}: {
  name: string;
  bio?: string;
  avatar?: string;
}) => {
  const { data } = await axiosInstance.patch("/v1/users", {
    name,
    bio,
    avatar,
  });
  return data;
};

export const postWithdraw = async () => {
  const { data } = await axiosInstance.delete("/v1/users"); // 실제 API 경로에 따라 조정
  return data;
};
