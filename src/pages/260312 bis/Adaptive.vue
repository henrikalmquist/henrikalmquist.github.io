<template>
  <section class="two-col" :style="{ '--rem': remUnit + 'rem' }">
    <div class="left forced-fade">
      <div
        v-if="currentText(adaptive.partOne)"
        class="intro forced-fade"
        v-html="renderMarkdown(currentText(adaptive.partOne))"
      ></div>

      <div v-if="showDelayed" class="rest2 forced-fade">
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

    <div class="right">
      <div v-if="showDelayed" class="forced-fade">
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

function normalizeLang(v) {
  const s = String(v || '').toLowerCase()
  if (s.startsWith('sv') || s.startsWith('se')) return 'sv'
  return 'en'
}

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

  inject: {
    langRef: { from: 'langRef', default: null }
  },

  setup() {
    const injectedLang = inject('lang', null)
    return { injectedLang }
  },

  data() {
    return {
      adaptive: site.adaptive || {
        partOne: {},
        partTwo: {},
        statements: {},
        rightColumnImages: []
      },
      remUnit: 7,
      langInternal: 'en',
      removeLangListener: null,
      showDelayed: false,
      delayedTimer: null
    }
  },

  created() {
    this.langInternal = this.detectLang()

    this.$watch(
      () => this.$root && this.$root.lang,
      (val) => {
        if (val) this.langInternal = normalizeLang(val)
      },
      { immediate: false }
    )
  },

  mounted() {
    const handler = (e) => {
      const next = normalizeLang(e?.detail)
      if (next && next !== this.langInternal) this.langInternal = next
    }

    window.addEventListener('lang-changed', handler)
    this.removeLangListener = () => window.removeEventListener('lang-changed', handler)

    this.startDelayedReveal()
  },

  beforeUnmount() {
    if (this.removeLangListener) this.removeLangListener()
    if (this.delayedTimer) clearTimeout(this.delayedTimer)
  },

  watch: {
    $route() {
      const now = this.detectLang()
      if (now !== this.langInternal) this.langInternal = now
      this.startDelayedReveal()
    },

    lang() {
      this.startDelayedReveal()
    }
  },

  computed: {
    lang() {
      if (this.langRef && this.langRef.value) {
        return normalizeLang(this.langRef.value)
      }

      if (this.injectedLang != null) {
        const v =
          this.injectedLang &&
          typeof this.injectedLang === 'object' &&
          'value' in this.injectedLang
            ? this.injectedLang.value
            : this.injectedLang

        if (v) return normalizeLang(v)
      }

      return this.langInternal
    },

    statementsForLang() {
      const stmts = this.adaptive.partTwo?.statements || []
      return stmts.map((s) => ({
        header:
          this.lang === 'sv'
            ? (s.headerSv || s.header || s.title || '')
            : (s.header || s.title || s.headerSv || ''),
        text:
          this.lang === 'sv'
            ? (s.sv || s.textSv || s.descriptionSv || '')
            : (s.en || s.textEn || s.descriptionEn || ''),
        images: Array.isArray(s.images) ? s.images : [],
        showonload:
          typeof s.showonload === 'number'
            ? s.showonload
            : Number(s.showonload) || 0
      }))
    }
  },

  methods: {
    startDelayedReveal() {
      this.showDelayed = false

      if (this.delayedTimer) clearTimeout(this.delayedTimer)

      this.delayedTimer = setTimeout(() => {
        this.showDelayed = true
      }, 0)
    },

    detectLang() {
      try {
        const q = this.$route?.query?.lang
        if (q) return normalizeLang(q)

        const p = this.$route?.params?.lang
        if (p) return normalizeLang(p)

        const path = typeof window !== 'undefined' ? window.location.pathname : ''
        if (/(^|\/)sv(\/|$)/i.test(path)) return 'sv'

        const htmlLang =
          (typeof document !== 'undefined' && document.documentElement?.lang) || ''
        if (htmlLang) return normalizeLang(htmlLang)

        const ls =
          typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : ''
        if (ls) return normalizeLang(ls)

        const rootLang = this.$root && this.$root.lang
        if (rootLang) return normalizeLang(rootLang)
      } catch (_) {}

      return 'en'
    },

    renderMarkdown(text) {
      return md.render(normalizeIndent(text || ''))
    },

    currentText(section) {
      if (!section) return ''
      return this.lang === 'sv'
        ? (section.sv || section.textSv || section.descriptionSv || '')
        : (section.en || section.textEn || section.descriptionEn || '')
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

.right > div {
  height: auto !important;
  margin-bottom: 0 !important;
}

.right img {
  height: auto !important;
  max-height: none !important;
}

.forced-fade {
  animation: adaptiveFade 1s ease  forwards;
}

@keyframes adaptiveFade {
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