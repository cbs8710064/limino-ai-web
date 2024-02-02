<script setup lang='ts'>
import TheButton from '@/components/TheButton.vue';
import type { Ref } from 'vue';
import { ref, unref, watch, onMounted, onUnmounted } from 'vue';
import { useMessage } from '../../hooks/useMessage';
import { useCreateStore } from '@/stores/useCreateStore';
import { useI18n } from 'vue-i18n';
import { useRequest } from '@/api/useRequest';
import img2 from '@/assets/images/home/anime.jpeg';
import img1 from '@/assets/images/home/real.png';
import StoryList from '@/views/workbench/components/StoryList.vue'
import { useStoryListStore, type StoryItem } from '@/stores/useStoryListStore';
import { useEventBus } from '../../hooks/useBus';
import router from '../../router/index';
import type { NewStoryParams } from '../../types/api';
import TheTelescoping from '@/components/TheTelescoping.vue';

const { eventBus } = useEventBus()
const { t } = useI18n()
const message = useMessage()
const { newStory } = useRequest()
const createStore = useCreateStore()
const storyListStore = useStoryListStore()

const handleAdd = async () => {
    const Form = document.getElementById('Form')
    if (Form) {
        Form.scrollIntoView({ behavior: 'smooth' })
    }
    storyStep.value = 1
    newStoryVal.value.name = ''
    newStoryVal.value.text = ''
    storyListStore.setStorySelected(-1)

}

const storyStep = ref(1)
const list: Ref<Array<{
    id: string
    url: string
    checked: boolean,
    desc: string
}>> = ref([{
    id: 'realistic',
    url: img1,
    checked: true,
    desc: t('home.realistic')
},
{
    id: 'anime',
    url: img2,
    checked: false,
    desc: t('home.anime')
}])

const handleChoose = (e: any) => {
    console.log(e)
    const { id } = e;
    list.value.forEach(item => {
        if (item.id === id) {
            item.checked = true
        } else {
            item.checked = false
        }
    })
}
const newStoryVal: Ref<NewStoryParams> = ref({
    name: '',
    author: '',
    style: '',
    text: ''
})
const checkStoryData = () => {
    const obj: any = unref(newStoryVal)
    const selectStyle = list.value.find(item => item.checked)
    if (!obj.name) {
        message.warning(t('warnMessage.enterStoryAuthor'))
        return false
    }
    if (!obj.author) {
        message.warning(t('warnMessage.enterStoryName'))
        return false
    }
    if (selectStyle) {
        obj.style = selectStyle.id
    } else {
        message.warning(t('warnMessage.chooseStyle'))
        return false
    }
    return true

}

const handleStoryChange = (e: StoryItem) => {
    if (!e.name || !e.author) {
        storyStep.value = 1
    } else {
        storyStep.value = 2
    }
}

onMounted(() => {
    storyListStore.getStoryList()

    eventBus.on('headerNextEvent', () => {
        const flag = checkStoryData()
        if (flag) {
            storyListStore.updateContentByStory(newStoryVal.value.text)
            router.push({ name: 'character' })
        }
    })
    createStore.setStep(1)

})

const addStoryLoading = ref(false)
const handleAddConfirm = async () => {
    if (!newStoryVal.value.name) {
        message.warning(t('warnMessage.enterStoryName'))
        return
    }
    if (!newStoryVal.value.text) {
        message.warning(t('warnMessage.enterStoryText'))
        return;
    }

    addStoryLoading.value = true
    const currentStyle = list.value.find(item => item.checked)
    if (currentStyle) {
        newStoryVal.value.style = currentStyle.id
    } else {
        message.warning(t('warnMessage.chooseStyle'))
    }
    try {
        const res = await newStory({ ...newStoryVal.value })
        await storyListStore.getStoryList()
        if (!res?.task?.error && res.id) {
            eventBus.emit('addStoryEvent', res.id)
            // router.push({
            //     name: 'cover'
            // })
            message.success(t('successMessage.createSuccess'))
        } else {
            message.error(t('errorMessage.createStoryFailed'))
        }
    } finally {
        addStoryLoading.value = false
    }
}

