<template>
    <div>
        <img class="my-4 md:h-full" :src="imageSrc">
        <div class="flex flex-col items-center italic w-5/6 mx-auto">
            <p class="mt-2 prose px-2" v-html="imageTextComputed"></p>
        </div>        
    </div>
</template>

<script>
import MarkdownIt from "markdown-it";
const markdown = new MarkdownIt();
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
