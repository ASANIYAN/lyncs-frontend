import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SignupSchema, type SignupFormType } from "../utils/validations"

type UseSignupFormReturn = {
  form: ReturnType<typeof useForm<SignupFormType>>
}

export const useSignupForm = (): UseSignupFormReturn => {
  const form = useForm<SignupFormType>({
    resolver: zodResolver(SignupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  return { form }
}
