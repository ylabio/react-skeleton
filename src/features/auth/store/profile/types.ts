export interface IProfileState {
  data: {
    _id: string,
    email: string,
    profile: {
      name: string,
      phone: string
    }
  } | null,
  waiting: boolean,
}
