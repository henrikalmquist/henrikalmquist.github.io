<template>
     <div class="mt-4 px-4 md:px-0 text-justify leading-6">     
        <button class="mx-1" title="About" @click="$emit('introClicked')" >
            <span v-if="imagesVisible">Profile</span>
            <span v-else>Projects</span>
        </button>
        <a class="mx-1" title="Contact" href @click="mailClick">Contact</a>
        <a class="mx-1" title="Instagram" :href="instagram">Instagram</a>
    </div>
</template>

<script>
import { UserIcon, PhotographIcon, EnvelopeIcon, CameraIcon } from '@heroicons/vue/24/outline';

export default {
    name: "ContactInformation",
    props: {
        cvLocation: String,
        mail: String,
        instagram: String,
        imagesVisible: Boolean
    },
    methods: {
        mailClick(e) {
            window.location.href = `mailto:${this.mail}`;
            e.preventDefault();
        },
    },
    components: { UserIcon, PhotographIcon, EnvelopeIcon, CameraIcon }
}
</script>

<style scoped>
</style>
