<template>
    <div>
        <img class="md:h-full mx-auto object-contain cursor-crosshair" :src="imageSrc" @click="$emit('nextClicked')">                
    </div>
</template>

<script>
export default {
    props: {
        imageSrc: String,
    },
}
</script>

<style scoped>
</style>
