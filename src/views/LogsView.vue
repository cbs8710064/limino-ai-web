<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { useRequest } from '../api/useRequest';
import { Collapse, CollapsePanel } from 'ant-design-vue';
import TheButton from '@/components/TheButton.vue';
import { useRouter } from 'vue-router';
import { useMessage } from '../hooks/useMessage';
const message = useMessage()
const activeKey = ref(0)
const { getLogs } = useRequest()
const loading = ref(false)
const logs = ref()
const router = useRouter()
onMounted(async () => {
    try {
        loading.value = true
        const arr = await getLogs()
        // logs.value = JSON.stringify(arr, null, 4)
        logs.value = arr
    } finally {
        loading.value = false
    }
})

const backHome = () => {
    router.replace({ name: 'home' })
}

const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    message.success('Copy success.')
}
</script>
<template>
    <div class="h-100vh py-10">
        <div class="mb-4 flex">
            <div class="m-auto w-300">
                <TheButton type="border" className="w-100" @click="backHome">Back Home Page</TheButton>
            </div>
        </div>
        <div v-if="loading" class="h-80vh flex items-center justify-center">
            <i class="i-svg-spinners-ring-resize mr-2 font-size-18 color-blue"></i>
        </div>
        <div class="scrollbar-small-y m-auto h-88vh w-300" v-else>
            <Collapse v-model:activeKey="activeKey">

                <CollapsePanel v-for="(item, idx) in logs" :key="idx" :header="item.story_name || 'null'">
                    <template #extra>
                        <i class="i-material-symbols-file-copy-sharp font-size-5" @click.stop="handleCopy(JSON.stringify(item))"></i>
                    </template>
                    <pre class="bg-black color-white rounded-2">
                        <code class="h-50">{{ JSON.stringify(item, null, 4) }}</code>
                    </pre>
                </CollapsePanel>
            </Collapse>
        </div>

    </div>
</template>
<style scoped lang='scss'></style>