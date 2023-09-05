<template>
    <div>
        <img class="md:h-full object-contain cursor-crosshair" :class="imageClassComputed" :style="imageStyleComputed" :src="imageSrc" @click="$emit('nextClicked')">                
    </div>
</template>

<script>
export default {
    props: {
        imageSrc: String,
        maxHeight: Number,
        centerContent: Boolean,
    },
    computed: {
        imageStyleComputed(){
            return `height: ${this.maxHeight}rem`
        },
        imageClassComputed(){
            let result = "";
            if(this.centerContent){
                result = "mx-auto";
            }
            return result;
        }
    }
}
</script>

<style scoped>
</style>
