import type { ReactNode } from "react"

type AuthLayoutProps = {
  children: ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <section className="font-geist bg-lyncs-bg w-full h-dvh overflow-hidden">
      {children}
    </section>
  )
}

export default AuthLayout
