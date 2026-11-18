<template>
  <section class="two-col" :style="{ '--rem': remUnit + 'rem' }">
    <div class="left delayed-real">
      <div
        v-if="currentText(adaptive.partOne)"
        class="intro"
        v-html="renderMarkdown(currentText(adaptive.partOne))"
      ></div>

      <div class="rest2">
        <ImagesContainerCollapsed
          v-for="(s, i) in statementsForLang"
          :key="i"
          :header="s.header"
          :images="s.images"
          :description="s.text"
          :showonload="s.showonload"
          :rem-unit="remUnit"
        />
      </div>
    </div>

    <div class="right delayed-real">
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
import { inject } from 'vue'
import MarkdownIt from 'markdown-it'
import ImagesContainer from '../components/ImagesContainer.vue'
import ImagesContainerCollapsed from '../components/ImagesContainerCollapsed.vue'
import site from '../site.json'

const md = new MarkdownIt({ html: false, breaks: true, linkify: true })

function normalizeIndent(s = '') {
  const lines = String(s).replace(/^\n/, '').replace(/\r\n/g, '\n').split('\n')
  const indents = lines
    .filter(l => l.trim())
    .map(l => (l.match(/^(\s*)/) || ['', ''])[1].length)
  const min = indents.length ? Math.min(...indents) : 0
  return lines.map(l => l.slice(min)).join('\n')
}

export default {
  name: 'AdaptivePage',
  components: { ImagesContainer, ImagesContainerCollapsed },

  setup() {
    const lang = inject('lang', 'en')
    return { lang }
  },

  data() {
    return {
      adaptive: site.adaptive || {
        partOne: {},
        partTwo: { statements: [] },
        rightColumnImages: []
      },
      remUnit: 7
    }
  },

  computed: {
    statementsForLang() {
      const stmts = this.adaptive.partTwo?.statements || []

      return stmts.map((s) => ({
        header: this.lang === 'sv'
          ? (s.headerSv || s.header || '')
          : (s.header || s.headerSv || ''),

        text: this.lang === 'sv'
          ? (s.sv || '')
          : (s.en || ''),

        images: Array.isArray(s.images) ? s.images : [],

        showonload:
          typeof s.showonload === 'number'
            ? s.showonload
            : Number(s.showonload) || 0
      }))
    }
  },

  methods: {
    renderMarkdown(text) {
      return md.render(normalizeIndent(text || ''))
    },

    currentText(section) {
      if (!section) return ''
      return this.lang === 'sv' ? (section.sv || '') : (section.en || '')
    }
  }
}
</script>

<style scoped>
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--rem, 7rem);
  width: 100%;
}

.left,
.right {
  min-width: 0;
  align-self: start;
}

.delayed-real {
  opacity: 0;
  animation: delayedRealFade 0.8s ease forwards;
}

.left.delayed-real {
  animation-delay: 0s;
}

.right.delayed-real {
  animation-delay: 0.15s;
}

@keyframes delayedRealFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .two-col {
    grid-template-columns: 1fr;
    grid-template-areas:
      "intro"
      "right"
      "rest2";
    gap: 0rem;
  }

  .left {
    display: contents;
  }

  .intro {
    grid-area: intro;
  }

  .right {
    grid-area: right;
    margin: 0rem 0;
  }

  .rest2 {
    grid-area: rest2;
  }
}
</style>