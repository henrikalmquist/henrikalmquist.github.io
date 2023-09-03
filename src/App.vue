<template>
    <div class="flex flex-col h-screen justify-between font-stratford">
        <div class="container mb-16 md:mb-auto mx-auto flex flex-col" :style="containerWidthCalculated">
            <h1 class="sticky top-0 text-5xl my-5 md:my-5" title="Almquist Architecture Agency">
                <span @click="reShuffleContent">AAA</span>
                <span class="ml-3 cursor-pointer" style="font-size: 50%;" v-text="navigateToTherPageTextComputed" @click="introClicked"></span>
            </h1>
            <feature-columns v-show="imagesVisibleComputed" :features="featuresComputed" :intro-text="introText" :rem-unit="remUnit" class="h-full md:h-2/3" />
            <about-text v-show="!imagesVisibleComputed" :description="aboutText" :rem-unit="remUnit" class="h-full md:h-2/3" />
        </div>
    </div>    
</template>

<script>
// import Header from './components/Header.vue'
// import ContactInformation from './components/ContactInformation.vue'
import FeatureColumns from "./components/FeatureColumns.vue";
import AboutText from "./components/AboutText.vue";
import Data from "./Data.js"

export default {
    data() {
        return {
            imagesVisible: true,
            features: Data.features,
            introText: Data.intro,
            remUnit: Data.spacingInRem,
            aboutText: Data.about,
            cvLcoation: "almquist-cv.pdf",
            mail: "henrik@almquist.eu",
            instagram: "https://www.instagram.com/almquisthenrik/",
        };
    },
    computed: {
        imagesVisibleComputed() {
            return this.imagesVisible;
        },
        navigateToTherPageTextComputed() {
            return this.imagesVisible ? "Agency" : "Architecture";
        },
        containerWidthCalculated() {
            return `max-width: ${this.remUnit * (5 * 2 + 1)}rem;`;
        },
        featuresComputed() {
            return this.features;
        },
    },
    methods: {
        introClicked(){
            this.imagesVisible = !this.imagesVisible;
        },
    },
    components: { FeatureColumns, AboutText }
}

</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
