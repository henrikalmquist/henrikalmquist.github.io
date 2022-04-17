<template>
    <footer class="container mx-auto flex flex-nowrap justify-center text-lg">
        <a title="Email" href @click="mailClick"> ✉ </a>
        <span class="mx-2">/</span>
        <a title="Cv" :href="cvLocation"> ▤ </a>
        <span class="mx-2">/</span>
        <a title="Instagram" :href="instagram"> ▣ </a>
    </footer>
</template>

<script>
export default {
    props: {
        cvLocation: String,
        mail: String,
        instagram: String
    },
    methods: {
        mailClick(e) {
            window.location.href = `mailto:${this.mail}`;
            e.preventDefault();
        }
    },
}
</script>

<style scoped>
</style>
