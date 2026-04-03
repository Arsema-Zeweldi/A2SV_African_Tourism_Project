import axios from 'axios'
import { userSignupInfo, userLoginInfo } from '@/types/auth'

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth`

export const signup = async (userData: userSignupInfo) => {
  const response = await axios.post(`${API_URL}/register`, userData)
  return response.data
}

export const login = async (credentials: userLoginInfo) => {
  const response = await axios.post(`${API_URL}/login`, credentials)
  return response.data
}

export const logout = async () => {
  const response = await axios.post(`${API_URL}/logout`)
  return response.data
}

export const forgotPassword = async (email: string) => {
  const response = await axios.post(`${API_URL}/forgot-password`, {
    email: email,
  })

  return response.data
}

// services/authService.ts

export const resetPassword = async (
  password: string,
  password_confirm: string,
  token: string | null
) => {
  const response = await axios.post(`${API_URL}/reset-password`, {
    token,
    password,
    password_confirm,
  })

  return response.data
}

export const resendVerification = async (email: string) => {
  const response = await axios.post(`${API_URL}/resend-verification`, { email })
  return response.data
}
