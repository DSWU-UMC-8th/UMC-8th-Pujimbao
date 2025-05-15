import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // 백엔드 주소에 맞게 설정
  withCredentials: true,
});

export default axiosInstance;
