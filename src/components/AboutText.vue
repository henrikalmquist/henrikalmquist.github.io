<template>
    <div>         
        <article class="mt-6 px-6 md:px-0 prose text-black text-justify leading-6 about-text" :style="articleStyleComputed" v-html="descriptionComputed">
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
        description: String,
        remUnit: Number
    },
    computed: {
        descriptionComputed(){
            return markdown.render(this.description);
        },
        articleStyleComputed(){
            return `width: ${ this.remUnit * 4 * 2 + 1}rem; column-gap: ${this.remUnit}rem;`
        }
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
