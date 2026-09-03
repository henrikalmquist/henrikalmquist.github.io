<template>
  <section class="project-page">
    <!-- Project-local header stays fixed while the project scrolls underneath -->
    <div class="project-local-header">
      <span>{{ project.index }}</span>
      <span>{{ project.title }}</span>
      <router-link :to="project.back.to">
        {{ project.back.label }}
      </router-link>
    </div>

    <!-- Overview is the first view shown when entering the project. -->
    <div
      class="project-view overview-view"
      :class="{ 'is-active': currentView === 'overview' }"
      :aria-hidden="currentView !== 'overview'"
      @click.capture="switchView('scenarios')"
    >
      <ScenarioOverview
        class="overview-visual"
        :items="project.items || []"
        :counts="scenarioCounts"
      />

      <div class="overview-controls">
        <button
          class="view-switch-link"
          type="button"
          @click="switchView('scenarios')"
        >
          Switch to scenarios
        </button>

        <div
          v-if="!isMobile"
          class="vote-diagram"
          role="img"
          aria-label="Collective Could You Live Here votes by scenario"
        >
          <div class="vote-diagram-title">Vote for your favourite scenario:</div>
          <div
            v-for="row in voteDiagramRows"
            :key="'overview-diagram-' + row.id"
            class="vote-diagram-row"
          >
            <span class="vote-diagram-label">{{ row.label }}</span>
            <div class="vote-diagram-track">
              <div
                class="vote-diagram-bar"
                :style="{ width: voteBarWidth(row.votes) }"
              ></div>
            </div>
            <span class="vote-diagram-count">{{ row.votes }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed horizontally scrolling scenario view. -->
    <div
      class="project-view scenario-view"
      :class="{ 'is-active': currentView === 'scenarios' }"
      :aria-hidden="currentView !== 'scenarios'"
    >
      <div
        ref="scroll"
        class="project-scroll"
        @wheel="handleWheel"
      >
      <div ref="track" class="project-track">
        <!-- Column 1: project introduction + static diagram -->
        <aside class="project-intro-column">
          <div class="project-intro">
            <div v-html="renderMarkdown(project.intro)"></div>

            <div
              v-if="project.details && project.details.length"
              class="project-details"
              aria-label="Project information"
            >
              <div
                v-for="(detail, detailIndex) in project.details"
                :key="'project-detail-' + detailIndex"
                class="project-detail-row"
              >
                <span class="project-detail-label">{{ detail.label }}</span>
                <span class="project-detail-value">{{ detail.value }}</span>
              </div>
            </div>

            <div v-if="project.links && project.links.length" class="project-links">
              <template v-for="(link, linkIndex) in project.links" :key="'project-link-' + linkIndex">
                <a
                  v-if="link.href && !link.hidden"
                  class="project-link"
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  :type="link.type || null"
                >
                  {{ link.label }}
                </a>
              </template>
            </div>
          </div>

          <div class="scenario-bottom-controls">
            <button
              class="view-switch-link"
              type="button"
              @click="switchView('overview')"
            >
              Switch to overview
            </button>

            <!-- Collective vote diagram. Uses the same Supabase counts as the voting buttons. -->
            <div
              v-if="!isMobile"
              class="vote-diagram"
              role="img"
              aria-label="Collective Could You Live Here votes by scenario"
            >
            <div class="vote-diagram-title">Vote for your favourite scenario:</div>
            <div
              v-for="row in voteDiagramRows"
              :key="'diagram-' + row.id"
              class="vote-diagram-row"
            >
              <span class="vote-diagram-label">{{ row.label }}</span>
              <div class="vote-diagram-track">
                <div
                  class="vote-diagram-bar"
                  :style="{ width: voteBarWidth(row.votes) }"
                ></div>
              </div>
                <span class="vote-diagram-count">{{ row.votes }}</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Remaining horizontal columns -->
        <div
          v-for="(column, columnIndex) in scenarioColumns"
          :key="'column-' + columnIndex"
          class="scenario-column"
        >
          <article
            v-for="item in column"
            :key="item.index"
            class="scenario-card is-scenario"
          >
            <ScenarioImage
              v-if="item.image"
              :scenario-src="item.image"
              :existing-src="existingImageFor(item)"
              :alt="item.combinedTitle || item.title || ''"
            />

            <div v-else class="scenario-image-placeholder">
              No image
            </div>

            <div class="scenario-heading">
              <span>
                {{ item.index }} {{ item.title }}<template v-if="item.typology"> ({{ item.typology }})</template>
              </span>
            </div>

            <div
              v-if="item.description"
              class="scenario-text"
              v-html="renderMarkdown(item.description)"
            ></div>

            <div class="scenario-values" aria-label="Scenario assessment values">
              <div class="scenario-value-row">
                <span class="scenario-value-label">Cost</span>
                <span class="scenario-value-number">{{ formatCost(item.cost) }}</span>
                <span class="scenario-metric" :aria-label="metricAria('Cost', item.metric?.cost)">
                  <span
                    v-for="dot in 5"
                    :key="'cost-dot-' + item.index + '-' + dot"
                    class="scenario-metric-dot"
                    :class="{ 'is-active': dot <= metricValue(item.metric?.cost) }"
                  ></span>
                </span>
              </div>
              <div class="scenario-value-row">
                <span class="scenario-value-label">Climate</span>
                <span class="scenario-value-number">{{ formatClimate(item.climateImpact) }}</span>
                <span class="scenario-metric" :aria-label="metricAria('Climate', item.metric?.climateImpact)">
                  <span
                    v-for="dot in 5"
                    :key="'climate-dot-' + item.index + '-' + dot"
                    class="scenario-metric-dot"
                    :class="{ 'is-active': dot <= metricValue(item.metric?.climateImpact) }"
                  ></span>
                </span>
              </div>
              <div class="scenario-value-row">
                <span class="scenario-value-label">NPV 30y</span>
                <span class="scenario-value-number">{{ formatNpv(item.npv) }}</span>
                <span class="scenario-metric" :aria-label="metricAria('NPV 30y', item.metric?.npv)">
                  <span
                    v-for="dot in 5"
                    :key="'npv-dot-' + item.index + '-' + dot"
                    class="scenario-metric-dot"
                    :class="{ 'is-active': dot <= metricValue(item.metric?.npv) }"
                  ></span>
                </span>
              </div>
            </div>

            <details
              v-if="item.interventions && item.interventions.length"
              class="scenario-interventions"
            >
              <summary class="scenario-interventions-toggle">
                Intervention Levels (0-3)
              </summary>

              <div class="scenario-interventions-panel">
                <div
                  v-for="intervention in item.interventions"
                  :key="item.index + '-intervention-' + intervention.id"
                  class="scenario-intervention-row"
                >
                  <span class="scenario-intervention-name">
                    {{ intervention.name }}
                  </span>
                  <span class="scenario-intervention-level">
                    {{ intervention.level }}
                  </span>
                </div>
              </div>
            </details>

            <!--
              The browser remembers this visitor's vote locally.
              Supabase stores the collective count.
              Collective counts are refreshed in the background every 10 seconds.
            -->
            <button
              v-if="!item.existing"
              class="live-here-vote"
              type="button"
              :class="{ 'is-voted': isVoted(item.index) }"
              :aria-pressed="isVoted(item.index)"
              :aria-label="isVoted(item.index) ? 'I could live here' : 'Could you live here?'"
              :title="isVoted(item.index) ? 'I could live here' : 'Could you live here?'"
              :disabled="Boolean(votePending[item.index])"
              @click="voteForScenario(item.index)"
            >
              <img
                class="live-here-vote-icon"
                :src="isVoted(item.index) ? voteIconYes : voteIconQuestion"
                alt=""
                draggable="false"
              />
            </button>
          </article>

          <!-- On phones the collective vote diagram sits after the first scenario. -->
          <div
            v-if="isMobile && columnIndex === 0"
            class="vote-diagram mobile-vote-diagram"
            role="img"
            aria-label="Collective Could You Live Here votes by scenario"
          >
            <div class="vote-diagram-title">Vote for your favourite scenario:</div>
            <div
              v-for="row in voteDiagramRows"
              :key="'mobile-diagram-' + row.id"
              class="vote-diagram-row"
            >
              <span class="vote-diagram-label">{{ row.label }}</span>
              <div class="vote-diagram-track">
                <div
                  class="vote-diagram-bar"
                  :style="{ width: voteBarWidth(row.votes) }"
                ></div>
              </div>
              <span class="vote-diagram-count">{{ row.votes }}</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script>
import MarkdownIt from 'markdown-it'
import ScenarioOverview from '../components/ScenarioOverview.vue'
import ScenarioImage from '../components/ScenarioImage.vue'
import { supabase } from '../lib/supabaseClient'
import project from '../project/could-you-live-here-(q).json'

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true
})

