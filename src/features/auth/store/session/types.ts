export interface ISessionStateConfig {
  tokenHeader: string
}

export interface ISessionState {
  user: {
    _id: string,
    email: string,
    profile: {
      name: string,
    }
  } | null,
  token: string | null, // Опционально, если используется в http.js
  waiting: boolean,
  errors: Record<string, string[]> | null,
  exists: boolean
}
