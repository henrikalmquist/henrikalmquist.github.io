<template>
  <section class="two-col" :style="{ '--rem': remUnit + 'rem' }">
    <!-- LEFT column -->
    <div class="left">
      <!-- If old prop introText is provided, use it -->
      <div v-if="introText" class="intro" v-html="introText"></div>

      <!-- Otherwise, optionally show EN then SV -->
      <div v-else-if="introEn || introSv" class="intro">
        <div v-if="introEn" class="intro-en" v-html="introEn"></div>
        <div v-if="introSv" class="intro-sv"><em v-html="introSv"></em></div>
      </div>

      <!-- desktop copy of rest -->
      <div v-if="restText" class="rest rest--desktop" v-html="restText"></div>
    </div>

    <!-- RIGHT column -->
    <div class="right">
      <ImagesContainer
        v-for="(item, i) in items"
        :key="i"
        :header="item.header || ''"
        :images="item.images || []"
        :description="item.text || ''"
        :use-markdown="true"
        :center-content="true"
        :rem-unit="remUnit"
        :showonload="Number(item.showonload) === 1 ? 1 : 0"
      ></ImagesContainer>
    </div>

    <!-- mobile copy of rest (after images) -->
    <div v-if="restText" class="rest rest--mobile" v-html="restText"></div>
  </section>
</template>

<script>
import ImagesContainer from './ImagesContainer.vue';

export default {
  name: 'TwoColumnTextImages',
  components: { ImagesContainer },
  props: {
    introText: { type: String, default: '' },
    restText:  { type: String, default: '' },
    introEn:   { type: String, default: '' },
    introSv:   { type: String, default: '' },
    items:     { type: Array,  default: () => [] },
    remUnit:   { type: Number, default: 7 },
  },
};
</script>

<style scoped>
.two-col { width:100%; display:flex; gap:var(--rem, 7rem); }
.left, .right { flex:1 1 0; min-width:0; }
.intro-en { margin-bottom:.25rem; }
.intro-sv { margin-bottom:1rem; font-style:italic; }
.intro { margin-bottom:.75rem; }
.rest { margin-top:1.5rem; }
.right :deep(.images-container){ margin-bottom:1.5rem; }
.rest--desktop{ display:block; }
.rest--mobile{ display:none; }
@media (max-width:768px){
  .two-col{ display:block; }
  .rest--desktop{ display:none; }
  .rest--mobile{ display:block; }
}
</style>
