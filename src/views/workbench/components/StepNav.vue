<script setup lang='ts'>
import { useCreateStore } from '@/stores/useCreateStore';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useScroll from '../../../hooks/useScroll';
import { ref } from 'vue';
const router = useRouter()
const { t } = useI18n()
defineProps<{
    step: number
}>()

const createStore = useCreateStore()

const handleNext = (step: number, routeName: string) => {
    createStore.setStep(step)
    router.push({ name: routeName })
}

const fixedClass = ref('')
const scrollUpClass = ref('')
useScroll(({ top, direction }) => {
    if (top > 4) {
        fixedClass.value !== 'fixed-style' ? fixedClass.value = 'fixed-style' : ''
    } else {
        fixedClass.value !== '' ? fixedClass.value = '' : ''
    }
    scrollUpClass.value = direction === 'up' ? 'up-class' : ''
}, 10)
</script>
<template>
    <div :class="`step-nav flex justify-between px-2 px-2 h-16 lg:h-auto lg:flex-row lg:flex-col lg:justify-start lg:px-0 ${fixedClass} ${scrollUpClass}`">
        <RouterLink to="/" class="flex items-center justify-center">
            <div class="brand-tit text-center font-size-4 color-white font-bold lg:mb-10 lg:pt-10">{{ t('workbench.brandTit') }}</div>
        </RouterLink>
        <div class="step-list flex pt-2 color-white lg:block lg:min-h-90vh lg:py-5 lg:pt-0">
            <div :class="`story step-card relative ${!step || step === 1 ? 'active' : ''}`" @click="handleNext(1, 'story')">
                <div class="story-con">
                    <div class="icon">
                        <i class="i-ri-edit-2-fill font-size-8"></i>
                    </div>
                </div>
                <div class="text">{{ t('workbench.components.step.story') }}</div>
                <div v-if="!step || step === 1" class="arraw-right absolute top-0 hidden right-0 lg:block"></div>
            </div>
            <div class="row-line flex justify-center">
                <div class="my-2 ml--1 w-1 h-10 rounded-1"></div>
            </div>
            <div :class="`story step-card relative ${!step || step === 2 ? 'active' : ''}`" @click="handleNext(2, 'cover')">
                <div class="story-con">
                    <div class="icon">
                        <i class="i-game-icons-book-cover font-size-8"></i>
                    </div>
                </div>
                <div class="text">{{ t('workbench.views.cover.pageTit') }}</div>
                <div v-if="!step || step === 2" class="arraw-right absolute top-0 hidden right-0 lg:block"></div>
            </div>
            <div class="row-line flex justify-center">
                <div class="my-2 ml--1 w-1 h-10 rounded-1"></div>
            </div>
            <div :class="`story step-card relative ${step === 3 ? 'active' : ''}`" @click="handleNext(3, 'character')">
                <div class="story-con">
                    <div class="icon">
                        <i class="i-ic-baseline-people-alt font-size-8"></i>
                    </div>
                </div>
                <div class="text">{{ t('workbench.components.step.character') }}</div>
                <div class="arraw-right absolute top-0 hidden right-0 lg:block"></div>
            </div>
            <div class="row-line flex justify-center">
                <div class="my-2 ml--1 w-1 h-10 rounded-1"></div>
            </div>
            <div :class="`story step-card relative ${step === 4 ? 'active' : ''}`" @click="handleNext(4, 'paragraph')">
                <div class="story-con">
                    <div class="icon">
                        <i class="i-lets-icons-img-box-fill font-size-8"></i>
                    </div>
                </div>
                <div class="text">{{ t('workbench.components.step.paragraph') }}</div>
                <div class="arraw-right absolute top-0 hidden right-0 lg:block"></div>
            </div>
            <div class="row-line flex justify-center">
                <div class="my-2 ml--1 w-1 h-10 rounded-1"></div>
            </div>
            <div :class="`story step-card relative ${step === 5 ? 'active' : ''}`" @click="handleNext(5, 'post')">
                <div class="story-con">
                    <div class="icon">
                        <i class="i-mdi-movie-open-edit font-size-8"></i>
                    </div>
                </div>
                <div class="text">{{ t('workbench.components.step.post') }}</div>
                <div class="arraw-right absolute top-0 hidden right-0 lg:block"></div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.step-nav {
    transition: ease .4s;
    --at-apply: fixed lg:relative left-0 right-0 top-0 lg:min-h-100vh z-100 lg:z-0 w-100%;
    background-color: #9f54ba;
    /* backdrop-filter: saturate(40%) blur(10px);
    -webkit-backdrop-filter: saturate(40%) blur(10px);
    background: rgba(171, 7, 173, 0.6);
    box-shadow: 1px 1px 4px rgba(52, 52, 51, 0.12); */
}

.arraw-right {
    width: 0;
    height: 0;
    border-right: 10px solid #fff;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    display: none;
}

.row-line div {
    background: #ddc6ea;
}

.story {
    color: #d6d4d4;
    --at-apply: ml-4 lg:ml--1 lg:mr-0;

    .icon {
        transition: ease .3s;
        background: rgba(255, 255, 255, .3);
        --at-apply: flex items-center justify-center p-1 rounded-2;

        i {
            font-size: 22px;

        }
    }

    &-con {
        --at-apply: flex cursor-pointer justify-center;
    }

    .text {
        --at-apply: text-center font-size-2.5 lg:font-size-4 font-bold mt-1;
    }

    &.active {
        color: #fff;

        .icon {
            transform: scale(1.2);
            background: rgba(255, 255, 255, .5);
        }

        .arraw-right {
            display: block;
        }
    }
}

.fixed-style {

    backdrop-filter: saturate(40%) blur(10px);
    -webkit-backdrop-filter: saturate(40%) blur(10px);
    /* background: rgba(168, 15, 170, 0.6); */
    box-shadow: 1px 1px 4px rgba(52, 52, 51, 0.12);
}



.up-class {
    transform: translateY(-100%);
}

@media screen and (max-width: 1024px) {
    .story {
        &.active {
            .arraw-right {
                display: none;
            }
        }

    }

    .row-line {
        display: none;
    }
}
</style>
