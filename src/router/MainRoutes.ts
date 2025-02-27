const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main',
  component: () => import('@/layouts/dashboard/DashboardLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/',
      redirect: '/question'
    },
    {
      name: 'Question',
      path: '/question',
      children: [
        {
          name: 'QuestionIndex',
          path: '',
          component: () => import('@/views/question/index.vue')
        },
        {
          name: 'QuestionFormCreate',
          path: 'create',
          component: () => import('@/views/question/form.vue')
        },
        {
          name: 'QuestionDetail',
          path: 'detail/:id',
          component: () => import('@/views/question/detail.vue')
        },
        {
          name: 'QuestionExam',
          path: 'exam/:id',
          component: () => import('@/views/question/exam.vue')
        },
        {
          name: 'QuestionExamPreview',
          path: 'exam/:id',
          component: () => import('@/views/question/exam.vue')
        },
      ]
    },
  ]
};

export default MainRoutes;
