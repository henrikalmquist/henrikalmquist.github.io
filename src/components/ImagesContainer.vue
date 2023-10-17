<template>
    <div :style="outerMarginComputed">
        <Transition name="fade" mode="out-in">
        <div :key="imageIndexComputed" v-if="hasImagesComputed">
            <image-container :image-src="imageComputed" :max-height="imageRemSizeComputed" :center-content="centerContent" :isSmallScreen="isSmallScreen" @nextClicked="nextClicked" />
        </div>
        </Transition>
        <div class="flex flex-col w-full prose text-black text-justify cursor-crosshair" style="max-width: inherit;" :class="textClassComputed" @click="nextClicked">
            <div v-if="hasImagesComputed" class="w-full flex mb-3 justify-between">
                <div v-if="header" v-text="header"></div>
                <div v-if="amountOfImagesComputed > 1"> {{ imageIndexComputed + 1 }}/{{ amountOfImagesComputed }} </div>
            </div>
            <div v-html="imageTextComputed" @click="descriptionClicked"></div>
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
        type: String,
        description: String,
        remUnit: Number,
        useMarkdown: Boolean,
        centerContent: Boolean,
        isSmallScreen: Boolean,
    },
    methods: {
        nextClicked() {
            let next = this.imageIndex + 1;
            if(next >= this.amountOfImagesComputed){
                next = 0;
            }
            this.imageIndex = next;
        },
        descriptionClicked() {
            this.$emit('descriptionClicked', {type: this.type});
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
                result = "mt-4"
            }
            if(this.type === "intro"){
                result += " font-stratford leading-6";
            }
            else{
                result += " leading-5";
            }
            return result;
        },
        outerMarginComputed(){
            let remSize = this.isSmallScreen ? this.remUnit * 2 / 3 : this.remUnit;
            return `margin-bottom: ${remSize}rem`;
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
