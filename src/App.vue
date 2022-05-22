<template>
    <div class="flex flex-col h-screen justify-between font-stratford">
        <div class="container mb-auto mx-auto flex flex-col items-center h-5/6 max-w-6xl pt-5 md:pt-10">
            <h1 class="text-5xl"><a href="/">Almquist</a></h1>
            <ContactInformation class="h-10 mb-2"
                :cv-location="cvLcoation"
                :mail="mail"
                :instagram="instagram"
                :images-visible="imagesVisibleComputed"
                @introClicked="introClicked"/>
            <images-container v-show="imagesVisibleComputed" :images="images" :description="description" class="h-full md:h-2/3" />
            <about-text v-show="!imagesVisibleComputed" :description="description" class="h-full md:h-2/3 " />
        </div>
    </div>    
</template>

<script>
import Header from './components/Header.vue'
import ContactInformation from './components/ContactInformation.vue'
import ImagesContainer from "./components/ImagesContainer.vue";
import AboutText from "./components/AboutText.vue";
import Data from "./Data.js"

export default {
    data() {
        return {
            imagesVisible: true,
            images: Data.images,
            description: Data.about,
            cvLcoation: "almquist-cv.pdf",
            mail: "henrik@almquist.eu",
            instagram: "https://www.instagram.com/almquisthenrik/",
        };
    },
    computed: {
        imagesVisibleComputed() {
            return this.imagesVisible;
        }
    },
    methods: {
        introClicked(){
            this.imagesVisible = !this.imagesVisible;
        },
    },
    components: { Header, ContactInformation, ImagesContainer, AboutText }
}

</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
