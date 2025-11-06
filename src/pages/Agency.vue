
<template>
  <section class="two-col" :style="{ '--rem': remUnit + 'rem' }">
    <!-- LEFT column -->
    <div class="left">
      <!-- Part one -->
      <div class="intro" v-html="renderMarkdown(currentText(agency.partOne))"></div>

      <!-- Part two -->
      <div class="rest2" v-if="currentText(agency.partTwo)" v-html="renderMarkdown(currentText(agency.partTwo))"></div>

      <!-- Collapsed statement after part two -->
<CollapsibleText
  :lang="lang"
  :header-en="agency.statement.headerEn"
  :header-sv="agency.statement.headerSv"
  :text-en="agency.statement.textEn || agency.statement.descriptionEn"
  :text-sv="agency.statement.textSv || agency.statement.descriptionSv"
  :use-markdown="true"
  :showonload="agency.statement.showonload"
/>



      <!-- Part three -->
      <div class="rest3" v-if="currentText(agency.partThree)" v-html="renderMarkdown(currentText(agency.partThree))"></div>
    </div>

    <!-- RIGHT column -->
    <div class="right">
      <ImagesContainer
        v-if="agency.rightColumnImages.length"
        header=""
        :images="agency.rightColumnImages"
        description=""
        :use-markdown="true"
        :center-content="true"
        :rem-unit="remUnit"
        :showonload="1"
      />
    </div>
  </section>
</template>

<script>
import { inject } from 'vue';
import MarkdownIt from 'markdown-it';
import ImagesContainer from '../components/ImagesContainer.vue';
import CollapsibleText from '../components/CollapsibleText.vue';
import site from '../site.json';

const md = new MarkdownIt({ html: false, breaks: true, linkify: true });

export default {
  name: 'AgencyPage',
  components: { ImagesContainer, CollapsibleText  },
  setup() {
    const lang = inject('lang', 'en'); // from App.vue toggle
    return { lang };
  },
  data() {
    return {
      agency: site.agency || {
        partOne: {}, partTwo: {}, statement: {}, partThree: {}, rightColumnImages: []
      },
      remUnit: 7
    };
  },
  computed: {
    hasStatement() {
      const s = this.agency.statement || {};
      return (s.headerEn || s.headerSv || s.en || s.sv);
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
    currentHeader(statement) {
      if (!statement) return '';
      return this.lang === 'sv' ? (statement.headerSv || statement.headerEn || '') : (statement.headerEn || statement.headerSv || '');
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
}

.left,
.right { min-width: 0; }

/* Mobile: order = Part one → image → Part two → statement → Part three */
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
