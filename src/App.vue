<template>
    <div class="flex flex-col h-screen justify-between font-stratford">
        <Header class="h-20" />
        <div class="container mb-auto mx-auto flex flex-col items-center h-5/6 max-w-6xl">
            <h1 class="text-5xl"><button @click="imagesVisible = true">Almquist</button></h1>
            <ContactInformation class="h-10 mb-2"
                :cv-location="cvLcoation"
                :mail="mail"
                :instagram="instagram"
                :images-visible="imagesVisibleComputed"
                @introClicked="introClicked"/>
            <images-container v-if="imagesVisibleComputed" :images="images" :description="description" class="h-full md:h-2/3" />
            <about-text v-else :description="description" class="h-full md:h-2/3 " />
        </div>
    </div>
    
</template>

<script>
import Header from './components/Header.vue'
import ContactInformation from './components/ContactInformation.vue'
import ImagesContainer from "./components/ImagesContainer.vue";
import AboutText from "./components/AboutText.vue";

export default {
    data() {
        return {
            imagesVisible: true,
            images: [
                {
                    src: "img/Almquist_DSCF1488_Brasilien.jpg",
                    text: `[Casa Mangaberias]
Refurbishment of a 60s concrete dream. Restructuring and redefining the spaces for a more open Mangaberias Belo Horizonte, Brasil.`
                },
                {
                    src: "img/MG_5801.jpg",
                    text: `[Casa Mangaberias]
Meditation room with a view on the garden. New openings are excavated in the solid concrete and new walls are filled with painted block elements. `
                },
                {
                    src: "img/MG_5801.jpg",
                    text: `[Follo Museum Extension]
A glazed space links all the internal program and creates a weather protected space for meeting between the public and the `
                },
                {
                    src: "img/004.jpg",
                    text: `[Follo Museum Extension]`
                },
            ],
            description: `Henrik Almquist is a practicing architect in Paris currently working at Studio Muoto. Having participated in early conception phases and. Etc ets.

He holds a Master of Architecture from ENSA Paris Malaquais and a Bachelor of Science from TU Chalmers Sweden in the program of Architecture and Engineering. With two distinct different perspectives, the first technical and, the second driven by a theoretical and social approach with a stronger artistic expression. `,
            cvLcoation: "almquist-cv.pdf",
            mail: "almquist.henrik@gmail.com",
            instagram: "https://www.instagram.com/henkyfant/",
        };
    },
    computed: {
        imagesVisibleComputed() {
            return this.imagesVisible;
        },
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
