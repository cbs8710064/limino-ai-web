<script setup lang='ts'>
import TheModal from '@/components/TheModal.vue';
import type { Ref } from 'vue';
import { ref, watch } from 'vue';
import { Pagination } from 'ant-design-vue'
import TheButton from '@/components/TheButton.vue';
import { useI18n } from 'vue-i18n';
const props = defineProps<{
  modelValue: boolean
}>()
const { t } = useI18n()

const emits = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
}>()

const show = ref(false)

watch(() => props.modelValue, (n) => {
  show.value = props.modelValue
  if (!n) {
    emits('update:modelValue', false)
  }
})
watch(() => show.value, n => {
  if (!n) {
    emits('update:modelValue', false)
  }
})
type MenuItem = {
  id: number,
  label: string,
  selected: boolean
}
const menuList: Ref<Array<MenuItem>> = ref([
  {
    label: 'Plans',
    id: 1,
    selected: true
  },
  {
    label: 'Token',
    id: 2,
    selected: false
  },
  {
    label: 'Usage History',
    id: 3,
    selected: false
  }
])
const currentMenuId = ref(1)
const handleChangeMenu = (e: MenuItem) => {
  menuList.value.forEach(item => {
    if (item.id == e.id) {
      item.selected = true
      currentMenuId.value = e.id
    } else {
      item.selected = false
    }
  })
}
</script>
<template>
  <div class="user-score-modal">
    <TheModal v-model="show" keyboard click-close has-mask>
      <div>
        <div class="score-modal-header px-4 py-4">
          <div class="flex">
            <div><i class="i-material-symbols-account-circle font-size-10"></i></div>
            <div class="ml-2">
              <div>Jason Chen <span class="rounded-full bg-#eee px-2 color-#999">{{ t('workbench.components.free') }}</span></div>
              <div class="color-gray">{{ t('workbench.components.freeDesc') }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <div class="score-btn mr-2">
              <i class="i-mingcute-diamond-2-line mr-2 font-size-6 color-#9f54ba"></i>
              1293
            </div>
            <TheButton type="primary" class="lh-10 h-10" rounded>
              <div>
                <i class="i-icon-park-outline-calendar mr-2"></i>
                <span class="font-size-4 font-bold">{{ t('workbench.components.claim') }}</span>
              </div>
            </TheButton>

          </div>
        </div>
        <div class="h-[max-content] flex">
          <div class="h-[max-content] flex">
            <div class="h-[max-content] bg-#eee w-40 h-100">
              <div @click.stop="handleChangeMenu(item)" v-for="item in menuList" :key="item.id" :class="`cursor-pointer  px-4 text-center color-#999 lh-12 ${item.selected ? 'bg-white color-black' : ''}`">{{ item.label }}</div>
            </div>
          </div>
          <div class="w-[max-content] flex justify-between px-2 w-160" v-if="currentMenuId === 1">
            <div class="starter">
              <div class="flex items-center justify-between">
                <div class="font-size-8 lh-14">{{ t('workbench.components.starter') }}</div>
                <div class="current">{{ t('workbench.components.current') }}</div>
              </div>
              <div class="flex items-center lh-8">
                <i class="i-ep-success-filled mr-2 color-#9f54ba"></i> {{ t('workbench.components.startTip1') }}
              </div>
              <div class="flex items-center lh-8">
                <i class="i-ep-success-filled mr-2 color-#9f54ba"></i> {{ t('workbench.components.startTip2') }}
              </div>
              <div class="flex items-center lh-8">
                <i class="i-ep-success-filled mr-2 color-#9f54ba"></i> {{ t('workbench.components.startTip3') }}
              </div>
              <div class="flex items-center lh-8">
                <i class="i-ep-success-filled mr-2 color-#9f54ba"></i> {{ t('workbench.components.startTip4') }}
              </div>
              <div class="flex items-center lh-8">
                <i class="i-ep-success-filled mr-2 color-#9f54ba"></i> {{ t('workbench.components.startTip5') }}
              </div>
              <div class="flex items-center lh-8">
                <i class="i-ep-success-filled mr-2 color-#9f54ba"></i> {{ t('workbench.components.startTip6') }}
              </div>
              <div class="mt-10 bg-#eee text-center font-size-5 color-#666 lh-10 rounded-2">{{ t('workbench.components.free') }}</div>
            </div>
            <div class="pro">
              <div class="font-size-8 color-white lh-14">{{ t('workbench.components.pro') }}</div>
              <div class="flex items-center color-white">
                <div class="flex items-start"><i class="i-ep-success-filled mr-2 color-white"></i></div>
                <div>{{ t('workbench.components.proTip1') }}</div>
              </div>
              <div class="flex items-center color-white">
                <div class="flex items-start h-10"><i class="i-ep-success-filled mr-2 color-white"></i></div>
                <div>{{ t('workbench.components.proTip2') }}</div>
              </div>
              <div class="flex items-center color-white">
                <div class="flex items-start"><i class="i-ep-success-filled mr-2 color-white"></i></div>
                <div>{{ t('workbench.components.proTip3') }}</div>
              </div>
              <TheButton class="mt-33 flex cursor-pointer items-center justify-center bg-black font-size-5 color-white font-bold lh-10 rounded-2">
                {{ t('workbench.components.proBtn') }}
              </TheButton>
            </div>
          </div>
          <div class="w-[max-content] px-3 w-160" v-if="currentMenuId === 2">
            <div class="px-4 font-size-6 font-bold">Current Mana: 1482 (sub mana: 0 )</div>
            <div class="flex justify-between">
              <div class="token-card start-card mx-4 flex-1">
                <div class="tit bg-#ccc color-#666">Starter</div>
                <div>
                  <div class="text-center font-size-6 font-bold">600 token</div>
                </div>
                <TheButton class="bg-black color-white">$3 USD</TheButton>
              </div>
              <div class="token-card pro-card mx-4 flex-1">
                <div class="tit bg-#9f54ba color-white">Pro (Additional 50% Token)</div>
                <div>
                  <div class="text-center font-size-6 color-white font-bold">600 token</div>
                </div>
                <TheButton class="bg-black color-white">$3 USD</TheButton>
              </div>
            </div>
          </div>
          <div class="w-[max-content] px-4 w-160" v-if="currentMenuId === 3">
            <div class="font-size-5">{{ t('workbench.components.history.tit') }}</div>
            <div class="scrollbar-small-y mt-4 max-h-70 overflow-hidden">
              <div class="reward-record flex justify-between px-4 lh-10" v-for="item in 10" :key="item">
                <div>{{ t('workbench.components.history.label') }}</div>
                <div class="color-#ccc">
                  2024/01/15/14:49PM</div>
                <div class="font-size-5">+99</div>
              </div>
            </div>
            <div class="mt-2 flex justify-end">
              <Pagination></Pagination>
            </div>
          </div>
        </div>
      </div>
    </TheModal>
  </div>
</template>
<style scoped lang='scss'>
.starter {
  --at-apply: rounded-2 mx-2 my-4 px-4 py-2 w-74;
  border: 2px solid #eee;
}

.pro {
  --at-apply: rounded-2 mx-2 my-4 px-4 py-2 w-74;

}

.current {
  border: 2px solid #333;
  --at-apply: rounded-full lh-6.8 h-8 px-3;
}

.score-modal-header {
  --at-apply: flex justify-between;
  border-bottom: 1px solid #eee;
}

.pro {
  background-color: #9f54ba;

}

.pro-card {
  background-color: #9f54ba;
}

.reward-record:nth-of-type(odd) {
  background: #f6f6f6;
}

.score-btn {
  border: 2px solid #eee;
  --at-apply: flex justify-center items-center lh-10 h-10 px-4 rounded-full;
}

.token-card {
  --at-apply: h-80 rounded-2 px-2 pb-2 flex flex-col justify-between;

  .tit {
    border-radius: 0 0 80px 80px;
    --at-apply: text-center lh-8;
  }
}

.start-card {
  border: 2px solid #ccc;
}

:deep() {
  .the-modal-component .the-modal {
    border-radius: 20px;
    width: 800px;
  }

  .the-modal-component .close-btn {
    top: -40px;
    right: -40px;

    i {
      color: #9f54ba;
    }

  }

  .the-modal-component .the-modal {
    padding: 0;
    overflow: hidden;
  }

  .the-modal-component .the-modal .the-modal-body {
    margin-top: 0;
  }

  .the-modal-component .the-modal .the-modal-body>div {
    margin-bottom: 0;
  }
}
</style>