<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import ThePrePareModal from './components/ThePrePareModal.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import TheModal from '@/components/TheModal.vue';
import TheTabs from '@/components/TheTabs.vue';
import TheTabLibrary from '@/views/home/components/TheTabLibrary.vue'
import TheFooter from '@/components/TheFooter.vue';
import { version } from '../../const/index';

const { t } = useI18n()
const addModal = ref(false)


</script>

<template>
  <TheHeader hasBackground />

  <div class="home-view pt-14">
    <div class="w-100% px-4 lg:px-10">
      <div class="max-w-100% flex justify-center">
        <div class="w-100%">
          <div class="big-desc mt-4 max-w-100% text-center font-size-4 font-bold lh-6 lg:mt-10 lg:font-size-6 lg:lh-10">{{ t('home.title') }}</div>
        </div>
        <div></div>
      </div>
      <div>
        <div class="m-auto mt-10 max-w-100% min-h-70 bg-white rounded-3 lg:max-w-80vw lg:rounded-5">
          <div class="home-tabs">
            <TheTabs>
              <div :title="t('home.community')" name="1" icon="i-tabler-building-community">
                <TheTabLibrary />
              </div>
            </TheTabs>
          </div>
        </div>
      </div>
      <!-- <TheFooter /> -->
      <!-- <div class="mt-5 block bg-transparent pb-2 text-center color-#ccc">v{{ version }}</div> -->

    </div>


    <TheModal v-model="addModal" className="rounded-4 mt-0" keyboard click-close has-mask>
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
      --at-apply: lh-9 font-size-4;
    }
  }
}

.home-view {
  background: linear-gradient(120deg, #9f54ba 50%, rgb(245, 244, 235) 50%, rgb(245, 244, 235) 100%);
  min-height: 100vh;


}

.big-desc {
  color: #fff;
  text-shadow: 2px 4px 8px rgb(53, 52, 52);
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
