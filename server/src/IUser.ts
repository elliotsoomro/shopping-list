/* eslint-disable camelcase */

export default interface IUser {
  displayName: string
  id: string
  user_id: string
  provider: string
  name: {
    familyName: string
    givenName: string
  }
  emails: { value: string }[]
  picture: string
  nickname: string
  localId: string
}
