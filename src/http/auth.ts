import config from "@/config"
import type { ResponseWeb } from "@/enum/response"
import http from "@/utils/helpers/http"


export function postLogin(body: Object): Promise<ResponseWeb> {
  const path: string= config.routes.login
  return http.postApi(path, body)
}

export function getCurrentUser(): Promise<ResponseWeb> {
  const path: string= config.routes.get_current_user
  return http.getApi(path)
}