// Stable sXXX scenario IDs are now used for local and Supabase voting.
const VOTE_STORAGE_KEY = 'aaa021-live-here-votes-v2'
// One anonymous browser ID is reused across AAA project pages.
// Supabase combines it with project.index, so each browser counts once per project.
const VISITOR_STORAGE_KEY = 'aaa-anonymous-browser-id-v1'
const COUNTS_REFRESH_MS = 10000 // refresh collective counts every 10 seconds

export default {
  name: 'ProjectPage',

  components: {
    ScenarioOverview,
    ScenarioImage
  },

  data() {
    return {
      project,

      // One localStorage object remembers which scenario IDs this browser has voted for.
      // Existing items are never stored here; only stable sXXX scenario IDs are used.
      votedScenarios: {},

      // Collective counts from Supabase, used by the live vote diagram.
      scenarioCounts: {},

      // Prevent rapid double-clicks while one database request is in flight.
      votePending: {},

      // Small polling timer so other visitors' votes appear without reloading the page.
      countsInterval: null,

      // Enter in overview, then automatically cross-fade to scenarios once.
      currentView: 'overview',
      initialViewTimer: null,

      // Used to remove the vote diagram completely in mobile view.
      isMobile: false,

      voteIconQuestion: '/img/AAA021/live-here-(q).png',
      voteIconYes: '/img/AAA021/live-here-yes-(e).png'

      // TWO-ROW OPTION: re-add `useTwoRows: true` here when re-enabled.
    }
  },

  computed: {
    scenarioColumns() {
      const items = Array.isArray(this.project.items)
        ? this.project.items.filter(item => !item.existing && !item.hidden && item.image)
        : []

      // One scenario per horizontal column for now.
      const perColumn = 1

      // TWO-ROW OPTION (temporarily disabled):
      // const perColumn = this.useTwoRows ? 2 : 1
      const columns = []

      for (let i = 0; i < items.length; i += perColumn) {
        columns.push(items.slice(i, i + perColumn))
      }

      return columns
    },

    // Always show every scenario from the JSON, even before it has a database row.
    voteDiagramRows() {
      const items = Array.isArray(this.project.items) ? this.project.items : []

      return items
        .filter(item => !item.existing && !item.hidden && item.index)
        .map(item => ({
          id: item.index,
          label: `${item.index} ${item.title || ''}`.trim(),
          votes: Number(this.scenarioCounts[item.index]) || 0
        }))
    },

    maxScenarioVotes() {
      return this.voteDiagramRows.reduce(
        (max, row) => Math.max(max, row.votes),
        0
      )
    }
  },

  mounted() {
    this.loadLocalVotes()
    this.registerUniqueVisitor()
    this.loadScenarioCounts()
    this.startCountsPolling()
    this.updateViewportMode()
    window.addEventListener('resize', this.updateViewportMode)

    // Show the overview for three seconds on initial entry, then fade to scenarios.
    this.initialViewTimer = window.setTimeout(() => {
      this.currentView = 'scenarios'
      this.initialViewTimer = null
    }, 3000)

    // Refresh immediately when the visitor returns to this tab/window.
    window.addEventListener('focus', this.loadScenarioCounts)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)

    // TWO-ROW AUTO-FIT (temporarily disabled).
    // When re-enabled, add the resize listener and checkRows() call back here.
  },

  beforeUnmount() {
    if (this.countsInterval) {
      window.clearInterval(this.countsInterval)
    }

    if (this.initialViewTimer) {
      window.clearTimeout(this.initialViewTimer)
    }

    window.removeEventListener('focus', this.loadScenarioCounts)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    window.removeEventListener('resize', this.updateViewportMode)
  },

  methods: {
    updateViewportMode() {
      this.isMobile = window.matchMedia('(max-width: 768px)').matches
    },

    switchView(view) {
      // Manual switching cancels the one-time automatic intro change.
      if (this.initialViewTimer) {
        window.clearTimeout(this.initialViewTimer)
        this.initialViewTimer = null
      }

      this.currentView = view
    },

    existingImageFor(item) {
      if (!item || !item.basedOn) return null

      const existing = (this.project.items || []).find(
        candidate => candidate.existing && candidate.index === item.basedOn
      )

      return existing?.image || null
    },

    renderMarkdown(text) {
      return md.render(text || '')
    },

    formatCost(value) {
      if (value === null || value === undefined || Number.isNaN(Number(value))) return '—'
      return `${Math.round(Number(value)).toLocaleString('sv-SE')} SEK/sqm`
    },

    formatClimate(value) {
      if (value === null || value === undefined || Number.isNaN(Number(value))) return '—'
      return `${Math.round(Number(value)).toLocaleString('sv-SE')} kg co2e/sqm`
    },

    formatNpv(value) {
      if (value === null || value === undefined || Number.isNaN(Number(value))) return '—'
      return `${Math.round(Number(value) / 1000000).toLocaleString('sv-SE')} MSEK`
    },

    metricValue(value) {
      const number = Number(value)
      if (!Number.isFinite(number)) return 0
      return Math.max(0, Math.min(5, Math.round(number)))
    },

    metricAria(label, value) {
      const metric = this.metricValue(value)
      return metric ? `${label} metric: ${metric} of 5` : `${label} metric: not available`
    },

    voteBarWidth(votes) {
      const max = this.maxScenarioVotes
      if (!max) return '0%'

      return `${(Math.max(0, Number(votes) || 0) / max) * 100}%`
    },

    getAnonymousBrowserId() {
      try {
        let visitorId = localStorage.getItem(VISITOR_STORAGE_KEY)

        if (!visitorId) {
          if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            visitorId = window.crypto.randomUUID()
          } else {
            // Fallback UUID for older browsers. It is random, not a fingerprint.
            visitorId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
              const random = Math.floor(Math.random() * 16)
              const value = character === 'x' ? random : (random & 0x3) | 0x8
              return value.toString(16)
            })
          }

          localStorage.setItem(VISITOR_STORAGE_KEY, visitorId)
        }

        return visitorId
      } catch (error) {
        // If persistent browser storage is unavailable, do not register a visitor.
        // This avoids turning every reload into a false "unique" visitor.
        return null
      }
    },

    async registerUniqueVisitor() {
      if (!supabase || !this.project?.index) return

      const visitorId = this.getAnonymousBrowserId()
      if (!visitorId) return

      const { error } = await supabase.rpc('register_project_visitor', {
        p_project_id: this.project.index,
        p_visitor_id: visitorId
      })

      if (error) {
        console.warn('Could not register unique project visitor:', error.message)
      }
    },

    loadLocalVotes() {
      try {
        const stored = localStorage.getItem(VOTE_STORAGE_KEY)
        this.votedScenarios = stored ? JSON.parse(stored) : {}
      } catch (error) {
        this.votedScenarios = {}
      }
    },

    isVoted(scenarioId) {
      return Boolean(this.votedScenarios[scenarioId])
    },

    saveLocalVotes() {
      try {
        localStorage.setItem(
          VOTE_STORAGE_KEY,
          JSON.stringify(this.votedScenarios)
        )
      } catch (error) {
        // The interface still works if localStorage is unavailable.
      }
    },

    startCountsPolling() {
      if (this.countsInterval) return

      this.countsInterval = window.setInterval(() => {
        // Do not keep requesting data while the tab is hidden.
        if (document.visibilityState === 'visible') {
          this.loadScenarioCounts()
        }
      }, COUNTS_REFRESH_MS)
    },

    handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        this.loadScenarioCounts()
      }
    },

    async loadScenarioCounts() {
      // If Supabase has not been configured yet, keep the page working locally.
      if (!supabase) return

      const { data, error } = await supabase.rpc('get_scenario_counts')

      if (error) {
        console.warn('Could not load scenario counts:', error.message)
        return
      }

      const counts = {}
      ;(data || []).forEach(row => {
        counts[row.scenario_id] = row.votes
      })
      this.scenarioCounts = counts
    },

    async voteForScenario(scenarioId) {
      const scenario = (this.project.items || []).find(item => item.index === scenarioId)
      if (!scenario || scenario.existing || scenario.hidden || this.votePending[scenarioId]) return

      const wasVoted = this.isVoted(scenarioId)
      const delta = wasVoted ? -1 : 1

      // Update the interface immediately.
      if (wasVoted) {
        delete this.votedScenarios[scenarioId]
      } else {
        this.votedScenarios[scenarioId] = true
      }
      this.saveLocalVotes()

      // No Supabase configuration yet: keep frontend-only behaviour.
      if (!supabase) return

      this.votePending[scenarioId] = true

      const { data, error } = await supabase.rpc('change_scenario_vote', {
        p_scenario_id: scenarioId,
        p_delta: delta
      })

      delete this.votePending[scenarioId]

      if (error) {
        console.warn('Could not save vote:', error.message)

        // Roll the visual/local vote back if the database update failed.
        if (wasVoted) {
          this.votedScenarios[scenarioId] = true
        } else {
          delete this.votedScenarios[scenarioId]
        }
        this.saveLocalVotes()
        return
      }

      // change_scenario_vote returns the new collective count.
      this.scenarioCounts[scenarioId] = Number(data) || 0
    },

    /*
    TWO-ROW AUTO-FIT (temporarily disabled)

    checkRows() {
      ...measure two scenario cards and switch between 1 / 2 rows...
    },
    */

    handleWheel(event) {
      if (window.innerWidth <= 768) return

      const scroll = this.$refs.scroll
      if (!scroll) return

      // Native horizontal trackpad movement still works.
      // A normal mouse wheel is translated to horizontal movement.
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        scroll.scrollLeft += event.deltaY
        event.preventDefault()
      }
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'Consola';
  src: url('../assets/fonts/consola.ttf') format('truetype');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

