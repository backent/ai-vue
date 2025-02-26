import type { LoginRequest } from "@/enum/auth/loginRequest";
import type { ResponseWeb } from "@/enum/response";
import { getCurrentUser, postLogin } from "@/http/auth";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
  state() {
    return {
      currentUser: {
        username: ''
      }
    }
  },
  getters: {
    isTeacher(): boolean {
      return this.currentUser.username === 'teacher'
    },
    isStudent(): boolean {
      return this.currentUser.username === 'student'
    }
  },
  actions: {
    async login(body: LoginRequest): Promise<any> {
      return postLogin(body)
        .then(res => this.setToken(res.data.token))
    },
    logout(): void {
      this.setToken("")
    },
    setToken(token: string): void {
      localStorage.setItem('_auth_token', token)
    },
    async fetchCurrentUser(): Promise<ResponseWeb> {
      return getCurrentUser()
        .then(res => {
          this.currentUser.username = res.data.username
          return res
        }) 
    }
  }
})