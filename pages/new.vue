<script setup>
import GamifyButton from '~/components/GamifyButton.vue';
import GamifyDialog from '~/components/GamifyDialog.vue';
import GamifyItem from '~/components/GamifyItem.vue';
import GamifyList from '~/components/GamifyList.vue';
import useDialog from '~/composables/useDialog';
import trimAvoidCharacters from '~/utils/trimAvoidCharacters';

const trainerName = ref("");
const { dialog, onOpen, onClose } = useDialog();
const transTrainerName = computed(() => trimAvoidCharacters(trainerName.value));
const checkCharleng = computed(() => transTrainerName.value.length > 0);

const router = useRouter();
const config = useRuntimeConfig();
const onNewTrainer = async()=>{
  const response = await $fetch("/api/trainer",{
    baseURL: config.public.backendOrigin,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: transTrainerName.value,
    }),
  }).catch((err) => err);
  if(response instanceof Error) {
    onClose();
    return;
  }
  router.push(`/trainer/${transTrainerName.value}`);
};

</script>


<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <p>こんにちは！新しいトレーナーさん！あなたの名前を教えてもらえますか？</p>
    <form @submit.prevent>
      <div class="item">
        <label for="name">
          なまえ
          <span id="slimname">
            ※一部の文字はこの世界では使えないので勝手に取り除きます!
          </span>
        </label>
        <input
          id="name"
          v-model="trainerName"
          @keydown.enter="checkCharleng && onOpen(true)"
        >
      </div>
      <GamifyButton type="button" :disabled="!checkCharleng" @click="onOpen(true)">
        決定
      </GamifyButton>
    </form>
    <GamifyDialog
      v-if="dialog"
      id="confirm-newname"
      title="確認です"
      :description="`「${transTrainerName}」さんですね？`"
      @close="onClose"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onNewTrainer">はい</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onClose">いいえ</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>
  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form > :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item > label,
.item > span {
  display: block;
  margin-bottom: 0.25rem;
}
.item > span {
  font-size: 0.875rem;
}
</style>