watch(() => storyListStore.selectedStory, (n) => {
    newStoryVal.value.text = n?.text || ''
}, {
    immediate: true,
    deep: true
})
onUnmounted(() => {
    eventBus.off('headerNextEvent')
    eventBus.off('storyListLoaded')
    if (storyListStore.list.length) {
        storyListStore.setStorySelected(storyListStore.list[0].id)
    }

})
</script>
<template>
    <div class="page-story lg:flex lg:justify-between">
        <TheTelescoping direction="right" width="190px" class="left-box">
            <div class="story-left w-100% lg:w-100%">
                <div class="mx-4 mt-4">
                    <TheButton type="border" className="lh-5 font-size-4 lg:lh-12" @click="handleAdd">
                        <i class="i-material-symbols-add-circle-rounded mr-1 hidden font-size-6 lg:mr-2 lg:block"></i> {{ t('workbench.views.story.newChapter') }}
                    </TheButton>
                </div>
                <StoryList hasBtns @change="handleStoryChange" />
            </div>
        </TheTelescoping>

        <div class="story-right scrollbar-small-y my-4 w-100% flex-grow-1 bg-white px-4 pb-2 rounded-2 lg:m-6 lg:px-4 lg:pb-0" id="Form">
            <div class="mt-2 lg:mt-4">
                <div name="1" icon="i-bi-pencil-fill">
                    <div class="mb-2" v-if="(storyStep === 1 || storyStep === 2) && !storyListStore.selectedStory">
                        <div v-if="storyStep === 1">
                            <div class="mt-4 lg:flex">
                                <div class="w-100% lg:w-60">
                                    <div class="font-size-4 font-bold">{{ t('home.pieceTit') }}</div>
                                    <input maxlength="64" type="text" v-model="newStoryVal.name" class="mt-2 w-100%" :placeholder="t('home.pieceIptPlaceholder')">
                                </div>
                            </div>
                            <div class="lh:lh-10 mb-2 mt-2 flex font-size-4 font-bold lh-8 lg:mt-4">
                                {{ t('workbench.views.story.storyText') }}
                            </div>
                            <textarea maxlength="1000" class="scrollbar-small-y h-35vh w-100% resize-none lg:h-42vh" v-model="newStoryVal.text" :placeholder="t('workbench.views.story.enterAstory')" name="" id="" cols="30"></textarea>
                            <div class="font-size-3 color-gray lg:font-size-3.3">{{ t('workbench.views.story.iptContent') }}</div>
                            <div class="mt-4 w-100% lg:max-w-100% lg:flex lg:justify-between">
                                <TheButton class="mb-4 lg:mb-0 lg:w-48%" type="border" @click="handleAddConfirm" :loading="addStoryLoading">{{ t('workbench.views.story.generateRoleStory') }}</TheButton>
                                <TheButton class="lg:w-48%" type="border">{{ t('workbench.views.story.generateStolyContent') }}</TheButton>
                            </div>
                        </div>
                    </div>
                    <div class="mb-2 lg:mb-6" v-else>
                        <div class="lh:lh-10 mt-2 flex font-bold lh-8 lg:mt-4">
                            {{ t('workbench.views.story.storyText') }}
                        </div>
                        <textarea readonly class="scrollbar-small-y h-35vh w-100% resize-none lg:h-42vh" v-model="newStoryVal.text" :placeholder="t('workbench.views.story.enterAstory')" name="" id="" cols="30"></textarea>
                    </div>
                    <div class="font-size-3 lg:mb-0 lg:font-size-4">{{ t('workbench.views.story.tip') }}</div>
                </div>
            </div>
        </div>
        <TheTelescoping direction="left" width="350px" class="right-box">
            <div>
                <div class="mt-4 px-4 font-size-4 font-bold">{{ t('home.chooseStyleTit') }}</div>
                <div class="scrollbar-small-y choose-list flex flex-wrap justify-evenly lg:max-h-50vh">
                    <div v-for="item in list" :key="item.id" @click="handleChoose(item)" :class="`style-card ${item.checked ? 'activite' : ''}`">
                        <i v-if="item.checked" class="i-icon-park-solid-success absolute top-0 font-size-5 color-#9f54ba right-2"></i>
                        <div class="style-card-bottom-bg absolute bottom-0 left-0 flex flex-col justify-end text-center color-black right-0 h-20">
                            <div class="font-size-4 font-bold lh-10">{{ item.desc }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </TheTelescoping>
    </div>
</template>
<style scoped lang='scss'>
.page-story {
    background-color: #f1f2f6;
}

:deep() {

    .story-list {
        max-height: calc(100vh - 7.7rem);
        border-right: 0;
    }
}

.story-left {
    height: calc(100vh - 3.5rem);
    --at-apply: pb-4;
}

.story-right {
    --at-apply: h-93vh;
}

.style-card {
    transition: ease .3s;
    border: 2px solid #ccc;
    --at-apply: cursor-pointer w-44% h-10 lg:w-35 lg:h-10 my-4 rounded-2 overflow-hidden relative;

    &.activite {
        border: 2px solid #9f54ba;
        box-shadow: 0 4px 10px 4px #c9a3d7;

    }

    .style-card-bottom-bg {
        /* background: linear-gradient(180deg, rgba(243, 176, 22, 0) 20%, rgba(0, 0, 0, .8) 100%); */
    }

}

@media screen and (max-width: 1024px) {

    .story-left,
    .story-right {
        width: 100%;
        box-sizing: border-box;
        max-height: inherit;
        height: auto;
    }

    .story-list {
        max-height: calc(100vh - 11rem);
        width: 100%;
    }

    :deep() {
        .left-box .the-telescoping-box {
            --at-apply: max-h-50;

            .h-100vh {
                height: 100%;
            }
        }

        .right-box .the-telescoping-box {
            --at-apply: min-h-40 h-auto;
        }

        .story-list {
            --at-apply: flex max-h-40 flex-row w-100%;

            .post-item {
                --at-apply: min-w-28 mr-2 max-w-28;
            }
        }
    }

}
</style>