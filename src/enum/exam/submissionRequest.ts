export type SubmissionRequest = {
  id: number
  submissions: Array<submission>
}

type submission = {
  question: string
  user_answer: string
  options: Array<string>
}