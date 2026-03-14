<template>
  <section class="two-col" :style="{ '--rem': remUnit + 'rem' }">
    <div class="left delayed-real">
      <div
        class="intro"
        v-html="renderMarkdown(currentText(agency.partOne))"
      ></div>

      <div>
        <ImagesContainerCollapsed
          v-for="(p, i) in profileForLang"
          :key="'profile-' + i"
          :header="p.header"
          :images="p.images"
          :description="p.text"
          :showonload="p.showonload"
          :rem-unit="remUnit"
        />
      </div>

      <div class="after-part-two">
        <CollapsibleText
          :lang="lang"
          :header-en="agency.statement.headerEn"
          :header-sv="agency.statement.headerSv"
          :text-en="agency.statement.textEn || agency.statement.descriptionEn"
          :text-sv="agency.statement.textSv || agency.statement.descriptionSv"
          :use-markdown="true"
          :showonload="agency.statement.showonload"
        />
      </div>

      <div class="rest3">
        <CollapsibleText
          :lang="lang"
          :header-en="agency.plusone.headerEn"
          :header-sv="agency.plusone.headerSv"
          :text-en="agency.plusone.textEn || agency.plusone.descriptionEn"
          :text-sv="agency.plusone.textSv || agency.plusone.descriptionSv"
          :use-markdown="true"
          :showonload="agency.plusone.showonload"
        />
        </div>
      <div class="rest4">
        <CollapsibleText
          :lang="lang"
          :header-en="agency.plustwo.headerEn"
          :header-sv="agency.plustwo.headerSv"
          :text-en="agency.plustwo.textEn || agency.plustwo.descriptionEn"
          :text-sv="agency.plustwo.textSv || agency.plustwo.descriptionSv"
          :use-markdown="true"
          :showonload="agency.plustwo.showonload"
        />
      </div>
    </div>

    <div class="right delayed-real">
      <div>
        <ImagesContainer
          v-if="agency.rightColumnImages.length > 0"
          header=""
          :images="[agency.rightColumnImages[0]]"
          description=""
          :use-markdown="true"
          :center-content="true"
          :rem-unit="remUnit"
          :showonload="1"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { inject } from 'vue'
import MarkdownIt from 'markdown-it'
import ImagesContainer from '../components/ImagesContainer.vue'
import CollapsibleText from '../components/CollapsibleText.vue'
import ImagesContainerCollapsed from '../components/ImagesContainerCollapsed.vue'
import site from '../site.json'

const md = new MarkdownIt({ html: false, breaks: true, linkify: true })

function normalizeIndent(s = '') {
  const lines = String(s).replace(/^\n/, '').replace(/\r\n/g, '\n').split('\n')
  const ind = lines
    .filter(l => l.trim())
    .map(l => (l.match(/^(\s*)/) || ['', ''])[1].length)
  const min = ind.length ? Math.min(...ind) : 0
  return lines.map(l => l.slice(min)).join('\n')
}

export default {
  name: 'AgencyPage',
  components: { ImagesContainer, CollapsibleText, ImagesContainerCollapsed },

  setup() {
    const lang = inject('lang', 'en')
    return { lang }
  },

  data() {
    return {
      agency: site.agency || {
        partOne: {},
        partTwo: {},
        profile: [],
        statement: {},
        plusone: {},
        plustwo: {},
        partThree: {},
        rightColumnImages: []
      },
      remUnit: 7
    }
  },

  computed: {
    profileForLang() {
      const profiles = this.agency.profile || []
      return profiles.map(p => ({
        header: this.lang === 'sv'
          ? (p.headerSv || p.header || '')
          : (p.header || ''),
        text: this.lang === 'sv'
          ? (p.sv || '')
          : (p.en || ''),
        images: Array.isArray(p.images) ? p.images : [],
        showonload:
          typeof p.showonload === 'number'
            ? p.showonload
            : Number(p.showonload) || 0
      }))
    },

    hasStatement() {
      const s = this.agency.statement || {}
      return !!(s.headerEn || s.headerSv || s.en || s.sv)
    }
  },

  methods: {
    renderMarkdown(text) {
      const t = normalizeIndent(('\n' + (text || '') + '\n').replace(/\r\n/g, '\n'))
      return md.render(t)
    },

    currentText(section) {
      if (!section) return ''
      return this.lang === 'sv' ? (section.sv || '') : (section.en || '')
    },

    currentHeader(statement) {
      if (!statement) return ''
      return this.lang === 'sv'
        ? (statement.headerSv || statement.headerEn || '')
        : (statement.headerEn || statement.headerSv || '')
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
}

.rest3 {
  margin-top: 1.5rem;
}

.rest4 {
  margin-top: 1.5rem;
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

.intro ::v-deep ul {
  margin-bottom: 1rem;
}

::v-deep ul {
  list-style-type: disc;
  list-style-position: outside;
  padding-left: 1.25rem;
  margin-top: 0.4rem;
  margin-bottom: 0.8rem;
}

::v-deep ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

::v-deep li {
  margin: 0.2rem 0;
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
      "rest2"
      "stmt"
      "rest3"
      "rest4";
    gap: 0rem;
  }

  .right > div {
    margin-bottom: 0 !important;
  }

  .left {
    display: contents;
    margin-bottom: 5rem;
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

  .after-part-two {
    grid-area: stmt;
  }

  .rest3 {
    grid-area: rest3;
  }
}

.right ::v-deep ul {
  list-style-type: disc;
  list-style-position: outside;
  padding-left: 1.25rem;
  margin-top: 0.4rem;
  margin-bottom: 0.8rem;
}

.right ::v-deep ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

.right ::v-deep ul li::marker {
  opacity: 1;
  font-size: 1em;
}
</style>