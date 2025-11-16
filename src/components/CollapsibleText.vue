<template>
  <section class="ct">
    <button
      class="ct-head"
      type="button"
      :aria-expanded="open ? 'true' : 'false'"
      @click="toggle"
    >
      <span class="ct-title" v-html="renderMarkdown(displayHeader)"></span>

      <span class="ct-plus" aria-hidden="true">{{ open ? '–' : '+' }}</span>
    </button>

    <div v-show="open" class="ct-body">
      <slot v-if="$slots.default" />
      <div
        v-else
        v-html="useMarkdown ? renderMarkdown(resolvedText) : resolvedText"
      ></div>
    </div>
  </section>
</template>

<script>
import MarkdownIt from 'markdown-it';

// Markdown renderer
const md = new MarkdownIt({
  html: true,    // allow inline HTML like <br>
  breaks: true,  // treat line breaks as <br>
  linkify: true
});

export default {
  name: 'CollapsibleText',
  props: {
    // Header text
    header: { type: String, default: '' },
    headerEn: { type: String, default: '' },
    headerSv: { type: String, default: '' },

    // Body text
    description: { type: String, default: '' },
    descriptionEn: { type: String, default: '' },
    descriptionSv: { type: String, default: '' },
    text: { type: String, default: '' },
    textEn: { type: String, default: '' },
    textSv: { type: String, default: '' },

    // Language hint
    lang: { type: String, default: '' },

    // Behaviour
    useMarkdown: { type: Boolean, default: true },
    showonload: { type: Number, default: 0 }
  },
  data() {
    return { open: false };
  },
  created() {
    const p = Number(this.showonload);
    const prob = Number.isFinite(p) ? Math.min(Math.max(p, 0), 1) : 0;
    this.open = Math.random() < prob;
  },
  computed: {
    displayHeader() {
      if (this.header) return this.header;
      if (this.lang === 'sv') return this.headerSv || this.headerEn || '';
      if (this.lang === 'en') return this.headerEn || this.headerSv || '';
      return this.headerEn || this.headerSv || this.header || '';
    },
    resolvedText() {
      if (this.lang === 'sv')
        return this.descriptionSv || this.textSv || this.description || this.text || '';
      if (this.lang === 'en')
        return this.descriptionEn || this.textEn || this.description || this.text || '';
      return (
        this.descriptionEn ||
        this.textEn ||
        this.descriptionSv ||
        this.textSv ||
        this.description ||
        this.text ||
        ''
      );
    }
  },
  methods: {
    toggle() { this.open = !this.open; },
    renderMarkdown(txt) {
      if (!txt) return '';
      return md.render(String(txt));
    }
  }
};
</script>

<style scoped>

.ct-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  cursor: crosshair;
  margin-bottom: -1rem;
}

</style>
