
<script setup lang='ts'>
import { ref, type Ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import TheButton from '@/components/TheButton.vue';
import { useI18n } from 'vue-i18n';
import TheStyleList from './TheStyleList.vue';
import { unref } from 'vue';
import { useMessage } from '../../../hooks/useMessage';
import type { StyleItem } from '../../../stores/useStylelistStore';

const router = useRouter()
const { t } = useI18n()



const message = useMessage()
type PieceItem = {
  name: string
  author: string
  style: string | number
}
const piece: PieceItem = reactive({
  name: '',
  author: '',
  style: ''
})

const selectStyle: Ref<StyleItem | null> = ref(null)
const nextLoading = ref(false)
const handleNext = async () => {
  const obj: any = unref(piece)
  if (!obj.name) {
    message.warning(t('warnMessage.enterStoryName'))
    return
  }
  if (!obj.author) {
    message.warning(t('warnMessage.enterStoryAuthor'))
    return
  }
  if (selectStyle.value) {
    obj.style = selectStyle.value.id
  } else {
    message.warning(t('warnMessage.chooseStyle'))
    return
  }
  nextLoading.value = true
  // try {
  //   const {id} = await newPiece(obj)
  //   router.push({name:'story',query:{id}})
  // } finally{
  //   nextLoading.value = false
  // }
  router.push({ name: 'story', query: obj })
}

const changeStyle = (e: StyleItem) => {
  console.log(e)
  selectStyle.value = e
}
</script>
<template>
  <div class="the-prepare-modal">
    <div class="prepare-header flex items-center justify-between px-4 py-5 lg:px-8">
      <div class="font-size-4 font-bold lg:font-size-6">{{ t('home.selectStyle') }}</div>
      <TheButton type="primary" @click="handleNext" :loading="nextLoading">{{ t('workbench.views.next') }}</TheButton>
    </div>
    <div class="form-box mt-4 flex justify-between px-4 lg:px-8">
      <div class="flex-1">
        <div class="mb-2 font-size-4 font-bold lg:font-size-5">{{ t('home.pieceTit') }}</div>
        <div>
          <input type="text" v-model="piece.name" class="w-100%" :placeholder="t('home.pieceIptPlaceholder')">
        </div>
      </div>
      <div class="ml-10 flex-1">
        <div class="mb-2 font-size-4 font-bold lg:font-size-5">{{ t('home.creator') }}</div>
        <div>
          <input type="text" v-model="piece.author" class="w-100%" :placeholder="t('home.authorNamePlaceholder')">
        </div>
      </div>
    </div>
    <div class="choose-style mt-4 px-2 lg:px-4 lg:px-8">
      <div class="choose-list scrollbar-small-y">
        <TheStyleList class="styles-box" @change="changeStyle"></TheStyleList>
      </div>
    </div>
  </div>
</template>
<style scoped lang='scss'>
.the-prepare-modal {
  .prepare-header {
    border-bottom: 1px solid #eee;
  }


  @media screen and (max-width: 1024px) {
    :deep() {
      .styles-box {
        .choose-list {
          --at-apply: justify-evenly;
        }
      }
    }
  }
}
</style>