<script lang="ts" setup>
import UiTitleCard from '@/components/shared/UiTitleCard.vue';
import { useQuestionStore } from '@/stores/question';
import { removeABCD } from '@/utils/helpers/formatter';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

type questionItem = {
  question: string
  options: Array<string>
  answer: 'A' | 'B' | 'C' | 'D'
  explanation: string
}

type studentAttempt = {
  id: number
  name: string
  score: number
}

type Detail = {
  name: string
  amount: number
  chapter?: string
  file_name: string
  result: Array<questionItem>
  student_attempts: Array<studentAttempt>
}

const route = useRoute()
const router = useRouter()
const questionStore = useQuestionStore()
const detail = ref<Detail>({
  name: '',
  amount: 0,
  file_name: '',
  result: [],
  student_attempts: []
})
const dialogWarning = ref<boolean>(false)
const dialogStudentAttempts = ref<boolean>(false)
const snackbar = ref<boolean>(false)

onMounted(() => {
  fetchData()
})

function fetchData() {
  questionStore.fetchQuestionId(route.params.id.toString())
    .then(res => detail.value = res.data)
}

function mapAnswer<T>(options: Array<T>, answer: 'A' | 'B' | 'C' | 'D' ): T {
  const list = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3
  }
  return options[list[answer]]
}

function deleteQuestion() {
  questionStore.removeQuestionById(route.params.id.toString())
    .then(() => {
      snackbar.value = true
      dialogWarning.value = false
      setTimeout(() => {
        router.push('/')
      }, 1000)
    })
}
</script>
<template>
  <v-row>
    <v-snackbar
        v-model="snackbar"
        :timeout="1000"
        color="success"
      >
        Question successfully deleted.
    </v-snackbar>
    <v-col>
      <UiTitleCard title="Detail" class-name="p-5 pt-5 rounded-md">
        <v-row class="justify-end">
          <v-btn color="error" @click="dialogWarning = true">Delete question</v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            Name
          </v-col>
          <v-col cols="12" md="10">
            : {{ detail.name }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            Chapter
          </v-col>
          <v-col cols="12" md="10">
            : {{ detail.chapter }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            Amount
          </v-col>
          <v-col cols="12" md="10">
            : {{  detail.amount }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            File
          </v-col>
          <v-col cols="12" md="10">
            : {{ detail.file_name }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <v-btn color="info" @click="dialogStudentAttempts = true">Student attempts</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <UiTitleCard title="Generated questions" class-name="p-5 pt-5 rounded-md">
              <v-row v-for="(item, index) in detail.result" :key="item.question" class="mb-2">
                <v-col cols="12">
                  <div class="font-weight-medium">{{ index + 1 }}. {{ item.question }}</div>
                </v-col>
                <v-col cols="12">
                  <v-radio-group disabled :model-value="mapAnswer<string>(item.options, item.answer)">
                    <v-radio v-for="option in item.options" :label="removeABCD(option)" :value="option" ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12">
                  <span class="font-weight-bold">Explanation</span>: {{ item.explanation }}
                </v-col>
              </v-row>
            </UiTitleCard>
          </v-col>
        </v-row>
      </UiTitleCard>
    </v-col>
  </v-row>
  <v-dialog v-model="dialogWarning" max-width="500">
    <v-card
      max-width="400"
      text="Are you sure want to delete this question?"
      title="Confirmation"
    >
      <template v-slot:actions>
        <v-btn
          color="info"
          text="Close"
          @click="dialogWarning = false"
        ></v-btn>
        <v-btn
          color="error"
          text="Delete"
          @click="deleteQuestion"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogStudentAttempts">
    <v-card
      title="Confirmation"
    >
    <v-card-text>
      <v-table class="bordered-table" hover density="comfortable">
        <thead>
          <tr>
            <th>Student name</th>
            <th>Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in detail.student_attempts" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.score }}</td>
            <td><router-link :to="{ name: 'QuestionExam', params: { id: item.id }}"><v-btn>See attempt</v-btn></router-link></td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
  </v-dialog>
</template>