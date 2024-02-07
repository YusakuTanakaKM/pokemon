<script setup>
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { data: trainer } = await useFetch(
  () => `/api/trainer/${route.params.name}`,
  {
    default: () => [],
    baseUrl: config.public.backendOrigin,
  },
);
const {
  dialog: deleteDialog,
  onOpen: onOpenDelete,
  onClose: onCloseDelete,
} = useDialog();

const onTrainerDelete = async () => {
  const response = await $fetch(`/api/trainer/${route.params.name}`, {
    baseURL: config.public.backendOrigin,
    method: "DELETE",
  }).catch((err) => err);
  if (response instanceof Error) {
    onCloseDelete();
    return;
  }
  router.push("/");  
};

</script>

<template>
  <div>
    <NuxtLink :to="`/`">TOPへ戻る</NuxtLink>
    <h1>トレーナー情報</h1>
    <div class="trainer-info">
      <img src="/avatar.png" />
      <span>{{ trainer.name }}</span>
    </div>
    <GamifyButton @click="onOpenDelete(true)">トレーナーを引退してマサラタウンに帰る</GamifyButton>
    <h2>手持ちポケモン</h2>
    <CatchButton :to="`/trainer/${route.params.name}/catch`">ポケモンを捕まえに行く</CatchButton>

    <GamifyDialog
      v-if="deleteDialog"
      id="confirm-delete"
      title="本気で引退するんですか？"
      description="引退するなら全てのポケモンとトレーナー登録を破棄することになるが本当に良いですか？"
      @close="onCloseDelete"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onTrainerDelete">はい</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onCloseDelete">いいえ</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>

  </div>
</template>

<style scoped>
.item > label {
  display: block;
  margin-bottom: 0.25rem;
}

.gamify-item:hover img {
  animation: bounce;
  animation-duration: 0.8s;
  animation-iteration-count: infinite;
}

.trainer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.trainer-info > img {
  width: 3rem;
  height: 3rem;
}
</style>
