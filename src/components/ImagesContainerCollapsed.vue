<template>
  <div class="collapsed-root" :style="outerMarginComputed">
    <!-- TITLE (always visible; markdown-enabled) -->
    <div class="title-row prose text-black leading-5">
      <div v-html="headerHTML"></div>
      <div class="controls">
        <button class="toggle" @click.stop="expanded = !expanded"
                :aria-expanded="expanded ? 'true' : 'false'">
          {{ expanded ? '−' : '+' }}
        </button>
        <template v-if="expanded && amountOfImagesComputed > 1">
          <button class="next" @click.stop="nextClicked" title="Next image">&gt;</button>
          <div class="count">{{ imageIndexComputed + 1 }}/{{ amountOfImagesComputed }}</div>
        </template>
      </div>
    </div>

    <!-- EXPANDED CONTENT: description + small image side-by-side -->
    <Transition name="fade" mode="out-in">
      <div v-if="expanded" class="body">
        <div v-if="hasDescription" class="desc prose text-black text-justify"
             v-html="imageTextHTML"
             @click.stop="$emit('descriptionClicked', { type: type || 'collapsed' })" />
        <div v-if="hasImagesComputed" class="img">
          <image-container
            :image-src="imageComputed"
            :max-height="imageRemSizeComputed"   
            :center-content="false"
            :isSmallScreen="isSmallScreen"
            @nextClicked="nextClicked"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import ImageContainer from './ImageContainer.vue';
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt({ breaks: true });

function normalizeIndent(s = '') {
  const lines = s.replace(/^\n/, '').split('\n');
  const ind = lines.filter(l => l.trim()).map(l => (l.match(/^(\s*)/) || ['', ''])[1].length);
  const min = ind.length ? Math.min(...ind) : 0;
  return lines.map(l => l.slice(min)).join('\n');
}

export default {
  name: 'ImagesContainerCollapsed',
  components: { ImageContainer },
  props: {
    header: { type: String, default: '' },     // supports markdown (inline)
    images: { type: Array,  default: () => [] },
    description: { type: String, default: '' },// supports markdown (block)
    type: { type: String, default: '' },
    remUnit: { type: Number, default: 7 },
    useMarkdown: { type: Boolean, default: true },
    isSmallScreen: { type: Boolean, default: false },
    showonload: { type: [Number, String], default: 0 },
    itemGapRem: { type: Number, default: .8 }
  },
  data: () => ({ imageIndex: 0, expanded: false }),
  mounted() { this.expanded = !!Number(this.showonload); },
  computed: {
    // rendering helpers
    headerHTML() { return this.useMarkdown ? md.renderInline(this.header || '') : (this.header || ''); },
    imageTextHTML() { return this.useMarkdown ? md.render(normalizeIndent(this.description || '')) : (this.description || ''); },

    // image state
    imageIndexComputed() { return this.imageIndex; },
    amountOfImagesComputed() { return Array.isArray(this.images) ? this.images.length : 0; },
    imageComputed() { return this.amountOfImagesComputed ? this.images[this.imageIndexComputed] : ''; },
    hasImagesComputed() { return this.amountOfImagesComputed > 0; },   // <-- fixes warning
    hasDescription() { return !!(this.description && this.description.trim()); },

    // layout
    outerMarginComputed() { return `margin: 0 0 ${this.itemGapRem}rem 0;`; },
    imageRemSizeComputed() { return this.remUnit * 3.2; } // smaller image for the split layout
  },
  methods: {
    nextClicked() {
      if (this.amountOfImagesComputed < 2) return;
      this.imageIndex = (this.imageIndex + 1) % this.amountOfImagesComputed;
    }
  }
};
</script>

<style scoped>
.title-row{
  display:flex; justify-content:space-between; align-items:center;
}
.controls{ display:flex; align-items:center; gap:.5rem; }
.toggle,.next{ cursor:crosshair; font-size:1.25rem; line-height:1; background:none; border:none; padding:0; }
.count{ font-size:.875rem; }

.desc{ align-self: start; text-justify: left; margin-top: 0.5rem; line-height: 1.3rem;}            /* make sure text sticks to the top */

.img{
  display: flex;                       /* prevent vertical centering inside */
  align-items: flex-start;
}

/* remove baseline gap / stray top margins inside the image container */
.img :deep(img){ display:block; vertical-align: top; }
.img :deep(*){ margin-top:1rem !important; padding-top:0 !important; margin-bottom: 1rem !important; }

.desc{ align-self:start; }
.img{ align-self:start; overflow:hidden; }

/* fade animation */
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Ensure collapsed body text is left-aligned */
.body,
.body :deep(p),
.body :deep(li),
.body :deep(blockquote) {
  text-align: left !important;
  text-justify: auto;
}
</style>
