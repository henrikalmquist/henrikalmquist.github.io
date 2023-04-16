<template>
    <div>
        <img class="my-4 md:h-full mx-auto object-contain cursor-crosshair" :src="imageSrc" @click="$emit('nextClicked')">
        <div class="flex flex-col items-center w-full md:w-5/6 mx-auto text-sm p-2 pb-4 prose black text-justify cursor-crosshair" @click="$emit('nextClicked')" v-html="imageTextComputed">
        </div>        
    </div>
</template>

<script>
import MarkdownIt from "markdown-it";
const markdown = new MarkdownIt({breaks: true});
export default {
    props: {
        imageSrc: String,
        imageText: String,
    },
    computed: {
        imageTextComputed(){
            return markdown.render(this.imageText);
        }
    }
}
</script>

<style scoped>
</style>
