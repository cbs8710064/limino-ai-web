<script setup lang='ts'>
import { useI18n } from 'vue-i18n';

defineProps<{
    message?: string
}>()

const { t } = useI18n()
</script>
<template>
    <div class="the-no-data min-h-40 flex items-center justify-center">
        <div>
            <div class="flex items-center justify-center">
                <i class="i-icon-park-solid-charging-treasure font-size-14 color-#ccc lg:font-size-20"></i>
            </div>
            <div class="txt mt-4 text-center font-size-4 color-#ccc lg:font-size-4.4">{{ message || t('components.noData.defaultMsg') }}</div>
        </div>
    </div>
</template>
