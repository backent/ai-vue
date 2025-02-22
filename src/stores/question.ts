import { deleteQuestionById, getAllQuestion, getQuestionById, postFormCreateQuestion } from "@/http/question";
import type { ResponseWeb } from "@/enum/response";
import { defineStore } from "pinia";

export const useQuestionStore = defineStore('question', {
  actions: {
    async createQuestion(body: FormData): Promise<any> {
      return postFormCreateQuestion(body, () => {})
    },
    async fetchAllQuestion(): Promise<ResponseWeb> {
      return getAllQuestion()
    },
    async fetchQuestionId(id: string): Promise<ResponseWeb> {
      return getQuestionById(id)
    },
    async removeQuestionById(id: string): Promise<ResponseWeb> {
      return deleteQuestionById(id)
    }
  }
})