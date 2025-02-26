import type { SubmissionRequest } from "@/enum/exam/submissionRequest";
import type { ResponseWeb } from "@/enum/response";
import { getExamByQuestionId, postSubmissionExam } from "@/http/exam";
import { defineStore } from "pinia";

export const useExamStore = defineStore('exam', {
  actions: {
    async takeExamByQuestionId(id: string): Promise<ResponseWeb> {
      return getExamByQuestionId(id)
    },
    async submitExam(body: SubmissionRequest): Promise<void> {
      return postSubmissionExam(body)
    }
  }
})