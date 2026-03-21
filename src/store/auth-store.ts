export interface AuthStore {
  accessToken: string
  email: string
  logout: () => void
}

const fallbackUser: AuthStore = {
  accessToken: "",
  email: "alex@lyncs.app",
  logout: () => {},
}

export const useAuthStore = (): AuthStore => {
  return fallbackUser
}
