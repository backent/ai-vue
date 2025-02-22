<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue';

import UiTitleCard from '@/components/shared/UiTitleCard.vue';
import { useQuestionStore } from '@/stores/question';

const questionStore = useQuestionStore()
const list = ref<any>([])

onMounted(() => {
  questionStore.fetchAllQuestion()
    .then(res => {
      list.value = res.data
    })
})

const projects = shallowRef([
  {
    id: 4,
    name: "Materi kelas xii",
  }
]);
</script>

<template>
  <UiTitleCard title="Question list" class-name="px-0 pb-0 rounded-md">
    <div class="d-flex justify-end mr-3 my-3">
      <router-link :to="{ name: 'QuestionFormCreate' }"><v-btn color="info">+ Create</v-btn></router-link>
    </div>
    <v-table class="bordered-table" hover density="comfortable">
      <thead class="bg-containerBg">
        <tr>
          <th class="text-left text-caption font-weight-bold text-uppercase">no.</th>
          <th class="text-left text-caption font-weight-bold text-uppercase">name</th>
          <th class="text-left text-caption font-weight-bold text-uppercase">action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" :key="item.id">
          <td>{{ index + 1 }}.</td>
          <td>{{ item.name }}</td>
          <td><RouterLink :to="{ name: 'QuestionDetail', params: { id: item.id } } " class="text-secondary link-hover">See detail</RouterLink></td>
        </tr>
      </tbody>
    </v-table>
  </UiTitleCard>
</template>
