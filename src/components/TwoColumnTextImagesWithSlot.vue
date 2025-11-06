<!-- /components/TwoColumnTextImagesWithSlot.vue -->
<template>
  <section class="two-col" :style="{ '--rem': remUnit + 'rem' }">
    <!-- LEFT column -->
    <div class="left">
      <div v-if="introText" class="intro" v-html="introText"></div>

      <div v-else-if="introEn || introSv" class="intro">
        <div v-if="introEn" class="intro-en" v-html="introEn"></div>
        <div v-if="introSv" class="intro-sv"><em v-html="introSv"></em></div>
      </div>

      <!-- left-column slot (desktop/tablet) -->
      <div class="after-left">
        <slot name="after-left" />
      </div>

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
      />
    </div>

    <!-- mobile: repeat the slot after the right images -->
    <div class="after-right-mobile">
      <slot name="after-left" />
    </div>

    <div v-if="restText" class="rest rest--mobile" v-html="restText"></div>
  </section>
</template>

<script>
import ImagesContainer from './ImagesContainer.vue';

export default {
  name: 'TwoColumnTextImagesWithSlot',
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
.two-col { width:100%; display:flex; gap:var(--rem, 7rem); align-items:flex-start; }
.left, .right { flex:1 1 0; min-width:0; }
/* prevent margin-collapsing so slot sits snugly under intro */
.left { padding-top:.1px; }

.intro-en { margin-bottom:.25rem; }
.intro-sv { margin-bottom:1rem; font-style:italic; }
.intro { margin-bottom:.75rem; }

.after-left :deep(.images-container){ margin-bottom:1.5rem; }
.right      :deep(.images-container){ margin-bottom:1.5rem; }

.rest { margin-top:1.5rem; }

/* default: desktop shows left slot only */
.after-right-mobile{ display:none; }
.rest--desktop{ display:block; }
.rest--mobile{ display:none; }

/* mobile order: intro -> right images -> later slot -> rest */
@media (max-width:768px){
  .two-col{ display:block; }
  .after-left{ display:none; }
  .after-right-mobile{ display:block; margin-top:.75rem; }
  .rest--desktop{ display:none; }
  .rest--mobile{ display:block; }
}
</style>
