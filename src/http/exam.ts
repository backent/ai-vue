import config from "@/config";
import type { SubmissionRequest } from "@/enum/exam/submissionRequest";
import type { ResponseWeb } from "@/enum/response";
import http from "@/utils/helpers/http";

export function getExamByQuestionId(id: string): Promise<ResponseWeb> {
  return http.getApi(config.routes.get_exam_by_id_question, { id })
}

export function postSubmissionExam(body: SubmissionRequest): Promise<void> {
  return http.postApi(config.routes.post_exam, body)
}