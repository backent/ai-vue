import { defineStore } from 'pinia';

export const useUsersStore = defineStore({
  id: 'Authuser',
  state: () => ({
    users: {}
  }),
  actions: {
  }
});
