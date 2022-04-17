<template>
    <div class="h-full">
        <div class="h-10" >
            <p class="text-lg flex justify-center">
                <button class="text-2xl" @click="displayText(true)">Text</button>
                <span class="mx-2"> / </span>
                <button class="text-2xl" @click="displayText(false)">Image</button>
            </p>
        </div>        
        <image-carousel v-if="!textVisibleComputed" :images="images" />
        <article class="h-full max-w-xl mt-4 px-4 md:px-0 prose" v-else v-html="descriptionComputed">
        </article>       
    </div>
</template>

<script>
import ImageCarousel from "./ImageCarousel.vue";
import MarkdownIt from "markdown-it";
const markdown = new MarkdownIt();
export default {
    data() {
        return {
            textVisible: false
        };
    },
    props: {
        images: Array,
        description: String
    },
    computed: {
        textVisibleComputed() {
            return this.textVisible;
        },
        descriptionComputed(){
            return markdown.render(this.description);
        },
    },
    methods: {
        displayText(display){
            this.textVisible = display;
        },
    },
    components: { ImageCarousel }
}
</script>

<style scoped>
</style>
