<script setup lang='ts'>
</script>
<template>
    <footer>
        <div class="flex justify-center">
            <div class="link-list flex flex-1 justify-center py-4">
                <a href="http://" target="_blank" rel="noopener noreferrer">
                    <i class="i-logos-twitter"></i>
                </a>
                <a href="http://" target="_blank" rel="noopener noreferrer">
                    <i class="i-logos-telegram"></i>
                </a>
                <a href="http://" target="_blank" rel="noopener noreferrer">
                    <i class="i-logos-discord-icon"></i>
                </a>
                <a href="http://" target="_blank" rel="noopener noreferrer">
                    <i class="i-logos-medium-icon"></i>
                </a>
                <a href="http://" target="_blank" rel="noopener noreferrer">
                    <i class="i-logos-youtube-icon"></i>
                </a>
                <a href="http://" target="_blank" rel="noopener noreferrer">
                    <i class="i-skill-icons-instagram"></i>
                </a>
            </div>
        </div>
    </footer>
</template>
<style scoped lang='scss'>
footer {
    --at-apply: mt-10;
}

.link-list {
    a {
        --at-apply: mr-5;

        i {
            --at-apply: font-size-6;
        }

        &:hover {
            color: #9f54ba;
        }
    }

    a:nth-last-of-type(1) {
        margin-right: 0;
    }
}</style>