<template>
    <div class="mx-auto flex flex-nowrap justify-center text-lg items-center">
        <button title="Into" @click="$emit('introClicked')" >
            <UserIcon v-if="imagesVisible" class="h-4 w-4 my-auto"/>
            <PhotographIcon v-else="imagesVisible" class="h-4 w-4 my-auto"/>
        </button>
        <span class="mx-2">/</span>
        <a title="Email" href @click="mailClick"> <MailIcon class="h-4 w-4 my-auto"/> </a>
        <span class="mx-2">/</span>
        <a title="Instagram" :href="instagram"> <CameraIcon class="h-4 w-4 my-auto"/> </a>
    </div>
</template>

<script>
import { UserIcon, PhotographIcon, MailIcon, CameraIcon } from '@heroicons/vue/outline';

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
    components: { UserIcon, PhotographIcon, MailIcon, CameraIcon }
}
</script>

<style scoped>
</style>