.project-page {
  --column-gap: 7rem;
  --row-gap: 2rem;
  --controls-bottom: 22px; /* shared bottom position for both diagrams */

  /*
    Same two-column logic as the existing 1280px desktop layout:
    48px + column + 7rem + column + 48px.
    The project itself is not capped at 1280px and can continue horizontally.
  */
  --column-width: calc((1280px - 96px - var(--column-gap)) / 2);

  box-sizing: border-box;
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  overflow: hidden;

  opacity: 0;
  animation: projectFadeIn 0.8s ease forwards;
}

@keyframes projectFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.project-view {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 1.6s ease; /* VIEW FADE SPEED: increase for slower fade */
}

.project-view.is-active {
  opacity: 1;
  pointer-events: auto;
}

.overview-view {
  /* Floating images + overview vote diagram sit above the project content
     during the cross-fade. The project header remains above them at z-index 100. */
  z-index: 50;
  cursor: pointer;

  /* Keep the same bottom scrollbar space as the scenario view, even when
     there is nothing to scroll. This prevents a visual jump between views. */
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.overview-view::-webkit-scrollbar {
  height: 6px;
}

.overview-visual {
  z-index: 30;
  pointer-events: none;
}

.scenario-view {
  z-index: 2;
}

.overview-controls {
  position: absolute;
  left: 48px;
  bottom: var(--controls-bottom);
  z-index: 20;
  width: var(--column-width);
}

.scenario-bottom-controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: var(--controls-bottom);
}

