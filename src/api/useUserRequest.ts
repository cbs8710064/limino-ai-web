import { service } from './request'

export const useUserRequest = () => {
  /**
   * User register
   * @param email
   * @returns Promise<{ id: number }>
   */
  const newUser = (email: string): Promise<{ id: number }> => {
    return service.post(`/users/new?email=${email}`)
  }

  const usersLogin = (email: string): Promise<{ exist: boolean; status: boolean }> => {
    return service.post(`/users/login?email=${email}`)
  }
  return {
    newUser,
    usersLogin
  }
}
