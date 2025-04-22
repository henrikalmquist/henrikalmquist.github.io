<template>
    <div class="flex flex-col h-screen justify-between font-times sm:mx-4 mx-2 cursor-cross">
        <div class="container mb-16 md:mb-auto mx-auto flex flex-col" :style="containerWidthCalculated">
            <h1 class="sticky top-0 text-5xl my-5 md:my-5 font-stratford flex" title="Agency for Adaptive Architecture">
                <!-- <a class="cursor-pointer" @click="reShuffleContent">AAA</a> -->
                <!-- <a class="ml-3 cursor-pointer underline-entire" style="font-size: 80%;" v-text="navigateToTherPageTextComputed" @click="introClicked"></a> -->
                <a class="cursor-cross underline-entire" style="font-size: 100%;" v-text="navigateToTherPageTextComputed" @click="introClicked"></a>
                <a class="cursor-cross underline-entire font-times text-base xs:self-end xs:inline" style="font-size: 34%;"  @click="introClicked">&#8202; Agency for Adaptive Architecture </a>
                <!-- <span class="text-base xs:self-end hidden xs:inline font-times">contact@a-a-a.se</span> -->
                <!-- <span class="text-base xs:self-end hidden xs:inline">contact@a-a-a.se</span> -->
            </h1>
            <feature-columns v-show="imagesVisibleComputed" :features="featuresComputed" :intro-text="introText" :rem-unit="remUnit" @featureClicked="featureClicked" class="h-full md:h-2/3" />
            <feature-columns v-show="!imagesVisibleComputed" :features="aboutFeaturesComputed" :rem-unit="remUnit" @featureClicked="featureClicked" :use-markdown="true" :center-images="false" class="h-full md:h-2/3" />
            <!-- <about-text v-show="!imagesVisibleComputed" :description="aboutText" :rem-unit="remUnit" class="h-full md:h-2/3" /> -->
        </div>
        <footer class="container mb-16 md:mb-auto mx-auto flex justify-start" :style="containerWidthCalculated">
            <span class="me-2">AAA</span>
            <span class="me-2">contact@a-a-a.se</span>
            <span class="me-2"><a href="https://www.instagram.com/almquisthenrik/">@almquisthenrik </a></span>
        </footer>
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
            return this.imagesVisible ? "AAA" : "AAA";
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
/*                 {
                    images: ["img/AAA014/AAA014_10_1.jpg"],
                    header: ``,
                    text: ``,
                    prio: 3,
                    
                },  */
/*                 {
                    images: [],
                    header: ``,
                    text: `Collaborations
Josephine Harold, Arkitekt SAR/MSA Stockholm
Morgane Martin-Alonzo, rkitekten urbanist Hamburg
Léa Ganteil, Architecte HMNOP Paris/Laussane
Oscar Aparicio Chavez, Architecte HMNOP Paris
Markus Gustafsson, Arkitekt SAR/MSA Gothenburg
Joel Matsson, Arkitekt SAR/MSA Stockholm

Almquist Architecture Agency AB
Swedish organisation number: 556574-6152 `,
                    prio: 5,
                    
                },  */
/*                 {
                    images: [],
                    header: ``,
                    text: `[Svenska] AAA är en Agency för en Anpassningsbar Arkitektur som arbetar med renoveringar, tillägg och regenerativa processer. Genom att definiera den dolda potentialen i en befintlig situation eller byggnad förändras uppfattningen om och användningen av rummet med hjälp av enkla arkitektoniska ingrepp. Det handlar om att hitta kreativa lösningar som gör mer med mindre. Med hjälp av ekonomiskt och tekniskt kunnande omtolkas de befintliga kvaliteterna i en byggnad eller på en plats till ett nytt generöst och funktionellt rum.
  `,
                    prio: 3,
                    
                }, 
                {
                    images: ["img/AAA000/AAA000_02.jpg"],
                    header: `Seeing Potential in Every Space`,
                    text: `Every building, every landscape holds a hidden potential. Our role as architects is to recognise and elevate these qualities. Whether it's a single building or a whole urban area, subtle adjustments can create a significant impact, transforming how a space feels and functions. Our approach is rooted in listening and learning, to create designs that harmonise with the environment and respond to the unique needs of each client.`,
                    prio: 1,
                    
                }, 
                {
                    images: ["img/AAA000/AAA000_Postbox_01.jpg"],
                    header: `Henrik Almquist, MArch Dip. d'État, Arkitekt SAR/MSA`,
                    text: `Brings experience from Stockholm, Paris, and Tokyo. He has carried out projects from in-situ dialogues to early design proposals to seeing through the construction. Henrik teaches  at Lund University, directing the masterstudio *The Renewal of Modernism* on renovations and is actively involved in the ongoing dialogue on urban development and sustainability. See more on instagram [@almquisthenrik](https://www.instagram.com/almquisthenrik/).`,
                    prio: 4,
                    
                }, */
                {
                    images: ["img/AAA025/AAA Adaptive Architecture and Regenerative Strategies Cover-01.jpg", "img/AAA025/AAA Adaptive Architecture and Regenerative Strategies-02.jpg", "img/AAA025/AAA Adaptive Architecture and Regenerative Strategies-03.jpg", "img/AAA025/AAA Adaptive Architecture and Regenerative Strategies-04.jpg"],
                    header: `Regenerative Strategies`,
                    text: ``,
                    prio: 3,
                    
                }, 
                {
                    images: ["img/AAA025/AAA Adaptive Architecture and Regenerative Strategies Cover-02.jpg", "img/AAA025/AAA Adaptive Architecture and Regenerative Strategies-06.jpg", "img/AAA025/AAA Adaptive Architecture and Regenerative Strategies-07.jpg", "img/AAA025/AAA Adaptive Architecture and Regenerative Strategies-08.jpg"],
                    header: `Adaptive Architecture`,
                    text: ``,
                    prio: 4,
                    
                },

                {
                    images: ["img/AAA019/AAA019_Generative_Care_06.gif"],
                    header: `Collaborations: Josephine Harold (architect Berlin), Morgane M. Alonzo (architect and urbanist Hamburg), Léa Ganteil (architect material reuse Lausanne), Oscar A. Chavez (architect Paris), Markus Gustafsson (architect engineer Gothenburg) and Joel Matsson (architect Stokholm).`,
                    text: ``,
                    prio: 2,
                    
                }, 
