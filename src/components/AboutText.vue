<template>
    <div class="h-full">         
        <article class="h-full mt-4 px-4 md:px-0 prose text-justify" v-html="descriptionComputed">
        </article>       
    </div>
</template>

<script>
import MarkdownIt from "markdown-it";
const markdown = new MarkdownIt();
export default {
    name: "AboutText",
    data() {
        return {
            textVisible: false
        };
    },
    props: {
        description: String
    },
    computed: {
        descriptionComputed(){
            return markdown.render(this.description);
        },
    },
}
</script>

<style scoped>
</style>