.view-switch-link {
  display: inline-block;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.project-scroll {
  position: absolute;
  top: 32px;
  right: 0;
  bottom: 0; /* SCROLLBAR POSITION: 0 = scroll area reaches viewport bottom */
  left: 0;

  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

/* Chrome / Edge / Safari: change 6px if you want a thicker or thinner bar.
   A thinner native scrollbar also makes the thumb sit visually closer to the edge. */
.project-scroll::-webkit-scrollbar {
  height: 6px; /* SCROLLBAR THICKNESS */
}

.project-track {
  display: flex;
  align-items: stretch;
  gap: var(--column-gap);
  width: max-content;
  min-width: 100%;
  height: 100%;
  box-sizing: border-box;

  /* END PADDINGS ONLY: these travel with the horizontal content.
     They no longer form a fixed 48px clipping frame around the viewport. */
  padding-left: 48px;
  padding-right: 48px;
}

.project-intro-column,
.scenario-column {
  flex: 0 0 var(--column-width);
  width: var(--column-width);
  min-width: 0;
}

.project-intro-column {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/*
  This is intentionally fixed rather than sticky inside the horizontal track.
  It stays in the same viewport position while all project columns move below it.
*/
.project-local-header {
  position: fixed;
  top: 32px;
  left: 48px;
  z-index: 100;

  /* font-weight: 700; */
  background: transparent;

  display: grid;
  grid-template-columns: max-content minmax(0, 1fr) max-content;
  align-items: baseline;
  column-gap: 12px;

  box-sizing: border-box;
  width: var(--column-width);
  
}

.project-local-header a,
.project-link {
  color: inherit;
  text-decoration: underline;
  font-style: normal;
}

/* Header is fixed, so this creates one normal text-space below it. */
.project-intro {
  padding-top: 2em;
}

.project-intro :deep(p),
.scenario-text :deep(p) {
  margin-top: 0;
  margin-bottom: 0;
}

.project-details {
  display: grid;
  row-gap: 0;
  margin-top: 1.5em;
}

.project-detail-row {
  display: grid;
  grid-template-columns: 8.6rem minmax(0, 1fr);
  column-gap: 0.75rem;
  align-items: baseline;
}

.project-detail-label,
.project-detail-value {
  min-width: 0;
}

.project-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 1em;
}

.project-link {
  display: inline-block;
}

/* Live collective vote diagram.
   The longest bar is always the scenario with the most votes. */
.vote-diagram {
  width: 100%;
  margin-top: 0.8rem;
  padding-bottom: 0;
  user-select: none;
}

.vote-diagram-title {
  margin-bottom: 0.8rem;
  font-family: Helvetica, Arial, sans-serif;
  font-size: inherit;
  font-weight: 400;
  text-decoration: none;
}

/* Scenario rows use the same Consola size as the intervention data.
   The title above intentionally stays normal-size Helvetica. */
.vote-diagram-row {
  font-family: 'Consola', Helvetica, Arial, sans-serif;
  font-size: 0.85em;
  line-height: 1.2;
}

.vote-diagram-row {
  display: grid;
  grid-template-columns: 16rem minmax(0, 1fr) 2.5em;
  align-items: center;
  column-gap: 0.65rem;
  margin-top: 0.08rem;
}

.vote-diagram-label,
.vote-diagram-count {
  white-space: nowrap;
}

.vote-diagram-count {
  text-align: right;
}

.vote-diagram-track {
  height: 0.8em;
  background: transparent;
}

.vote-diagram-bar {
  height: 100%;
  background: currentColor;
  transition: width 0.25s ease;
}

.scenario-column {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  row-gap: var(--row-gap);
}

.scenario-card {
  width: 100%;
  min-width: 0;
}

.scenario-heading {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.scenario-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 4 / 3;
  border: 1px solid currentColor;
  opacity: 0.35;
}

.scenario-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  user-select: none;
  cursor: default;
}

.scenario-text {
  margin-top: 0.5rem;
  line-height: inherit;
  text-align: left;
}

.scenario-values {
  margin-top: 0.5rem;
}

.scenario-value-row {
  display: grid;
  grid-template-columns: 5.2rem minmax(0, 1fr) max-content;
  align-items: center;
  column-gap: 0.75rem;
}

.scenario-value-number {
  text-align: left;
  white-space: nowrap;
}

.scenario-metric {
  display: inline-flex;
  align-items: center;
  gap: 0.24em;
  justify-self: end;
  white-space: nowrap;
}

.scenario-metric-dot {
  display: inline-block;
  width: 0.56em;
  height: 0.56em;
  box-sizing: border-box;
  border: 1px solid currentColor;
  border-radius: 50%;
}

.scenario-metric-dot.is-active {
  background: currentColor;
}

.scenario-interventions {
  margin-top: 0.55rem;
  line-height: inherit;
}

.scenario-interventions-toggle {
  display: inline-block;
  cursor: pointer;
  text-decoration: underline;
  list-style: none;
  user-select: none;
  font-family: Helvetica, Arial, sans-serif;
  font-size: inherit;
}

.scenario-interventions-toggle::-webkit-details-marker {
  display: none;
}

.scenario-interventions-panel {
  margin-top: 0.45rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 1.25rem;
  row-gap: 0.08rem;
  font-family: 'Consola', Helvetica, Arial, sans-serif;
  font-size: 0.85em;
  line-height: 1.2;
}

.scenario-intervention-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1.5em;
  column-gap: 0.45rem;
  align-items: baseline;
  min-width: 0;
}

