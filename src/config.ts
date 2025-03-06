export type ConfigProps = {
  Sidebar_drawer: boolean;
  mini_sidebar: boolean;
  actTheme: string;
  fontTheme: string;
  routes: AvailableRoutes;
};

type AvailableRoutes = {
  login: string
  get_current_user: string
  post_question: string
  get_all_question: string
  get_by_id_question: string
  delete_by_id_question: string
  check_chapter_question: string
  get_exam_by_id_question: string
  get_exam_by_id: string
  post_exam: string

}

const config: ConfigProps = {
  Sidebar_drawer: true,
  mini_sidebar: false,
  actTheme: 'light',
  fontTheme: 'Public sans',
  routes: {
    login: '/api/login',
    get_current_user: '/api/current-user',
    post_question: '/api/questions',
    get_all_question: '/api/questions',
    get_by_id_question: '/api/questions/:id',
    delete_by_id_question: '/api/questions/:id',
    check_chapter_question: '/api/question-check-material',
    get_exam_by_id_question: '/api/exams/:id',
    get_exam_by_id: '/api/exams-preview/:id',
    post_exam: '/api/exams'
  }
};


export default config;
