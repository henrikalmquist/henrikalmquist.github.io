<template>
  <section class="adaptive">
    <!-- Part one text + right column images -->
    <TwoColumnTextImagesWithSlot
      :intro-en="renderedMarkdown(currentText(adaptive.partOne))"
      :intro-sv="''"
      :items="rightItems"
    />

    <!-- Collapsible statements -->
    <div class="statements">
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
  </section>
</template>

<script>
import { inject } from 'vue';
import MarkdownIt from 'markdown-it';
import site from '../site.json';
import TwoColumnTextImagesWithSlot from '../components/TwoColumnTextImagesWithSlot.vue';
import ImagesContainerCollapsed from '../components/ImagesContainerCollapsed.vue';

const md = new MarkdownIt({ html: false, breaks: true, linkify: true });

export default {
  name: 'AdaptivePage',
  components: { TwoColumnTextImagesWithSlot, ImagesContainerCollapsed },
  setup() {
    const lang = inject('lang', 'en'); // from App.vue toggle
    return { lang };
  },
  
  data() {
    const adaptive = site.adaptive || {
      partOne: { en: '', sv: '' },
      partTwo: { statements: [] },
      rightColumnImages: []
    };

    // right-column images
    const rightItems = (adaptive.rightColumnImages || []).map(src => ({
      header: '',
      images: [src],
      description: ''
    }));

    return { adaptive, rightItems };
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
}
,
  methods: {
    renderedMarkdown(txt) {
      return md.render(txt || '');
    },
    currentText(section) {
      if (!section) return '';
      return this.lang === 'sv' ? section.sv : section.en;
    }
  }
};
</script>

<style scoped>
.adaptive {
  width: 100%;
  color: #000;
}

.statements {
  margin-top: 3rem;
}

.statement-text {
  padding-top: 0.5rem;
}

/* Ensure collapsed body text is left-aligned */
.body,
.body :deep(p),
.body :deep(li),
.body :deep(blockquote) {
  text-align: left !important;
  text-justify: auto;
}

</style>
