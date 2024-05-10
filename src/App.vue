<template>
    <div class="flex flex-col h-screen justify-between font-times sm:mx-4 mx-2 cursor-cross">
        <div class="container mb-16 md:mb-auto mx-auto flex flex-col" :style="containerWidthCalculated">
            <h1 class="sticky top-0 text-5xl my-5 md:my-5 font-stratford flex justify-between " title="c">
                <!-- <a class="cursor-pointer" @click="reShuffleContent">AAA</a> -->
                <!-- <a class="ml-3 cursor-pointer underline-entire" style="font-size: 80%;" v-text="navigateToTherPageTextComputed" @click="introClicked"></a> -->
                <a class="cursor-cross underline-entire" style="font-size: 80%;" v-text="navigateToTherPageTextComputed" @click="introClicked"></a>
                <span class="text-base xs:self-end hidden xs:inline">contact@a-a-a.se</span>
                <!-- <span class="text-base xs:self-end hidden xs:inline">contact@a-a-a.se</span> -->
            </h1>
            <feature-columns v-show="imagesVisibleComputed" :features="featuresComputed" :intro-text="introText" :rem-unit="remUnit" @featureClicked="featureClicked" class="h-full md:h-2/3" />
            <feature-columns v-show="!imagesVisibleComputed" :features="aboutFeaturesComputed" :rem-unit="remUnit" @featureClicked="featureClicked" :use-markdown="true" class="h-full md:h-2/3" />
            <!-- <about-text v-show="!imagesVisibleComputed" :description="aboutText" :rem-unit="remUnit" class="h-full md:h-2/3" /> -->
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
            cvLcoation: "",
            mail: "contact@a-a-a.se",
            instagram: "https://www.instagram.com/almquisthenrik/",
        };
    },
    computed: {
        imagesVisibleComputed() {
            return this.imagesVisible;
        },
        navigateToTherPageTextComputed() {
            return this.imagesVisible ? "AAA" : "An Agency for Adaptive Architecture";
        },
        containerWidthCalculated() {
            return `max-width: ${this.remUnit * (5 * 2 + 1)}rem;`;
        },
        featuresComputed() {
            return this.features;
        },
        aboutFeaturesComputed(){
            return [
                {
                    images: [],
                    text: this.aboutText,
                    prio: 1,
                    type: "intro",
                },
/*                  {
                    images: ["img/AAA000/AAA000_02.jpg"],
                    header: ``,
                    text: ``,
                    prio: 4,
                                    }, */
/*                  {
                    images: ["img/AAA000/AAA000_Postbox_01.jpg"],
                    header: ``,
                    text: ``,
                    prio: 3,
                    
                },   */
                {
                    images: ["img/AAA014/AAA014_10_1.jpg"],
                    header: ``,
                    text: ``,
                    prio: 2,
                    
                }, 
                {
                    images: [],
                    header: ``,
                    text: `AAA är en Agency för en Anpassningsbar Arkitektur som arbetar med renoveringar och med att definiera den urbana potentialen i befintliga byggnader. Uppfattningen om och användningen av ett utrymme kan förändras genom enkla arkitektoniska ingrepp. Det handlar om att hitta kreativa lösningar som gör mer med mindre. Med hjälp av ekonomiskt och tekniskt kunnande omtolkas byggnadens och platsens nuvarande kvaliteter till ett generöst och funktionellt rum.

AAA erbjuder tjänster inom arkitektur och stadsplanering och har som mål att hitta strategier och skapa byggnader som harmonierar med miljön och de individuella behoven och ambitionerna. Det handlar om att lyssna och lära av varje specifik situation. För förfrågningar eller för att diskutera ditt nästa projekt > contact@a-a-a.se

Henrik Almquist (grundare AAA, Arkitekt SAR/MSA, Architecte Diplôme d'État) har arbetat på välrenommerade kontor i Stockholm, Paris och Tokyo. Han har ett brett perspektiv på arkitektur och stadsplanering och har genomfört projekt i alla faser, från dialoger in-situ till tidiga designförslag till genomförandet av byggnationer.
                    `,
                    prio: 4,
                    
                },
                {
                    images: ["img/AAA019/AAA019_Generative_Care_06.gif"],
                    header: ``,
                    text: ``,
                    prio: 3,
                    
                }, 
            ]
        }
    },
    methods: {
        introClicked(){
            this.imagesVisible = !this.imagesVisible;
        },
        reShuffleContent() {
            // console.log("reShuffleContent");
            // let features = this.features;
            // this.features = null;
            // this.features = features;
            location.reload();
        },
         featureClicked(feature) {
            if (feature.type === "intro") {
                this.imagesVisible = false;
            }
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
/* .underline-entire::after{
    border-bottom: 1px solid black;
    width: 5rem;
    content: '';
} */
.cursor-cross{
    cursor: crosshair; /* url("/src/assets/images/AAA_cross_128x128-01.png"),*/
}
</style>
