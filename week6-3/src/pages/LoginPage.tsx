import useForm from "../hooks/useForm";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import {useAuth} from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
  const {login, accessToken} = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [navigate, accessToken]);


  //const {setItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {getInputProps, errors, touched, values} = useForm<UserSigninInformation>({
    initialValue: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  })

  const handleSubmit = async () => {
    // console.log(values);

    // try {
    //   const response = await postSignin(values);
    //   localStorage.setItem("accessToken", response.data.accessToken); //토큰을 가장 쉽게 보관할 수 있는 방법
    //   console.log(response);
    // } catch (error) {
    //   alert(error?.message);
    // }
    await login(values);
  }

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login"
  }

  // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || //오류가 있으면 true
    Object.values(values).some((value) => value === ""); //입력값이이비어있으면 true
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-screen">
        <div className="flex flex-col gap-3">
          <input
            {...getInputProps("email")}
            name="email"
            type={"email"}
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
              ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            placeholder={"이메일"}
          />
            {errors?.email && touched.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}

            <input
            {...getInputProps("password")}
            type={"password"}
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
              ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            placeholder={"비밀번호"}
          />
            {errors?.password && touched.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}
          <button type='button' onClick={handleSubmit} disabled={isDisabled}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:gray">
            로그인
          </button>

          <button type='button' onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:gray">
            <div className="flex items-center justify-center gap-4">
              <img src={"images/GoogleLogo.svg"} alt="Google Logo Image" />
              <span>구글 로그인</span>
            </div>
          </button>
        </div>
      </div>
    )
}
export default LoginPage;