import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

//base URL 설정
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}`,
  }, //모든 요청에 알아서 토큰이 들어감
})