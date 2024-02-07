<script setup>
    const { data: trainers } = await useTrainers();
</script>

<template>
  <div>
    <NuxtLink :to="`/`">TOPへ戻る</NuxtLink>
    <h1>つづきからはじめる</h1>
    <GamifyList>
      <GamifyItem v-for="trainer in trainers" :key="trainer">
        <NuxtLink :to="`/trainer/${trainer}`">{{ trainer }}</NuxtLink>
      </GamifyItem>
    </GamifyList>
  </div>
</template>