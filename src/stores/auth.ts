import type { LoginRequest } from "@/enum/auth/loginRequest";
import { postLogin } from "@/http/auth";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
  actions: {
    async login(body: LoginRequest): Promise<any> {
      return postLogin(body)
        .then(res => this.setToken(res.data.token))
    },
    setToken(token: string): void {
      localStorage.setItem('_auth_token', token)
    }
  }
})