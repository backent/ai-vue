import config from "@/config";
import type { ResponseWeb } from "@/enum/response";
import http from "@/utils/helpers/http";

export function postFormCreateQuestion(body: FormData, progress: any): Promise<any> {
  return http.postFormApiWithProgress(config.routes.post_question, body, {}, progress)
}

export function getAllQuestion(): Promise<ResponseWeb> {
  return http.getApi(config.routes.get_all_question)
}

export function getQuestionById(id: string): Promise<ResponseWeb> {
  return http.getApi(config.routes.get_by_id_question, { id })
}

export function deleteQuestionById(id: string): Promise<ResponseWeb> {
  return http.deleteApi(config.routes.delete_by_id_question, { id })
}

export function postFormCheckChapter(body: FormData, progress: any): Promise<any> {
  return http.postFormApiWithProgress(config.routes.check_chapter_question, body, {}, progress)
}
