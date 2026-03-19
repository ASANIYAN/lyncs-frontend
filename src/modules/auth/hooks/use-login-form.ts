import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LoginSchema, type LoginFormType } from "../utils/validations"

type UseLoginFormReturn = {
  form: ReturnType<typeof useForm<LoginFormType>>
}

export const useLoginForm = (): UseLoginFormReturn => {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })
  return { form }
}
