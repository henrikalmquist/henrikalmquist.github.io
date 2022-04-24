<template>
    <Transition name="fade" mode="out-in">
        <div :key="imageIndexComputed" @click="nextClicked" class="cursor-pointer h-full">
            <AboutText v-if="displayAboutTextComputed" :description="description" class="h-full" />
            <image-container v-else :image-src="imageComputed.src" :image-text="imageComputed.text" class="relative top-0 h-full" />
        </div>
    </Transition>
</template>

<script>
import ImageContainer from './ImageContainer.vue';
import AboutText from "./AboutText.vue";
export default {
    name: "ImagesContainer",
    components: {
        ImageContainer,
        AboutText,
    },
    data() {
        return {
            imageIndex: 0,
            displayAboutText: false,
        }
    },
    props: {
        images: Array,
        description: String,
    },
    methods: {
        nextClicked() {
            let next = this.imageIndex + 1;
            this.displayAboutText = false;
            if(next === this.amountOfImagesComputed){
                this.displayAboutText = true;
            }else if(next >= this.amountOfImagesComputed){
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
        }
    }
}

</script>

<style>
.fade-enter-active{
  transition: opacity 0.5s ease;
}
.fade-leave-active {
  transition: opacity 0.5s ease;
  /* display: none; */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
