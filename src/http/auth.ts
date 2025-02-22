import config from "@/config"
import type { ResponseWeb } from "@/enum/response"
import http from "@/utils/helpers/http"


export function postLogin(body: Object): Promise<ResponseWeb> {
  const path: string= config.routes.login
  return http.postApi(path, body)
}