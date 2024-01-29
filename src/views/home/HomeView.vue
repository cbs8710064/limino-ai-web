<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import ThePrePareModal from './components/ThePrePareModal.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import TheModal from '@/components/TheModal.vue';
import TheTabs from '@/components/TheTabs.vue';
import TheTabLibrary from '@/views/home/components/TheTabLibrary.vue'
import TheFooter from '@/components/TheFooter.vue';
import { useRouter } from 'vue-router';
const { t } = useI18n()
const addModal = ref(false)
const router = useRouter()
const handleAdd = () => {
  // addModal.value = true
  router.replace({
    name: 'story'
  })
}


</script>

<template>
  <TheHeader hasBackground />

  <div class="home-view pt-30">
    <div class="w-100% px-4 lg:px-10">
      <div class="max-w-100%">
        <div class="lg:max-w-55vw">
          <div class="big-desc max-w-100% text-center font-size-5 font-bold lh-6 lg:max-w-220 lg:text-left lg:font-size-8 lg:lh-14">{{ t('home.title') }}</div>
          <div class="small-desc mt-14 max-w-100% text-center font-size-3.5 lh-5 lg:mt-8 lg:max-w-100 lg:text-left lg:font-size-4">{{ t('home.smallTitle') }}
          </div>
        </div>
        <div></div>
      </div>
      <div>
        <div class="mt-10 flex items-center justify-center lg:mt--10">
          <div @click="handleAdd" class="create-btn">{{ t('home.startBtn') }}</div>
        </div>
        <div class="m-auto mt-10 max-w-100% min-h-95 bg-white rounded-5 lg:max-w-80vw">
          <div class="home-tabs">
            <TheTabs>
              <div :title="t('home.yourPieces')" name="1" icon="i-el-torso">
                <TheTabLibrary />
              </div>
            </TheTabs>
          </div>

        </div>
      </div>
      <TheFooter />
    </div>


    <TheModal v-model="addModal" className="rounded-4 mt-0" keyboard click-close>
      <ThePrePareModal />
    </TheModal>

  </div>
</template>

<style scoped lang="scss">
.home-tabs {
  :deep() {
    .the-tabs .the-tabs-header {
      padding: 0 20px;
    }

    .the-tabs .tab div {
      font-weight: bold;
      color: #9f54ba;
    }

    .the-tabs .tab.activite div {
      color: #9f54ba;
    }

    .the-tab-text {
      line-height: 50px;
    }
  }
}

.home-view {
  background: linear-gradient(120deg, #9f54ba 50%, rgb(245, 244, 235) 50%, rgb(245, 244, 235) 100%);
  min-height: 100vh;

  :deep() {
    .the-modal-component .the-modal {
      padding: 0;
      width: 1000px;
      --at-apply: rounded-2 lg:rounded-4;
    }

    .the-modal-component .close-btn {
      top: -40px;
      right: -40px;

      i {
        color: #9f54ba;
      }
    }

    .the-modal-component .the-modal .the-modal-body {
      margin-top: 0;
    }
  }
}

.big-desc {
  color: #fff;
}

.small-desc {
  color: #fff;
}

.create-btn {
  background: linear-gradient(90deg, #cf89ea 0%, #9f54ba 100%);
  box-shadow: 0 4px 10px #b9975275;
  font-weight: 500;
  --at-apply: flex cursor-pointer items-center justify-center rounded-full font-size-4 lg:font-size-5.5 color-white font-bold lh-13 w-34 h-10 lg:w-58 lg:h-13;

}

@media screen and (max-width: 1000px) {
  .home-view {
    background: linear-gradient(150deg, #9f54ba 50%, rgb(245, 242, 235) 50%, rgb(245, 242, 235) 100%);
  }

  .home-tabs {
    :deep() {
      .the-tabs .the-tabs-header {
        padding: 0 10px;
      }
    }
  }

}
</style>