.scenario-intervention-name {
  min-width: 0;
  overflow-wrap: anywhere;
}

.scenario-intervention-level {
  text-align: right;
  white-space: nowrap;
}

/* Single "Could you live here?" vote.
   Change 38px here if you want the symbol larger/smaller. */
.live-here-vote {
  display: block;
  width: 38px; /* VOTE ICON SIZE */
  height: 38px;
  margin-top: 0.65rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  user-select: none;
}

.live-here-vote-icon {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

.live-here-vote:hover {
  opacity: 0.65;
}

.live-here-vote.is-voted:hover {
  opacity: 1;
}

.live-here-vote:disabled {
  cursor: wait;
}

.live-here-vote:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 3px;
}

/* Phone: one continuous vertical sequence:
   intro column, then all items from column 1, column 2, column 3, etc. */
@media (max-width: 768px) {
  .project-page {
    --column-width: calc(100vw - 24px);
    --column-gap: 0;
    --row-gap: 3rem;

    height: 100dvh;
    padding: 0;
    overflow: hidden;
  }

  .project-local-header {
    top: 12px;
    left: 12px;
    width: calc(100vw - 24px);
  }

  /* Project links stay underlined but never become bold on phones. */
  .project-local-header a,
  .project-link,
  .view-switch-link,
  .scenario-interventions-toggle {
    font-weight: 400 !important;
    text-decoration: underline;
  }

  .overview-controls {
    left: 12px;
    bottom: 12px;
    width: calc(100vw - 24px);
  }

  /* Mobile fallback: Vue removes these with v-if; this also guarantees no diagram flashes. */
  .overview-controls .vote-diagram,
  .scenario-bottom-controls .vote-diagram {
    display: none !important;
  }

  .scenario-bottom-controls {
    position: static;
    margin-top: 4rem;
    padding-bottom: 0;
  }

  .project-scroll {
    top: 12px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .project-track {
    display: block;
    width: 100%;
    min-width: 0;
    height: auto;
    padding-left: 12px;
    padding-right: 12px;
  }

  .project-intro-column,
  .scenario-column {
    width: 100%;
    height: auto;
  }

  .project-intro-column {
    display: block;
  }

  .project-intro {
    padding-top: 2em;
  }

  .vote-diagram {
    width: 100%;
    margin-top: 0.8rem;
    padding-bottom: 0;
  }

  .scenario-column {
    display: flex;
    margin-top: 4rem;
  }

  .mobile-vote-diagram {
    margin-top: 3rem;
    margin-bottom: 0;
  }

  .mobile-vote-diagram .vote-diagram-row {
    grid-template-columns: 11rem minmax(0, 1fr) 2em;
    column-gap: 0.45rem;
  }

  .mobile-vote-diagram .vote-diagram-label {
    white-space: normal;
  }
}
</style>
