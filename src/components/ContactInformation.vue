<template>
     <div class="mt-1 px-1 md:px-1 text-justify leading-1">     
    
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
