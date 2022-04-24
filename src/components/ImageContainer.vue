<template>
    <div>
        <img class="my-4 md:h-full" :src="imageSrc">
        <div class="flex flex-col items-center italic w-full md:w-5/6 mx-auto text-sm p-2 pb-4 prose text-justify" v-html="imageTextComputed">
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
