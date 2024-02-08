<script setup>
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const page = ref(0);
const limit = ref(20);
const offset = computed(() => page.value * limit.value);
const { data: pokemons, refresh } = await useFetch(
  () =>
    `https://pokeapi.co/api/v2/pokemon?offset=${offset.value}&limit=${limit.value}`,
  {
    default: () => [],
  },
);
const hasPrev = computed(() => page.value > 0);
const maxPage = computed(() => Math.floor(pokemons.value.count / limit.value));
const hasNext = computed(() => page.value < maxPage.value);
const onPrev = async () => {
  page.value--;
  await refresh();
};
const onNext = async () => {
  page.value++;
  await refresh();
};
const { dialog, onOpen, onClose } = useDialog();
const onCatch = async (pokemon) => {
  const response = await $fetch(`/api/trainer/${route.params.name}/pokemon`, {
    baseURL: config.public.backendOrigin,
    method: "POST",
    body: {
      name: pokemon.name,
    },
  }).catch((e) => e);
  if (response instanceof Error) return;
  router.push(`/trainer/${route.params.name}`);
};
</script>

<template>
  <div>
    <NuxtLink :to="`/trainer/${route.params.name}`">もどる</NuxtLink>
    <h1>ポケモンをつかまえる</h1>
    <p>{{ pokemons.count }} しゅるいのポケモン</p>
    <p>{{ page + 1 }} / {{ maxPage + 1 }} ページ</p>
    <GamifyList>
      <GamifyItem v-for="pokemon in pokemons.results" :key="pokemon.url">
        <span class="pokemon-name">{{ pokemon.name }}</span>
        <GamifyButton @click="onOpen(pokemon)">つかまえる</GamifyButton>
      </GamifyItem>
    </GamifyList>
    <GamifyDialog
      v-if="dialog"
      id="confirm-catch"
      title="確認"
      :description="`${dialog.name}を捕まえますか？`"
      @close="onClose"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onCatch(dialog)">はい</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onClose">いいえ</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>    
    <GamifyList direction="horizon">
      <GamifyItem>
        <GamifyButton :disabled="!hasPrev" @click="onPrev">まえへ</GamifyButton>
      </GamifyItem>
      <GamifyItem>
        <GamifyButton :disabled="!hasNext" @click="onNext">つぎへ</GamifyButton>
      </GamifyItem>
    </GamifyList>
  </div>
</template>
