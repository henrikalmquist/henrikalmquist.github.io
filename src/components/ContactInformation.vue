<template>
    <div class="mx-auto flex flex-nowrap justify-center text-lg items-center">
        <button title="About" @click="$emit('introClicked')" >
            <UserIcon v-if="imagesVisible" class="h-4 w-4 my-auto mx-2"/>
            <PhotographIcon v-else="imagesVisible" class="h-4 w-4 my-auto"/>
        </button>
        <a title="Email" href @click="mailClick"> <EnvelopeIcon class="h-4 w-4 my-auto mx-2"/> </a>
        <a title="Instagram" :href="instagram"> <CameraIcon class="h-4 w-4 my-auto mx-2"/> </a>
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
