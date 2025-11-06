<template>
  <!-- minimal wrapper to avoid changing your layout -->
  <div>
    <!-- Keep this line visually identical to before; only difference: links -->
    <!-- If you had custom classes on the line in App.vue, add them to this div. -->

    <!-- AAA goes to Adaptive -->
    <router-link
      to="/adaptive"
      class="underline"
      :class="is('/adaptive') ? 'italic' : ''"
    >AAA</router-link>

    &nbsp;

    <router-link
      to="/agency"
      class="underline"
      :class="is('/agency') ? 'italic' : ''"
    >Agency</router-link>

    &nbsp;for&nbsp;

    <router-link
      to="/adaptive"
      class="underline"
      :class="is('/adaptive') ? 'italic' : ''"
    >Adaptive</router-link>

    &nbsp;

    <router-link
      to="/architecture"
      class="underline"
      :class="is('/architecture') ? 'italic' : ''"
    >Architecture</router-link>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  name: 'TitleLine',
  setup() {
    const route = useRoute();
    const is = (p) => route.path === p; // active route check for italic
    return { is };
  },
};
</script>

<style scoped>
/* No extra margins/padding so we don't change your old layout.
   It relies on your existing typography and spacing. */
</style>
