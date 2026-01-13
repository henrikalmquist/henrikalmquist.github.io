
<template>
  <section class="two-col" :style="{ '--rem': remUnit + 'rem' }">
    <!-- LEFT column -->
    <div class="left">
      <!-- Part one -->
      <div class="intro" v-html="renderMarkdown(currentText(adaptive.partOne))"></div>

      <!-- Part two -->
      <div class="rest2">

      <!-- Collapsed statement after part two -->

      <ImagesContainerCollapsed
        v-for="(s, i) in statementsForLang"
        :key="i"
        :header="s.header"
        :images="s.images"
        :description="s.text"
        :showonload="s.showonload"
      >
        <template #default>
          <div class="statement-text" v-html="renderedMarkdown(s.text)"></div>
        </template>
      </ImagesContainerCollapsed>
 </div>
  </div>
<!-- <CollapsibleText
  :lang="lang"
  :header-en="adaptive.statement.headerEn"
  :header-sv="adaptive.statement.headerSv"
  :text-en="adaptive.statement.textEn || adaptive.statement.descriptionEn"
  :text-sv="adaptive.statement.textSv || adaptive.statement.descriptionSv"
  :use-markdown="true"
  :showonload="adaptive.statement.showonload"
/> -->

    <!-- RIGHT column -->

    
    <div class="right">
      <ImagesContainer
        v-if="adaptive.rightColumnImages.length"
        header=""
        :images="adaptive.rightColumnImages"
        description=""
        :use-markdown="true"
        :center-content="true"
        :rem-unit="remUnit"
        :showonload="0"
      />
    </div>
  </section>
</template>

<script>
import { inject } from 'vue';
import MarkdownIt from 'markdown-it';
import ImagesContainer from '../components/ImagesContainer.vue';
import ImagesContainerCollapsed from '../components/ImagesContainerCollapsed.vue';
import site from '../site.json';

const md = new MarkdownIt({ html: false, breaks: true, linkify: true });

export default {
  name: 'adaptivePage',
  components: { ImagesContainer, ImagesContainerCollapsed  },
  setup() {
    const lang = inject('lang', 'en'); // from App.vue toggle
    return { lang };
  },
  data() {
    return {
      adaptive: site.adaptive || {
        partOne: {}, partTwo: {}, statements: {}, rightColumnImages: []
      },
      remUnit: 7
    };
  },
  computed: {
  statementsForLang() {
    const stmts = this.adaptive.partTwo?.statements || [];
    return stmts.map(s => ({
      // before: header: s.header || s.title || '',
      header: this.lang === 'sv'
        ? (s.headerSv || s.header || s.title || '')
        : (s.header || s.title || ''),
      text: this.lang === 'sv' ? (s.sv || '') : (s.en || ''),
      images: Array.isArray(s.images) ? s.images : [],
      showonload: typeof s.showonload === 'number' ? s.showonload : 0
    }));
  }
  },
  methods: {
    renderMarkdown(text) {
      return md.render(text || '');
    },
    currentText(section) {
      if (!section) return '';
      return this.lang === 'sv' ? (section.sv || '') : (section.en || '');
    },
    currentHeader(statements) {
      if (!statements) return '';
      return this.lang === 'sv' ? (statements.headerSv || statements.headerEn || '') : (statements.headerEn || statements.headerSv || '');
    }
  }
};
</script>

<style scoped>
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--rem, 7rem);
  width: 100%;
  text-align: justify;
}

.left,
.right { min-width: 0;
  align-self: start; /* prevents stretching */
  text-align: justify;
 }

 .right > div {
  height: auto !important;
  margin-bottom: 0 !important;
}

.right img {
  height: auto !important;
  max-height: none !important;
}

/* Mobile: order = Part one → image → Part two → statements → Part three */
@media (max-width: 768px) {
  .two-col {
    grid-template-columns: 1fr;
    grid-template-areas:
      "intro"
      "right"
      "rest2"
      "stmt"
      "rest3";
    gap: 0rem;
  }

  .left { display: contents; }

  .intro { grid-area: intro; }
  .right { grid-area: right; margin: 0rem 0; }
  /* First .rest (part two) gets area rest1; second .rest (part three) becomes rest2 */
  .rest:first-of-type { grid-area: rest1; }
  .after-part-two { grid-area: stmt; }
  .rest:last-of-type { grid-area: rest2; }
}

</style>
