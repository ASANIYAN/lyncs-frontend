import * as React from "react"
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"

interface CustomInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  placeholder?: string
  disabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
  labelClassName?: string
  inputClassName?: string
  errorClassName?: string
  description?: string
  type?: string
  error?: string
  requiredMark?: boolean
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

const CustomInput = <TFieldValues extends FieldValues>(
  props: CustomInputProps<TFieldValues>
) => {
  const {
    control,
    name,
    label,
    placeholder,
    disabled,
    leftIcon,
    rightIcon,
    containerClassName,
    labelClassName,
    inputClassName,
    errorClassName,
    description,
    type = "text",
    error,
    requiredMark = false,
    onFocus,
    onBlur,
  } = props

  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorMessage = error ?? fieldState.error?.message
        const hasError = Boolean(errorMessage)

        const handleFocus: React.FocusEventHandler<HTMLInputElement> = (event) => {
          setIsFocused(true)
          onFocus?.(event)
        }

        const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
          setIsFocused(false)
          field.onBlur()
          onBlur?.(event)
        }

        const iconClassName = cn(
          "text-lyncs-text-muted",
          isFocused && "text-lyncs-accent",
          hasError && "text-lyncs-danger"
        )

        return (
          <Field
            data-slot="custom-input"
            data-invalid={hasError}
            data-disabled={disabled}
            className={cn("gap-1.5", containerClassName)}
          >
            {label && (
              <FieldLabel
                data-slot="custom-input-label"
                className={cn(
                  "text-[10.5px] font-bold text-lyncs-text-muted uppercase tracking-[0.5px]",
                  labelClassName
                )}
              >
                {label}
                {requiredMark && (
                  <span className="text-lyncs-danger ml-0.5">*</span>
                )}
              </FieldLabel>
            )}
            <div
              data-slot="custom-input-wrapper"
              className={cn(
                "flex items-center gap-2 rounded-md px-2.5 py-1.5 transition-colors",
                "bg-lyncs-card border border-lyncs-border hover:border-lyncs-border-hover",
                isFocused &&
                  "bg-lyncs-elevated border-lyncs-accent shadow-[0_0_0_3px_var(--color-lyncs-accent-dim)]",
                hasError &&
                  "bg-lyncs-card border-2 border-lyncs-danger shadow-[0_0_0_3px_var(--color-lyncs-danger-dim)]",
                disabled &&
                  "opacity-50 cursor-not-allowed bg-lyncs-surface"
              )}
            >
              {leftIcon && (
                <span data-slot="custom-input-icon" className={iconClassName}>
                  {leftIcon}
                </span>
              )}
              <Input
                {...field}
                data-slot="custom-input-input"
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={hasError || undefined}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={cn(
                  "h-auto border-none bg-transparent px-0 py-0 text-[13.5px] text-lyncs-text placeholder:text-lyncs-text-faint focus-visible:ring-0",
                  inputClassName
                )}
              />
              {rightIcon && (
                <span data-slot="custom-input-icon" className={iconClassName}>
                  {rightIcon}
                </span>
              )}
            </div>
            {description && (
              <FieldDescription className="text-[12px] text-lyncs-text-muted">
                {description}
              </FieldDescription>
            )}
            <FieldError
              errors={errorMessage ? [{ message: errorMessage }] : undefined}
              className={cn("text-[11px] text-lyncs-danger", errorClassName)}
            />
          </Field>
        )
      }}
    />
  )
}

interface CustomPasswordInputProps<TFieldValues extends FieldValues>
  extends Omit<CustomInputProps<TFieldValues>, "type" | "rightIcon"> {}

const CustomPasswordInput = <TFieldValues extends FieldValues>(
  props: CustomPasswordInputProps<TFieldValues>
) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const toggleIcon = (
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="text-inherit"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  )

  return (
    <CustomInput
      {...props}
      type={showPassword ? "text" : "password"}
      rightIcon={toggleIcon}
    />
  )
}

export { CustomInput, CustomPasswordInput }
