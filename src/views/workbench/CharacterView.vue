<script setup lang='ts'>
import TheTelescoping from '@/components/TheTelescoping.vue';
import { useCreateStore } from '@/stores/useCreateStore';
import { ref, watch, onMounted, onUnmounted } from 'vue';
import TheButton from '@/components/TheButton.vue';
import { useI18n } from 'vue-i18n';
import StoryList from '@/views/workbench/components/StoryList.vue'
import { useEventBus } from '../../hooks/useBus';
import { Image, Progress } from 'ant-design-vue'
import router from '../../router/index';
import { useStoryListStore, type StoryItem } from '../../stores/useStoryListStore';
import { storeToRefs } from 'pinia';
import { useRequest } from '../../api/useRequest';
import { useMessage } from '../../hooks/useMessage';
import { videoPath } from '../../const/index';
import { useTaskStore } from '../../stores/useTaskStore';
const taskStore = useTaskStore()
const { eventBus } = useEventBus()

const message = useMessage()
const { updateRoleByPrompt } = useRequest()
const { t } = useI18n()
const storyListStore = useStoryListStore()
const { selectStoryRole } = storeToRefs(storyListStore)
const createStore = useCreateStore()
onMounted(() => {
    createStore.setStep(3)
    eventBus.on('headerNextEvent', () => {
        router.push({ name: 'paragraph' })
    })
    taskStore.loopTasks(2, 'gen_role')
})
onUnmounted(() => {
    eventBus.off('headerNextEvent')
    taskStore.clearLoop()
})

const rolePrompt = ref('')
const updateRoleLoading = ref(false)
const handleCreateCharacter = async () => {
    if (!rolePrompt.value) {
        message.warning(t('warnMessage.enterRolePrompt'))
        return
    }
    updateRoleLoading.value = true
    try {
        const res = storyListStore.getSelectedIdAndIdx()
        const { id, idx } = res
        if (id && idx > -1) {
            const res = await updateRoleByPrompt(Number(id), idx, rolePrompt.value)
            taskStore.loopTasks(2, 'gen_role')
            if (res.error) {
                message.warning(t('warnMessage.hasQueueWorking'))
                return
            } else {
                message.success(t('successMessage.roleUpdateSuccess'))
            }
        } else {
            message.warning(t('warnMessage.chooseRole'))
        }
    } finally {
        updateRoleLoading.value = false
    }
}

const handleChangeStory = (e: StoryItem) => {
    const { id } = e
    storyListStore.selectRoleByStoryId(Number(id), 0)
    if (e.roles && e.roles.length) {
        rolePrompt.value = e.roles[0].prompts
    }
}

const handleChangeRole = (e: any) => {
    if (e.selected) {
        return
    }
    const { idx, prompts } = e
    storyListStore.selectRoleByStoryId(Number(storyListStore.selectedStory?.id), idx)
    rolePrompt.value = prompts
}

let flag = false
watch(() => storyListStore.selectStoryRole, n => {
    if (n) {
        if (!flag) {
            rolePrompt.value = n.prompts
            flag = true
        }
    }
}, {
    deep: true
})

