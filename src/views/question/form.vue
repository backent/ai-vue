<script lang="ts" setup>
import UiTitleCard from '@/components/shared/UiTitleCard.vue';
import type { CreateQuestionRequest } from '@/enum/question/createRequest';
import { useQuestionStore } from '@/stores/question';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

type Form = {
  name: string
  amount: number
  file: File | null
}

const questionStore = useQuestionStore()
const router = useRouter()

const snackbar = ref(false)

const form = ref<Form>({
  name: '',
  amount: 0,
  file: null
})

const isLoading = ref(false)

function toRequestObject(formInput: Form): CreateQuestionRequest | null {
  if (!formInput.file) {
    return null
  }
  return {
    name: formInput.name,
    amount: formInput.amount,
    file: formInput.file
  }
}

function submitQuestion() {
  const request: CreateQuestionRequest | null = toRequestObject(form.value)
  if (request === null) {
    return
  }
  isLoading.value = true
  const requestFormData = new FormData()
  requestFormData.append('name', request.name)
  requestFormData.append('amount', request.amount.toString())
  requestFormData.append('file', request.file)
  
  questionStore.createQuestion(requestFormData)
    .then((res) => {
      snackbar.value = true
      setTimeout(() => {
        router.push({ name: 'QuestionDetail', params: { id: res.data.id }})
      }, 2000)
    })

    .finally(() => isLoading.value = false)
}
</script>

<template>
  <v-row>
    <v-snackbar
        v-model="snackbar"
        :timeout="2000"
        color="success"
      >
        Question successfully created.
    </v-snackbar>
    <v-col cols="12" md="4">
      <UiTitleCard title="Form" class-name="p-5 pt-5 rounded-md">
        <v-form :disabled="isLoading">
          <v-row>
            <v-col>
              <v-label>Name*</v-label>
              <v-text-field
                v-model="form.name"
                hide-details="auto"
                required
                variant="outlined"
                class="mt-2"
                color="primary"
                placeholder="Soal kelas XII"
              ></v-text-field>
    
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-label>Question amount*</v-label>
              <v-text-field
                v-model.number="form.amount"
                hide-details="auto"
                type="number"
                required
                variant="outlined"
                class="mt-2"
                color="primary"
                placeholder="0"
              ></v-text-field>
    
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-label>Analyze from file (PDF)*</v-label>
              <v-file-input
                v-model="form.file"
                hide-details="auto"
                required
                variant="outlined"
                class="mt-2"
                color="primary"
                placeholder="0"
              ></v-file-input>
    
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end mt-3 pr-3">
            <v-btn @click="submitQuestion" :loading="isLoading">Submit</v-btn>
          </v-row>
        </v-form>
          <div class="mb-6">
          </div>
      </UiTitleCard>
    </v-col>
  </v-row>
</template>