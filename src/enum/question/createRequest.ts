export type CreateQuestionRequest = {
  name: string
  chapter?: string
  amount: number
  file: File
}