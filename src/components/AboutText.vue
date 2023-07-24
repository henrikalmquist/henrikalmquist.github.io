<template>
    <div>         
        <article class="mt-4 px-4 md:px-0 prose text-black text-justify leading-6 about-text" style="" v-html="descriptionComputed">
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
.about-text{
    column-count: 2;
    column-gap: 2rem;
    max-width: 100%;
}
</style>
