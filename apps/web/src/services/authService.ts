import axios from 'axios'
import { userSignupInfo, userLoginInfo } from '@/types/auth'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`

export const signup = async (userData: userSignupInfo) => {
  const response = await axios.post(`${API_URL}/register`, userData)
  return response.data
}

export const login = async (credentials: userLoginInfo) => {
  const response = await axios.post(`${API_URL}/login`, credentials)
  if (response.data.token) {
    localStorage.setItem('user_token', response.data.token)
  }
  return response.data
}
