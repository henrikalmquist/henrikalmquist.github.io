<template>
  <div :style="outerMarginComputed">
    <Transition name="fade" mode="out-in">
      <div :key="imageIndexComputed" v-if="hasImagesComputed">
        <image-container
          :image-src="imageComputed"
          :max-height="imageRemSizeComputed"
          :center-content="centerContent"
          :isSmallScreen="isSmallScreen"
          @nextClicked="nextClicked"
        />
      </div>
    </Transition>

    <!-- text wrapper (no click-to-next here) -->
    <div
      class="flex flex-col w-full prose text-black text-justify cursor-crosshair"
      style="max-width: inherit;"
      :class="textClassComputed"
    >
      <!-- header row -->
      <div v-if="hasImagesComputed" class="w-full flex mb-0 justify-between items-center">
        <!-- left: title -->
        <div v-if="header" v-text="header"></div>

        <!-- right: +, >, counter -->
        <div class="flex items-center">
          <!-- toggle text (+/−) — shown only when there is description -->
          <button
            v-if="hasDescription"
            class="cursor-crosshair select-none text-xl leading-none"
            style="margin-right: 8px;"
            @click.stop="showText = !showText"
            :aria-expanded="showText ? 'true' : 'false'"
            aria-label="Toggle description"
            title="Toggle description"
          >
            {{ showText ? '−' : '+' }}
          </button>

          <!-- advance image (>) -->
          <button
            v-if="amountOfImagesComputed > 1"
            class="cursor-crosshair select-none text-xl leading-none"
            style="margin-right: 8px;"
            @click.stop="nextClicked"
            aria-label="Next image"
            title="Next image"
          >
            &gt;
          </button>

          <!-- counter -->
          <div v-if="amountOfImagesComputed > 1">
            {{ imageIndexComputed + 1 }}/{{ amountOfImagesComputed }}
          </div>
        </div>
      </div>

      <!-- text: always visible for intro, collapsible otherwise -->
      <div
        v-if="type === 'intro' || (hasDescription && showText)"
        class="mt-0"
        @click.stop="descriptionClicked"
      >
        <div v-if="hasDescription" v-html="imageTextComputed"></div>

        <div v-if="type !== 'intro' && hasMetaComputed && showText" class="meta-table">
          <div
            v-for="(item, i) in meta"
            :key="`${header || 'meta'}-${i}`"
            class="meta-row"
          >
            <div class="meta-label">{{ item.label }}</div>
            <div class="meta-value">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageContainer from './ImageContainer.vue';
import MarkdownIt from 'markdown-it';
const markdown = new MarkdownIt({ breaks: true, html: true });

// remove common leading spaces so Markdown doesn't create code blocks
function normalizeIndent(s) {
  const raw = (s || '').replace(/^\n/, '');
  const lines = raw.split('\n');
  const indents = lines
    .filter(l => l.trim().length > 0)
    .map(l => (l.match(/^(\s*)/) || ['', ''])[1].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map(l => l.slice(min)).join('\n');
}

export default {
  name: 'ImagesContainer',
  components: { ImageContainer },
  props: {
    images: { type: Array, default: () => [] },
    header: { type: String, default: '' },
    type: { type: String, default: '' },          // "intro" keeps text always visible
    description: { type: String, default: '' },
    meta: { type: Array, default: () => [] },
    remUnit: { type: Number, default: 7 },
    useMarkdown: { type: Boolean, default: true },
    centerContent: { type: Boolean, default: true },
    isSmallScreen: { type: Boolean, default: false },
    showonload: { type: [Number, Boolean], default: 0 }, // open text on load (non-intro)
  },
  data() {
    return {
      imageIndex: 0,
      showText: false,
    };
  },
  mounted() {
    if (this.type !== 'intro') this.showText = !!Number(this.showonload);
  },
  computed: {
    hasDescription() {
      return !!(this.description && this.description.trim().length > 0);
    },
    hasMetaComputed() {
      return Array.isArray(this.meta) && this.meta.length > 0;
    },
    imageIndexComputed() { return this.imageIndex; },
    imageComputed() { return this.images[this.imageIndexComputed]; },
    amountOfImagesComputed() { return this.images.length; },
    imageTextComputed() {
      if (!this.useMarkdown) return this.description || '';
      return markdown.render(normalizeIndent(this.description || ''));
    },
    hasImagesComputed() { return this.amountOfImagesComputed > 0; },
    textClassComputed() {
      let result = this.hasImagesComputed ? 'mt-7' : '';
      result += this.type === 'intro' ? ' font-sans leading-5' : ' leading-5';
      return result;
    },
    outerMarginComputed() {
      const remSize = this.isSmallScreen ? (this.remUnit * 2) / 3 : this.remUnit;
      return `margin-bottom: ${remSize * .8}rem`;
    },
    imageRemSizeComputed() {
      return this.type === 'intro' ? this.remUnit * 5 : this.remUnit * 4;
    },
  },
  methods: {
    nextClicked() {
      let next = this.imageIndex + 1;
      if (next >= this.amountOfImagesComputed) next = 0;
      this.imageIndex = next;
    },
    descriptionClicked() {
      this.$emit('descriptionClicked', { type: this.type });
    },
  },
};
</script>


<style scoped>
.fade-enter-active { transition: opacity 0.25s ease; }
.fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.meta-table {
  margin-top: 1.25rem;
}

.meta-row {
  display: grid;
  grid-template-columns: 6rem 1fr;
  column-gap: 0rem;
  margin-bottom: 0.25rem;
  align-items: start;
}

.meta-label,
.meta-value {
  line-height: 1.3;
}

.meta-label {
  opacity: 1;
}

:deep(.meta-table p) {
  margin: 0 !important;
}

</style>
