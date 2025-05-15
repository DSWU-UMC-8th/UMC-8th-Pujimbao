import {z} from 'zod';
import {SubmitHandler, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { data } from 'react-router-dom';
import { ResponseSignupDto } from '../types/auth';
import { postSignup } from '../apis/auth';

const schema = z.object({
  email: z.string().email({message: "올바른 이메일 형식이 아닙니다."}),
  password: z
    .string()
    .min(8, {message: "비밀번호는 8자 이상이어야 합니다."})
    .max(20,{message: "비밀번호는 20자 이하여야 합니다."}),
  passwordCheck: z
    .string()
    .min(8, {message: "비밀번호는 8자 이상이어야 합니다."})
    .max(20,{message: "비밀번호는 20자 이하여야 합니다."}),
  name: z
    .string()
    .min(1, {message: "이름을 입력해주세요."})
})
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  })

type FormFields = z.infer<typeof schema> //타입 유추

const SignupPage = () => {
  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  })

  const onSubmit:SubmitHandler<FormFields> = async (data) => {
    console.log(data); //계정 확인
    const {passwordCheck, ...rest} = data; //역구조분해할당
    const response: ResponseSignupDto = await postSignup(rest);

    console.log(response); //요청 잘 되었는지 확인
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-screen">
      <div className="flex flex-col gap-3">
        <input
          {...register("email")}
          type={"email"}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          placeholder={"이메일"}
        />
        {errors.email && <div className={'text-red-500 text-sm'}>{errors.email.message}</div>}

        <input
          {...register("password")}
          type={"password"}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          placeholder={"비밀번호"}
        />
        {errors.password && <div className={'text-red-500 text-sm'}>{errors.password.message}</div>}

        <input
          {...register("passwordCheck")}
          type={"password"}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          placeholder={"비밀번호 확인"}
        />
        {errors.passwordCheck && <div className={'text-red-500 text-sm'}>{errors.passwordCheck.message}</div>}

        <input
          {...register("name")}
          type={"name"}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.name ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          placeholder={"이름"}
        />
        {errors.name && <div className={'text-red-500 text-sm'}>{errors.name.message}</div>}


        <button type='button' onClick={handleSubmit(onSubmit)} disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:gray">
          회원가입
        </button>
      </div>
    </div>
  )
}

export default SignupPage;