</script>
<template>
    <div class="h-93.5vh lg:flex">
        <TheTelescoping direction="right" width="380px" class="left-box">
            <div class="h-auto pb-2 lg:h-100vh lg:flex lg:pb-0">
                <StoryList @change="handleChangeStory" />
                <div class="scrollbar-small-x lg:scrollbar-small-y character-list px-2 lg:px-4" v-if="storyListStore?.selectedStory?.roles && storyListStore?.selectedStory?.roles.length">
                    <div @click="handleChangeRole({ ...item, idx })" :class="`character-card ${item.selected ? 'active' : ''}`" v-for="(item, idx) in storyListStore?.selectedStory?.roles" :key="idx">
                        <div class="character-card-img">
                            <div class="w-100%" v-if="item.image">
                                <Image loading="lazy" :src="`${videoPath}/${item.image}`" :preview="false" class="object-contain w-20 rounded-1 lg:w-100%" width="100%" height="4.5rem lg:10rem"></Image>
                                <!-- <img :src="`${videoPath}/${item.image}`" class="object-contain w-20 rounded-1 lg:w-100%" alt=""> -->
                            </div>
                            <div class="flex items-center justify-center h-39" v-else>
                                <i class="i-svg-spinners-ring-resize font-size-8 color-#1677ff"></i>
                            </div>
                        </div>
                        <div class="px-1 font-size-3 lh-6 lg:font-size-3.5 lg:lh-9">{{ item.name }}</div>
                    </div>
                </div>
                <div v-else class="h-100% w-100% p-4 text-center font-size-4 color-#ccc lg:text-left">
                    {{ t('home.noContent') }}
                </div>
            </div>
        </TheTelescoping>
        <div class="con scrollbar-small-y w-100% px-4 py-4 lg:h-93vh lg:px-10 lg:py-10">
            <div class="h-100% w-100% flex items-center justify-center">
                <div :class="`relative w-100% flex items-center rounded-1 justify-center px-2 h-140 ${selectStoryRole?.image && !taskStore.tasks.gen_role ? 'bg-mask' : 'bg-white'}`">
                    <img v-if="!taskStore.tasks.gen_role && selectStoryRole?.image" :src="`${videoPath}/${selectStoryRole?.image}`" class="w-100% object-contain h-140 rounded-1" alt="">
                    <div v-else class="flex items-center justify-center h-140">
                        <Progress v-if="taskStore.tasks.gen_role" type="circle" :percent="taskStore.tasks.gen_role?.percent">
                            <template #format>
                                <div>
                                    <div class="font-size-4 color-#9f54ba" v-if="taskStore.tasks.gen_role.status === 1">
                                        <div class="text-center">{{ t('common.queuing') }}</div>
                                        <div class="text-center">{{ t("common.hasQueueNum", { number: taskStore.tasks.gen_role.queue }) }}</div>
                                    </div>
                                    <div v-else class="text-center">{{ taskStore.tasks.gen_role.percent }}%</div>
                                </div>
                            </template>
                        </Progress>
                        <div v-else class="flex items-center justify-center px-15 h-140">
                            <TheNoData />
                            <!-- <img src="@/assets/images/placeholders/play.svg" class="w-100% object-contain h-100% rounded-1" alt=""> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <TheTelescoping direction="left" width="300px" class="ipt-box">
            <div class="h-100vh px-4 lg:px-6">
                <!-- <div class="mt-4 font-size-5 font-bold lh-10">{{ t('workbench.views.character.character') }}</div> -->
                <div class="mt-2 font-bold lh-10">{{ t('workbench.views.character.name') }}</div>
                <div><input type="text" readonly :value="selectStoryRole?.name" :placeholder="t('workbench.views.character.character')"></div>
                <div class="mt-2 font-bold lh-10">{{ t('workbench.views.character.prompt') }}</div>
                <div>
                    <textarea v-model="rolePrompt" class="w-100% resize-none" rows="10" maxlength="256" :placeholder="t('workbench.views.character.placeholderIpt')"></textarea>
                </div>
                <div>
                    <TheButton class="mt-4 bg-#000 bg-black color-white lh-10 h-10" :loading="updateRoleLoading" @click="handleCreateCharacter">
                        {{ t('workbench.views.character.generate') }}(
                        <i class="i-mingcute-diamond-2-line font-size-4 color-#9f54ba lg:font-size-6"></i>
                        3)
                    </TheButton>
                </div>
            </div>
        </TheTelescoping>
    </div>
</template>
<style scoped lang='scss'>
.con {
    background-color: #f1f2f6;
}

.character-card {
    border: 2px solid transparent;

    &.active {
        border-color: #9f54ba;
    }

    --at-apply:pt-1 h-51 w-100% rounded-1 rounded-3 bg-#eee lg:mb-4 cursor-pointer;

    &-img {
        --at-apply: flex items-center justify-center overflow-hidden rounded-2 mx-1 bg-white;

        img {
            height: 160px;
        }
    }
}

.bg-mask {
    transition: ease .3s;
    width: 100%;
    background: radial-gradient(rgb(145, 143, 143), transparent);
}

.character-list {
    max-height: calc(100vh - 3.5rem);
    --at-apply: pt-4 w-47.5;
}

@media screen and (max-width: 1024px) {
    .character-list {
        --at-apply: w-100% flex h-40 pb-2;
    }

    .character-card {
        border: 2px solid transparent;
        --at-apply: pt-1 h-30 w-22 rounded-1 bg-#eee mb-0 cursor-pointer mr-2;

        &-img {
            --at-apply: flex items-center justify-center overflow-hidden rounded-1 mx-1 bg-white w-19 h-22;

            img {
                --at-apply: h-22;
            }
        }
    }

    :deep() {
        .ipt-box .the-telescoping-box {
            --at-apply: h-130;

            .h-100vh {
                height: 100%;
            }
        }

        .left-box .the-telescoping-box {
            --at-apply: h-76;

            .h-100vh {
                height: 100%;
            }
        }

        .story-list {
            --at-apply: flex h-40 flex-row w-100%;

            .post-item {
                --at-apply: min-w-28 mr-2;
            }
        }


    }
}
</style>