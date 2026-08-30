const ACCESS_TOKEN_KEY = 'auth.access_token'

export const authStorage = {
  getToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY)
  },

  setToken(token: string): void {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
  },

  clear(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  },
}
