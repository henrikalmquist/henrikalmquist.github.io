<template>
    <div :style="outerMarginComputed">
        <Transition name="fade" mode="out-in">
        <div :key="imageIndexComputed" v-if="hasImagesComputed">
            <image-container :image-src="imageComputed" :max-height="imageRemSizeComputed" :center-content="centerContent" @nextClicked="nextClicked" />
        </div>
        </Transition>
        <div class="flex flex-col w-full leading-6 prose text-black text-justify" style="max-width: inherit;" :class="textClassComputed" @click="nextClicked">
            <div v-if="hasImagesComputed" class="w-full flex mb-1 justify-between">
                <div v-if="header" v-text="header"></div>
                <div v-if="amountOfImagesComputed > 1"> {{ imageIndexComputed + 1 }}/{{ amountOfImagesComputed }} </div>
            </div>
            <div v-html="imageTextComputed"></div>
        </div>
    </div>
</template>

<script>
import ImageContainer from './ImageContainer.vue';
import AboutText from "./AboutText.vue";
import MarkdownIt from "markdown-it";
const markdown = new MarkdownIt({breaks: true});
export default {
    name: "ImagesContainer",
    components: {
        ImageContainer,
        AboutText,
    },
    data() {
        return {
            imageIndex: 0,
        }
    },
    props: {
        images: Array,
        header: String,
        description: String,
        remUnit: Number,
        useMarkdown: Boolean,
        centerContent: Boolean,
    },
    methods: {
        nextClicked() {
            let next = this.imageIndex + 1;
            if(next >= this.amountOfImagesComputed){
                next = 0;
            }
            this.imageIndex = next;
        }
    },
    computed: {
        imageIndexComputed() {
            return this.imageIndex;
        },
        imageComputed() {
            return this.images[this.imageIndexComputed];
        },
        amountOfImagesComputed() {
            return this.images.length;
        },
        displayAboutTextComputed() {
            return this.displayAboutText;
        },
        imageTextComputed(){
            return this.useMarkdown ? markdown.render(this.description) : this.description;
        },
        hasImagesComputed() {
            return this.amountOfImagesComputed > 0; 
        },
        textClassComputed() {
            let result = "";
            if(this.hasImagesComputed){
                result = "cursor-crosshair mt-4"
            }
            return result;
        },
        outerMarginComputed(){
            return `margin-bottom: ${this.remUnit}rem`;
        },
        imageRemSizeComputed() {
            // let randomNumber = Math.floor(Math.random() * 3);
            return this.remUnit * 4; // - ((this.amountOfImagesComputed + randomNumber) % 4) * 3;

        }
    }
}

</script>

<style>
.fade-enter-active{
  transition: opacity 0.25s ease;
}
.fade-leave-active {
  transition: opacity 0.25s ease;
  /* display: none; */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
