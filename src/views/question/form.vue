<script lang="ts" setup>
import UiTitleCard from '@/components/shared/UiTitleCard.vue';
import type { CreateQuestionRequest } from '@/enum/question/createRequest';
import { useQuestionStore } from '@/stores/question';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

type Form = {
  name: string
  chapter?: string
  language?: string
  amount: number
  file: File | null
}

const questionStore = useQuestionStore()
const router = useRouter()

const snackbar = ref<boolean>(false)

const form = ref<Form>({
  name: '',
  chapter: '',
  language: '',
  amount: 0,
  file: null
})

const isLoading = ref<boolean>(false)
const onCheckingChapter = ref<boolean>(false)
const resultCheckChapter = ref<boolean>(false)
const onTypingChapter = ref<boolean>(false)

const isChapterValid = computed((): boolean => {
  if (!form.value.chapter) {
    return true
  }

  if (onCheckingChapter.value) {
    return false
  }
  return resultCheckChapter.value
})

const isValidForm = computed(() => {
  return !!form.value.name && form.value.amount > 0 && !!form.value.file && isChapterValid.value
})

const hintChapter = computed(() => {
  if (onCheckingChapter.value) {
    return "Checking on progress"
  }
  if (!form.value.chapter || onTypingChapter.value) {
    return ""
  }

  if (resultCheckChapter.value) {
    return "Material exists in this document"
  } else {
    return "Material did not exists in this document"
  }
})

function toRequestObject(formInput: Form): CreateQuestionRequest | null {
  if (!formInput.file) {
    return null
  }
  return {
    name: formInput.name,
    chapter: formInput.chapter,
    language: formInput.language,
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
  requestFormData.append('chapter', request.chapter ?? '')
  requestFormData.append('language', request.language ?? '')
  requestFormData.append('amount', request.amount.toString())
  requestFormData.append('file', request.file)
  
  questionStore.createQuestion(requestFormData)
    .then((res) => {
      snackbar.value = true
      setTimeout(() => {
        router.push({ name: 'QuestionDetail', params: { id: res.data.id }})
      }, 1000)
    })

    .finally(() => isLoading.value = false)
}

function checkChapter() {
  const request: CreateQuestionRequest | null = toRequestObject(form.value)
  if (request === null) {
    return
  }
  const requestFormData = new FormData()
  requestFormData.append('chapter', request.chapter ?? '')
  requestFormData.append('file', request.file)

  questionStore.checkChapter(requestFormData)
    .then(res => {
      resultCheckChapter.value = res.data.result
    })
    .catch(() => {
      resultCheckChapter.value = false
    })
    .finally(() => {
      onCheckingChapter.value = false
    })
}

let timeOutCheckChapter = 0
let timeOutTypingCheckChapter = 0

watch(() => form.value.chapter, (v) => {
  if (v) {
    clearTimeout(timeOutTypingCheckChapter)
    clearTimeout(timeOutCheckChapter)
    onTypingChapter.value = true
    timeOutTypingCheckChapter = setTimeout(() => {
      onCheckingChapter.value = true
      onTypingChapter.value = false
      clearTimeout(timeOutCheckChapter)
      timeOutCheckChapter = setTimeout(checkChapter, 3000)
    }, 700)
  } else {
    onCheckingChapter.value = false
    resultCheckChapter.value = false
    onTypingChapter.value = false
    clearTimeout(timeOutTypingCheckChapter)
    clearTimeout(timeOutCheckChapter)
  }
})

watch(() => form.value.file, () => {
  clearTimeout(timeOutTypingCheckChapter)
  clearTimeout(timeOutCheckChapter)
})
</script>

<template>
  <v-row>
    <v-snackbar
        v-model="snackbar"
        :timeout="1000"
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
              <v-label>Target audience (optional)</v-label>
              <v-select
                v-model="form.language"
                :items="['SD', 'SMP', 'SMA']"
                hide-details="auto"
                clearable
                variant="outlined"
                class="mt-2"
                color="primary"
              ></v-select>
    
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
                accept=".pdf"
                :disabled="onCheckingChapter || isLoading"
              ></v-file-input>
    
            </v-col>
          </v-row>
          <v-row v-show="form.file">
            <v-col>
              <v-label>Chapter (optional)</v-label>
              <v-text-field
                v-model="form.chapter"
                hide-details="auto"
                required
                variant="outlined"
                class="mt-2"
                color="primary"
                placeholder="BAB 2"
                :disabled="onCheckingChapter || isLoading"
                :hint="hintChapter"
                persistent-hint
              >
              <template v-slot:loader>
                <v-progress-linear
                  :active="onCheckingChapter"
                  height="7"
                  indeterminate
                ></v-progress-linear>
              </template>
            </v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end mt-3 pr-3">
            <v-btn @click="submitQuestion" :disabled="!isValidForm" :loading="isLoading">Submit</v-btn>
          </v-row>
        </v-form>
          <div class="mb-6">
          </div>
      </UiTitleCard>
    </v-col>
  </v-row>
</template>