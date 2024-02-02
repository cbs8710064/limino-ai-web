import { service } from './request'

export const useUserRequest = () => {
  const newUser = (email: string): Promise<{ id: number }> => {
    return service.post(`/users/new?email=${email}`)
  }
  return {
    newUser
  }
}
