import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useUserRequest } from '../api/useUserRequest'
import { uuidKey } from '@/const'
const { usersLogin } = useUserRequest()
type UserInfo = {
  email: string
  exist?: boolean
  status?: boolean
  user?: {
    token: number
  }
}

export const useUserStore = defineStore('userStore', () => {
  const userInfo: Ref<UserInfo | undefined> = ref({ email: '' })
  /**
   * 登录
   * @param email
   * @returns
   */
  const loginIn = async (email: string) => {
    const res = await usersLogin(email)
    const { status } = res
    if (status) {
      setUserInfo({ email, ...res })
      return res
    }
    return Promise.reject(res)
  }

  /**
   * 登出
   */
  const loginOut = () => {
    localStorage.clear()
    userInfo.value = undefined
  }

  /**
   * 存储到本地存储和更新数据仓库
   * @param email
   */
  const setUserInfo = (info: UserInfo) => {
    localStorage.setItem(uuidKey, JSON.stringify(info))
    userInfo.value = info
  }

  const info = localStorage.getItem(uuidKey)
  try {
    if (info) {
      const newInfo = JSON.parse(info)
      setUserInfo(newInfo)
    }
  } catch (err) {
    loginOut()
  }
  return {
    loginIn,
    userInfo,
    loginOut,
    setUserInfo
  }
})
