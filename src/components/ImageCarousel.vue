<template>
    <carousel :items-to-show="1" :wrap-around="true" ref="imageCarousel" class="h-full group">
        <slide v-for="image in images" :key="image.src" class="h-full">
            <image-container :image-src="image.src" :image-text="image.text" class="h-full" />
        </slide>

        <template #addons>
            <!-- <div class="right-5 top-1/3 text-7xl absolute h-16 w-16 animate-pulse flex items-center justify-center bg-neutral-200/[.1] rounded-full shadow-2xl shadow-current">
                <button class="text-black" @click="nextClicked"><span> > </span></button>
            </div> -->
            <div class="right-0 top-1/4 md:top-1/3 absolute animate-pulse md:hidden md:group-hover:block">
                <button class="text-black/50 md:text-black/[.1] text-6xl md:text-9xl" @click="nextClicked"><span> > </span></button>
            </div>
                <!-- <button class="right-5 top-1/3 text-7xl absolute animate-pulse rounded-full bg-neutral-700 shadow-2xl shadow-neutral-700 text-white" @click="nextClicked"> > </button> -->

        </template>
    </carousel>
</template>

<script>
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';
import ImageContainer from './ImageContainer.vue';
export default {
    name: "ImageCarousel",
    components: {
        Carousel,
        Slide,
        ImageContainer,
    },
    data() {
        return {
            
        }
    },
    props: {
        images: Array,
    },
    methods: {
        nextClicked() {
            this.$refs.imageCarousel.next();
        }
    },
    computed: {
        expandSignComputed() {
            return this.textVisible ? "-" : "+";
        },
        expandButtonClassComputed() {
            return this.textVisible ? "" : "animate-pulse";
        },
    }
}

</script>

<style>
.carousel__viewport{
    height: 100%;    
}
.carousel__viewport .carousel__track {
    height: 100%;
}
</style>
