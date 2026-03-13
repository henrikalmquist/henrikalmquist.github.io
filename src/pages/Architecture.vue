<template>
  <section class="portfolio-wrap">
    <div class="delayed-real">
      <FeatureColumns
        :features="features"
        :intro-text="introText"
        :rem-unit="7"
        :use-markdown="true"
        :center-images="true"
        @featureClicked="onFeatureClicked"
      />
    </div>
  </section>
</template>

<script>
import { inject } from 'vue'
import FeatureColumns from '../components/FeatureColumns.vue'
import site from '../site.json'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()
const DIARY_COUNT = 10

export default {
  name: 'ArchitecturePage',
  components: { FeatureColumns },

  setup() {
    const lang = inject('lang', 'en')
    return { lang }
  },

  data() {
    return {
      projects: Array.isArray(site?.architecture?.projects)
        ? site.architecture.projects
        : []
    }
  },

  computed: {
    features() {
      const projectItems = this.projects
  .filter(p => p.prio > 0)
  .map((p, idx) => {
        const titleBase = this.pickTitle(p)
        const indexStr =
          (p.index && String(p.index).trim()) ||
          ('AAA' + String(idx + 1).padStart(3, '0'))

        const header = `${indexStr} ${titleBase}`.trim()
        const body = this.pickBody(p)

        return {
          header,
          text: body,
          meta: Array.isArray(p.meta) ? p.meta : [],
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

      return `
AAA works with renovations, additions and strategies for the existing environment. Through economic and technical know-how, ecological and cultural care, the potential for reuse in buildings and places is revealed and developed into generous and functional spaces.

<div class="service-line">
  <div class="service-title"><strong>Consultancy</strong></div>
  <div class="service-desc">
    <a href="@#/adaptive" class="blink-link">Unlocking existing values</a>
   in early-stage phases and providing strategic and practical decision support for municipalities and developers.
  </div>
</div>

<div class="service-line">
  <div class="service-title"><strong>Research</strong></div>
  <div class="service-desc">Building knowledge and innovation at the intersection of the existing built environment, emerging technologies and building processes.</div>
</div>

<div class="service-line">
  <div class="service-title"><strong>Architecture</strong></div>
  <div class="service-desc">Design and delivery of renovation, addition and urban planning projects.</div>
</div>
`
    }
  },

  methods: {
    pickTitle(p) {
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
        const prio = (index % 2) + 2
        return {
          images: [src],
          header: '',
          text: '',
          prio,
          showonload: 0
        }
      })
    },

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
.portfolio-wrap {
  width: 100%;
}

.delayed-real {
  opacity: 0;
  animation: delayedRealFade 0.8s ease forwards;
}

@keyframes delayedRealFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

:deep(.blink-link) {
  text-decoration: underline;
  animation: blinkColors 2s steps(1) infinite;
}

@keyframes blinkColors {
  0% { font-style: normal; }
  50% { font-style: oblique; }
  100% { font-style: normal; }
}

:deep(a) {
  font-style: normal;
}

:deep(.service-line) {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 0px;
  margin-top: 0.6rem;
}

:deep(.service-desc) {
  text-indent: 0;
}

:deep(.service-desc a) {
  text-decoration: underline;
  color: inherit;
}
</style>