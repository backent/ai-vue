export type ConfigProps = {
  Sidebar_drawer: boolean;
  mini_sidebar: boolean;
  actTheme: string;
  fontTheme: string;
  routes: AvailableRoutes;
};

type AvailableRoutes = {
  login: string
  post_question: string
  get_all_question: string
  get_by_id_question: string
  delete_by_id_question: string
}

const config: ConfigProps = {
  Sidebar_drawer: true,
  mini_sidebar: false,
  actTheme: 'light',
  fontTheme: 'Public sans',
  routes: {
    login: '/api/login',
    post_question: '/api/questions',
    get_all_question: '/api/questions',
    get_by_id_question: '/api/questions/:id',
    delete_by_id_question: '/api/questions/:id',
  }
};


export default config;
