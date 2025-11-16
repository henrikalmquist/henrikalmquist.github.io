<template>
  <section class="portfolio-wrap">
    <FeatureColumns
      :features="features"
      :intro-text="introText"
      :rem-unit="7"
      :use-markdown="true"
      :center-images="true"
      @featureClicked="onFeatureClicked"
    />
  </section>
</template>

<script>
import { inject } from 'vue'
import FeatureColumns from '../components/FeatureColumns.vue'
import site from '../site.json'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()
const DIARY_COUNT = 10

function normalizeLang(v) {
  const s = String(v || '').toLowerCase()
  if (s.startsWith('sv') || s.startsWith('se')) return 'sv'
  return 'en'
}

export default {
  name: 'ArchitecturePage',
  components: { FeatureColumns },

  // If App.vue provides a reactive language ref, we can consume it here
  inject: {
    langRef: { from: 'langRef', default: null }
  },

    setup() {
    // Support Agency’s provide('lang', ref) pattern as well
    const lang = inject('lang', null)
    return { lang }
  },


  data() {
    return {
      projects: Array.isArray(site?.architecture?.projects)
        ? site.architecture.projects
        : [],
      langInternal: 'en',
      removeLangListener: null
    }
  },

  created() {
    // initial language
    this.langInternal = this.detectLang()

    // react if App.vue changes $root.lang
    this.$watch(
      () => this.$root && this.$root.lang,
      (val) => { if (val) this.langInternal = normalizeLang(val) },
      { immediate: false }
    )
  },

  mounted() {
    // react to custom event from header toggle (if used)
    const handler = (e) => {
      const next = normalizeLang(e?.detail)
      if (next && next !== this.langInternal) this.langInternal = next
    }
    window.addEventListener('lang-changed', handler)
    this.removeLangListener = () => window.removeEventListener('lang-changed', handler)
  },

  beforeUnmount() {
    if (this.removeLangListener) this.removeLangListener()
  },

  watch: {
    // update if router changes (query/params)
    $route() {
      const now = this.detectLang()
      if (now !== this.langInternal) this.langInternal = now
    }
  },

  computed: {
    // Single source of truth for language, reactive:
        // Single source of truth for language, reactive:
    lang() {
      // 1) App provides a ref named 'langRef' (your current pattern)
      if (this.langRef && this.langRef.value) {
        return normalizeLang(this.langRef.value)
      }

      // 2) App provides a ref (or raw string) named 'lang' (Agency’s pattern)
      if (this.lang != null) {
        // could be a ref or a plain string
        const v = (this.lang && typeof this.lang === 'object' && 'value' in this.lang)
          ? this.lang.value
          : this.lang
        if (v) return normalizeLang(v)
      }

      // 3) Fallback to your internal reactive value (URL, localStorage, etc.)
      return this.langInternal
    },


    features() {
      const projectItems = this.projects.map((p, idx) => {
        const titleBase = this.pickTitle(p)
        const indexStr =
          (p.index && String(p.index).trim()) ||
          ('AAA' + String(idx + 1).padStart(3, '0'))

        const header = `${indexStr} ${titleBase}`.trim()
        const body = this.pickBody(p)

        return {
          header,
          text: body,
          images: Array.isArray(p.images) ? p.images : [],
          prio: typeof p.prio === 'number' ? p.prio : 0,
          showonload: this.probToShowOnLoad(p.showonload)
        }
      })

      const diaryItems = this.buildRandomDiaryItems(DIARY_COUNT)
      return projectItems.concat(diaryItems)
    },

introText() {
  if (this.lang === 'sv') {
    return `
AAA arbetar med renovering, tillägg och strategier för den befintliga miljön. Genom en kombination av ekonomisk och teknisk kunskap, sammanvävd med ekologiska och kulturella hänsyn, omtolkas de befintliga kvaliteterna till generösa och funktionella rum.

`
  }

  // English default
  return `
AAA works with renovations, additions and strategies for the existing environment. Through the lens of an economic and technical know-how, weaved with ecological and cultural considerations, the present qualities are reinterpreted into a generous and functional space. 

`
},


  },

  methods: {
    // ——— Language detection aligned with Adaptive patterns ———
    detectLang() {
      try {
        // query ?lang=
        const q = this.$route?.query?.lang
        if (q) return normalizeLang(q)

        // params /:lang/...
        const p = this.$route?.params?.lang
        if (p) return normalizeLang(p)

        // path contains /sv
        const path = typeof window !== 'undefined' ? window.location.pathname : ''
        if (/(^|\/)sv(\/|$)/i.test(path)) return 'sv'

        // <html lang="sv">
        const htmlLang = (typeof document !== 'undefined' && document.documentElement?.lang) || ''
        if (htmlLang) return normalizeLang(htmlLang)

        // localStorage
        const ls = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : ''
        if (ls) return normalizeLang(ls)

        // root lang if provided
        const rootLang = this.$root && this.$root.lang
        if (rootLang) return normalizeLang(rootLang)
      } catch (_) {}

      return 'en'
    },

    pickTitle(p) {
      // allow both 'title' and 'titleSv' in site.json
      if (this.lang === 'sv') {
        return p.titleSv || p.title_sv || p.titleSWE || p.title || ''
      }
      return p.title || p.titleEn || p.title_en || p.titleSv || ''
    },

    pickBody(p) {
      if (this.lang === 'sv') {
        return p.sv || p.textSv || p.text_sv || p.descriptionSv || ''
      }
      return p.en || p.textEn || p.text_en || p.descriptionEn || ''
    },

    onFeatureClicked(_feature) {},

    renderMd(txt) {
      return md.render(txt || '')
    },

    // ----- visual diary helpers (as you had them) -----
    allDiaryPaths() {
      return Array.from({ length: 16 }, (_, i) => {
        const num = String(i + 1).padStart(3, '0')
        return `/img/AAAvisualdiary/AAAvisualdiary${num}.jpg`
      })
    },

    pickRandom(arr, n) {
      const a = arr.slice()
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a.slice(0, n)
    },

    buildRandomDiaryItems(n) {
      const selected = this.pickRandom(this.allDiaryPaths(), n)
      return selected.map((src, index) => {
        const prio = (index % 2) + 2 // 2, 3
        return {
          images: [src],
          header: '',
          text: '',
          prio,
          showonload: 0
        }
      })
    },

    // Convert prob (0..1) to 0/1 for your component
    probToShowOnLoad(p) {
      const n = Number(p)
      if (!isFinite(n)) return 0
      if (n > 1) return n ? 1 : 0
      return Math.random() < Math.max(0, Math.min(1, n)) ? 1 : 0
    }
  }
}
</script>

<style scoped>
.portfolio-wrap { width: 100%; }

/* Left-align all paragraph-style text rendered inside child components */
:deep(p),
:deep(li),
:deep(blockquote) {
  text-align: left !important;
  text-justify: auto; /* neutralise full justification if a global rule set it */
}

/* Common markdown wrappers some components use */
:deep(.statement-text p),
:deep(.description p),
:deep(.markdown p),
:deep(.md p) {
  text-align: left !important;
}

/* Do NOT touch headings */
:deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
  text-align: inherit;
}
</style>
