<script setup lang='ts'>
import TheNoData from '@/components/TheNoData.vue'
import { useI18n } from 'vue-i18n';
import { videoPath } from '../../../const/index';
import TheLoading from '@/components/TheLoading.vue';
import { ref, onMounted } from 'vue';
import TheModal from '@/components/TheModal.vue';
import { useRequest } from '../../../api/useRequest';
import type { Ref } from 'vue';
import { watch } from 'vue';
const { t } = useI18n()
const { getIndexList } = useRequest()
const loading = ref(false)
const showVideo = ref(false)
const currentVideo: Ref<ListItem> = ref({
  id: 0,
  cover: '',
  video: '',
  name: ''
})
type ListItem = {
  id: number;
  cover: string;
  video: string;
  name: string
}

const videoRef: Ref<HTMLVideoElement | null> = ref(null)
const handleModif = (e: ListItem) => {
  showVideo.value = true
  currentVideo.value = e
}
const list: Ref<Array<ListItem>> = ref([])
onMounted(async () => {
  try {
    loading.value = true
    const data = await getIndexList()
    list.value = data
  } finally {
    loading.value = false
  }
})

const showReplay = ref(false)
const videoLoading = ref(true)
const handleCanplay = () => {
  videoLoading.value = false
}
const handleEnded = () => {
  showReplay.value = true
}

const handleCloseModal = () => {
  videoLoading.value = true
  showReplay.value = false
}

const handlePlay = () => {
  if (videoRef.value) {
    showReplay.value = false
    videoRef.value.play()
  }
}

watch(() => showVideo.value, (n) => {
  showReplay.value = false
  if (!n) {
    videoLoading.value = true
  }
})
</script>
<template>
  <div class="scrollbar-small-y the-tab-library scrollbar-none max-h-auto p-2 lg:p-4">
    <TheLoading :loading="loading" class="min-h-60">
      <div v-if="list.length" class="flex flex-wrap">
        <div v-for="item in list" :key="item.id" class="story-card" @click="handleModif(item)">
          <div class="h-100%">
            <div class="h-100% flex items-center justify-center">
              <img v-if="item?.cover" class="h-100% w-100% object-cover" :src="`${videoPath}/${item.cover}`" alt="">
              <i v-else class="i-ic-round-photo-size-select-actual font-size-10 color-#ccc"></i>
            </div>
          </div>
          <div class="play-icon absolute left-50% top-50% z-10 ml--10 mt--10 color-white w-10 h-10 lg:opacity-0">
            <i class="i-material-symbols-play-circle font-size-20"></i>
          </div>
          <div class="name absolute bottom-0 left-0 rounded-t-1 text-center font-size-4 color-white font-bold lh-10 right-0 h-10">{{ item.name }}</div>
        </div>
      </div>
      <TheNoData v-else :message="t('home.noContent')" />
    </TheLoading>
    <TheModal v-model="showVideo" :has-mask="true" :has-close="true" keyboard @cancel="handleCloseModal" click-close lock-scroll>
      <TheLoading :loading="videoLoading" class="min-h-60 lg:min-h-120" v-show="videoLoading"></TheLoading>
      <div class="relative mb--2.5 px-2 lg:mb--4 lg:px-4" v-show="!videoLoading">
        <video class="videoEle w-100%" :controls="false" playsinline autoplay @canplay="handleCanplay" @ended="handleEnded" ref="videoRef">
          <source :src="`${videoPath}/${currentVideo.video}`" type="video/mp4">
        </video>
        <Transition name="fade">
          <div class="replay-box absolute bottom-0 left-0 left-50% top-50% ml--8 mt--8 rounded-full right-0 w-16 h-16" v-if="showReplay" @click="handlePlay">
            <div class="cursor-pointer p-2 w-16 h-16">
              <i class="i-ic-sharp-autorenew font-size-8"></i>
            </div>
          </div>
        </Transition>
      </div>
    </TheModal>
  </div>
</template>
<style scoped lang='scss'>
.videoEle::-webkit-media-controls {
  /* display: none !important; */
}

.videoEle::-webkit-media-controls-enclosure {
  /* display: none !important; */
}

.story-card {
  --at-apply: w-47% lg:w-23% h-70 lg:h-58 rounded-1 flex justify-center items-center mx-0 lg:mx-1% mb-2 lg:mb-5 cursor-pointer relative overflow-hidden;
  border: 1px solid #ccc;
  width: 100%;
  background-size: 200%;
  transition: ease .3s;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    backdrop-filter: saturate(20%) blur(10px);
    -webkit-backdrop-filter: saturate(20%) blur(10px);
    background: rgba(27, 27, 27, .3);
    opacity: 0;
    transition: opacity .6s;
    z-index: 1;
  }

  .play-icon {
    transition: ease .3s;
  }

  .name {
    background: rgba($color: #000000, $alpha: .7);
    transition: ease .3s;
    --at-apply: overflow-hidden text-ellipsis whitespace-nowrap;
  }

  &:hover {
    border-color: #9f54ba;
    box-shadow: 0 6px 12px 0 rgba(38, 38, 38, 0.08),
      0 4px 16px 0px rgba(41, 40, 40, 0.08),
      0 7px 15px 0 rgba(35, 35, 35, 0.08);


    &::before {
      opacity: 1;
    }

    .play-icon {
      opacity: 1;
    }

    .name {
      transform: translateY(100%);
    }

  }
}


.replay-box {
  /* background: linear-gradient(to bottom, rgba(71, 71, 71, 0) 0%, rgba(71, 71, 71, .5) 80%, rgba(71, 71, 71, 1) 100%); */
  background: rgba($color: #000000, $alpha: .6);

  i {
    color: #fff;
    --at-apply: w-12 h-12;
  }
}

.the-tab-library {
  :deep() {

    .the-modal-component .close-btn {
      top: -40px;
      right: -40px;

      i {
        color: #fff;
      }
    }

    .the-modal-component .the-modal {
      padding: 0;
      width: 800px;
      --at-apply: rounded-2;
    }

    .the-no-data {
      height: 280px;
    }

    @media screen and (max-width: 1024px) {
      .the-modal-component .close-btn {
        top: --30px;
        right: -14px;

        i {
          color: #fff;
        }
      }
    }
  }
}
</style>