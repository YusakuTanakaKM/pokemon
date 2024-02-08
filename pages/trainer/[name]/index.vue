<script setup>
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { data: trainer, refresh } = await useFetch(
  () => `/api/trainer/${route.params.name}`,
  {
    default: () => [],
    baseUrl: config.public.backendOrigin,
  },
);
// トレーナー削除ダイアログ＆削除処理
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
// ポケモン削除ダイアログ&削除処理
const {
  dialog: releaseDialog,
  onOpen: onOpenRelease,
  onClose: onCloseRelease,
} = useDialog();
const onRelease = async (pokemonId) => {
  const response = await fetch(
    `/api/trainer/${route.params.name}/pokemon/${pokemonId}`,
    {
      baseURL: config.public.backendOrigin,
      method: "DELETE",
    },
  ).catch((e) => e);
  if (response instanceof Error) return;
  await refresh();
  onCloseRelease();
};
// ポケモンニックネームダイアログ&処理
const {
  dialog: nicknameDialog,
  onOpen: onOpenNickname,
  onClose: onCloseNickname,
} = useDialog();
const nickname = ref("");
const onNickname = async (pokemon) => {
  const newTrainer = trainer.value;
  const index = newTrainer.pokemons.findIndex(({ id }) => id === pokemon.id);
  newTrainer.pokemons[index].nickname = trimAvoidCharacters(nickname.value);
  nickname.value = "";
  const response = await $fetch(`/api/trainer/${route.params.name}`, {
    baseURL: config.public.backendOrigin,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTrainer),
  }).catch((e) => e);
  if (response instanceof Error) return;
  await refresh();
  onCloseNickname();
};
const checkCharleng = computed(() => nickname.value.length > 0);
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
    <GamifyList>
      <GamifyItem v-for="pokemon in trainer.pokemons" :key="pokemon.id">
        <img :src="pokemon.sprites.front_default" />
        <span class="pokemon-name">{{ pokemon.nickname || pokemon.name }}</span>
        <GamifyButton @click="onOpenNickname(pokemon)">ニックネームをつける</GamifyButton>
        <GamifyButton @click="onOpenRelease(pokemon)">ポケモンと別れる</GamifyButton>
      </GamifyItem>
    </GamifyList>
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

    <GamifyDialog
      v-if="releaseDialog"
      id="confirm-release"
      title="確認"
      :description="`${releaseDialog.nickname || releaseDialog.name}と別れますか？`"
      @close="onCloseRelease"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onRelease(releaseDialog.id)">はい</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onCloseRelease">いいえ</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>

    <GamifyDialog
      v-if="nicknameDialog"
      id="confirm-nickname"
      title="ニックネーム"
      :description="`${nicknameDialog.name}へニックネームをつけてあげますか？`"
      @close="onCloseNickname"
    >
      <div class="item">
        <label for="name">ニックネーム</label>
        <input
          id="name"
          v-model="nickname"
          @keydown.enter="checkCharleng && onNickname(nicknameDialog)"
        />
      </div>
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton type="button" :disabled="!checkCharleng" @click="onNickname(nicknameDialog)">決定</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onCloseNickname">キャンセル</GamifyButton>
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