/*                 {
                    images: ["img/AAA019/AAA019_Generative_Care_06.gif"],
                    header: `Adaptive - a way to see`,
                    text: `Every landscape and every building sit on a hidden potential. The key role of an architect is to identify and enhance these qualities. Adapting to every situation, it can implicate a minimal renovation, reusing materials, a small extension or a tailored addition. The same goes for an urban environment, with the right understanding, a simple intervention can hugely impact the activities and atmosphere of a space. `,
                    prio: 2,
                    
                }, 
                {
                    images: ["img/AAA014/AAA014_06_3.jpg"],
                    header: `Architecture - a way to build`,
                    text: `Shouldering many different perspectives - spatial, cultural, ecologic, economic, technical - a project can build a unified whole. One where all parts are speaking to each other. AAA can offer:
* Development strategy of a building or a site through a regenerative process. How can an existing structure best be put to new use?
* Renovation or addition that adapts to an existing situation. From design, building permit, construction drawings to assuring a smooth construction phase.`,
                    prio: 3,
                    
                }, 
                {
                    images: ["img/AAA014/AAA014_14_3.jpg"],
                    header: `Agency - a way to work`,
                    text: `AAA is committed to find strategies and create buildings that harmonise with the environment and the individual needs and aspirations. It is about listening and learning from every specific situation. This means fully understanding the potential in the given economy of the project, mastering the technical aspects and seeking sustainable approaches in all levels of the process. `,
                    prio: 4,
                    
                }, 
                {
                    images: ["img/AAA014/AAA014_08_1.jpg"],
                    header: `Henrik Almquist`,
                    text: `Henrik, founder AAA, MArch Dip. d'État, Arkitekt SAR/MSA, has worked at renowned offices from Stockholm, Paris and Tokyo. Proposing a regenerative and adaptive approach on architecture and urban planning, he has carried out projects in all phases, from in-situ dialogues to early design proposals to seeing through the construction. Henrik is  teaching at Lund University and is engaged in the omnipresent discussion of urban development and sustainability.`,
                    prio: 5,
                    
                }, 
                {
                    images: ["img/AAA014/AAA014_10_1.jpg"],
                    header: `Collaborations`,
                    text: `JH Josephine Harold, MA Morgane Martin-Alonzo, LG Léa Ganteil, OC Oscar Aparicio Chavez, MG Markus Gustafsson and JM Joel Matsson. AAA Swedish organisation number: 556574-6152.`,
                    prio: 6,
                    
                }, 
                {
                    images: ["img/AAA014/AAA014_02_1.jpg"],
                    header: `[Svenska]`,
                    text: `AAA arbetar med renoveringar, tillägg och regenerativa processer. Genom att definiera den dolda potentialen i en befintlig situation eller byggnad förändras uppfattningen om och användningen av rummet med hjälp av enkla arkitektoniska ingrepp. Det handlar om att hitta kreativa lösningar som gör mer med mindre. Med hjälp av ekonomiskt och tekniskt kunnande omtolkas de befintliga kvaliteterna i en byggnad eller på en plats till ett nytt generöst och funktionellt rum.`,
                    prio: 7,
                    
                },  */
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
       cursor: crosshair; /* url(/src/assets/images/AAA_cross_64x64.png), auto;  */
}
</style>
