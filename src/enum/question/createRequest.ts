export type CreateQuestionRequest = {
  name: string
  chapter?: string
  language?: string
  amount: number
  file: File
}