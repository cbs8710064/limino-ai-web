import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useUserRequest } from '../api/useUserRequest'
import { uuidKey } from '@/const'
const { newUser } = useUserRequest()
type UserInfo = {
  email: string
}

export const useUserStore = defineStore('userStore', () => {
  const userInfo: Ref<UserInfo | undefined> = ref()
  /**
   * 登录
   * @param email
   * @returns
   */
  const loginIn = async (email: string) => {
    const res = await newUser(email)
    if (res.id) {
      setUserInfo(email)
    }
    return res
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
  const setUserInfo = (email: string) => {
    localStorage.setItem(uuidKey, email)
    if (userInfo.value) {
      userInfo.value.email = email
    }
  }
  return {
    loginIn,
    userInfo,
    loginOut,
    setUserInfo
  }
})
