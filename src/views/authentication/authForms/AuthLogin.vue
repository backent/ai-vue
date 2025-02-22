<script setup lang="ts">
import { Form } from 'vee-validate';
import http from '@/utils/helpers/http';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()


function login(as: string): void {
  authStore.login({
    username: as
  })
    .then(() => router.push('/'))
}
</script>

<template>
  <div class="d-flex justify-space-between align-center">
    <h3 class="text-h3 text-center mb-0">Login</h3>
  </div>
  <Form class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <v-row>
      <v-col sm="12"> <v-btn color="primary" class="w-100" @click="login('student')" >
      Login as student</v-btn
    ></v-col>
      <v-col sm=12> <v-btn color="primary" class="w-100" @click="login('teacher')">
      Login as teacher</v-btn
    ></v-col>
    </v-row>
    
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
</template>
<style lang="scss">
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>
