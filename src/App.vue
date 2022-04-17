<template>
    <div class="flex flex-col h-screen justify-between font-stratford">
        <Header class="h-10" />
        <div class="container mb-auto mx-auto flex flex-col items-center h-5/6 max-w-6xl">
            <h1 class="text-5xl mb-2">Almquist</h1>
            <About :images="images" :description="description" />
        </div>
        <Footer class="h-10 bottom-0" :cv-location="cvLcoation" :mail="mail" :instagram="instagram" />
    </div>
    
</template>

<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import About from './components/About.vue'

const cvLcoation = "almquist-cv.pdf";
const mail = "almquist.henrik@gmail.com";
const instagram = "https://www.instagram.com/henkyfant/";

const images = [
    {
        src: "img/_MG_5801.jpg",
        text: `**test**`
    },
    {
        src: "img/almquist_kampen-25-sofielund-malmö_site.jpg",
        text: `# Malmö`
    },
    {
        src: "img/almquist_kampen-25-sofielund-malmö_site.jpg",
        text: `Malmö2`
    }
]

const description = `# Intro
Henrik Almquist is a practicing architect I Paris currently working at Studio Muoto. He holds a Master of Architecture from ENSA Paris Malaquais and a Bachelor of Science from TU Chalmers Sweden.`;

</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
