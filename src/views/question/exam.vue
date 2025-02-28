<script lang="ts" setup>
import UiTitleCard from '@/components/shared/UiTitleCard.vue';
import { useAuthStore } from '@/stores/auth';
import { useExamStore } from '@/stores/exam';
import { useQuestionStore } from '@/stores/question';
import { removeABCD } from '@/utils/helpers/formatter';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

type questionItem = {
  question: string
  options: Array<string>
  user_answer: string
  answer: string
  explanation: string
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const examStore = useExamStore()
const questions = ref<Array<questionItem>>([])
const examAt = ref<any>('')
const finalScore = ref<number>(0)
const dialogWarning = ref<boolean>(false)
const snackbar = ref<boolean>(false)
const isAnswerComplete = computed(() => {
  return questions.value.every(question => !!question.user_answer)
})
const isExamTaken = computed(() => {
  return !!examAt.value
})

onMounted(() => {
  fetchData()
})

function fetchData() {
  const fetchFunc = authStore.currentUser.username === "teacher" ? examStore.fetchExamByid : examStore.takeExamByQuestionId
  fetchFunc(route.params.id.toString())
    .then(res => {
      questions.value = res.data.questions
      examAt.value = res.data.exam_at
      finalScore.value = res.data.score
    })
}

function getValFromAnswerOption(options: Array<string>, optionVal: string): string {
  const possibleAnswer = ['A', 'B', 'C', 'D']
  return possibleAnswer[options.findIndex((option) => option === optionVal)]
}

function submit() {
  examStore.submitExam({
    id: parseInt(route.params.id.toString()),
    submissions: questions.value
  })
    .then(() => {
      snackbar.value = true
      setTimeout(() => {
        router.go(0)
      }, 2000)
    })
}

</script>
<template>
  <v-row>
    <v-snackbar
        v-model="snackbar"
        :timeout="2000"
        color="success"
      >
        Exam successfully submitted.
    </v-snackbar>
    <v-col>
      <UiTitleCard title="Generated questions" class-name="p-5 pt-5 rounded-md">
        <v-row v-if="isExamTaken">
          <v-col>
            Final score: <span :class="{ 'text-success': finalScore >= 70, 'text-error': finalScore < 70}" class="font-weight-bold">{{  finalScore }}</span>
          </v-col>
        </v-row>
        <v-row v-for="(item, index) in questions" :key="item.question" class="mb-2">
          <v-col cols="12">
            <div class="font-weight-medium">{{ index + 1 }}. {{ item.question }}</div>
          </v-col>
          <v-col cols="12">
            <v-radio-group v-model="item.user_answer" :disabled="isExamTaken">
              <v-radio v-for="option in item.options" :class="{ 'bg-success': isExamTaken && getValFromAnswerOption(item.options, option) === item.answer, 'bg-error': isExamTaken && getValFromAnswerOption(item.options, option) !== item.answer && item.user_answer ===  getValFromAnswerOption(item.options, option)}" :label="removeABCD(option)" :value="getValFromAnswerOption(item.options, option)" ></v-radio>
            </v-radio-group>
          </v-col>
          <v-col v-if="isExamTaken" cols="12">
            <div v-if="item.answer === item.user_answer" class="text-success font-weight-bold">Correct</div>
            <div v-else class="text-error font-weight-bold">Wrong</div>
            <span v-if="isExamTaken" class="font-weight-bold">Explanation</span>: {{ item.explanation }}
          </v-col>
        </v-row>
        <v-row class="justify-end actions mr-5 mb-1">
          <v-btn color="lightText" variant="outlined" class="mr-2" @click="router.back()">Back</v-btn>
          <v-btn v-if="!isExamTaken" :disabled="!isAnswerComplete" color="success" @click="dialogWarning = true">Submit</v-btn>
        </v-row>
      </UiTitleCard>
    </v-col>
  </v-row>
  <v-dialog v-model="dialogWarning" max-width="500">
    <v-card
      max-width="400"
      text="Are you sure want to submit this exam?"
      title="Confirmation"
    >
      <template v-slot:actions>
        <v-btn
          color="info"
          text="Close"
          @click="dialogWarning = false"
        ></v-btn>
        <v-btn
          color="success"
          text="Submit"
          @click="submit()"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.actions {
  position: sticky;
  bottom: 12px;

}
.right-answer {
  background-color: green;
}
</style>