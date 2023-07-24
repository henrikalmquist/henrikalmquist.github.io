<template>
    <div>
        <img class="md:h-full mx-auto object-contain cursor-crosshair" :style="imageStyleComputed" :src="imageSrc" @click="$emit('nextClicked')">                
    </div>
</template>

<script>
export default {
    props: {
        imageSrc: String,
        maxHeight: Number
    },
    computed: {
        imageStyleComputed(){
            return `height: ${this.maxHeight}rem`
        }
    }
}
</script>

<style scoped>
</style>
