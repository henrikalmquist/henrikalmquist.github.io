<template>
  <div
    class="scenario-image-reveal"
    :class="{ 'can-reveal': Boolean(existingSrc) }"
    :role="existingSrc ? 'button' : null"
    :tabindex="existingSrc ? 0 : null"
    :aria-label="existingSrc ? 'Show existing image temporarily' : null"
    @click="showExisting"
    @keydown.enter.prevent="showExisting"
    @keydown.space.prevent="showExisting"
  >
    <img
      class="scenario-image scenario-image-base"
      :src="scenarioSrc"
      :alt="alt"
      draggable="false"
    />

    <!-- Kept mounted so the source image is already loaded before the click. -->
    <img
      v-if="existingSrc"
      class="scenario-image scenario-image-existing"
      :class="{ 'is-visible': showingExisting }"
      :src="existingSrc"
      alt="Existing condition"
      draggable="false"
    />
  </div>
</template>

<script>
const EXISTING_HOLD_MS = 3000
const AUTO_REVEAL_MIN_MS = 24000
const AUTO_REVEAL_MAX_MS = 36000

export default {
  name: 'ScenarioImage',

  props: {
    scenarioSrc: {
      type: String,
      required: true
    },
    existingSrc: {
      type: String,
      default: null
    },
    alt: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      showingExisting: false,
      returnTimer: null,
      autoRevealTimer: null
    }
  },

  mounted() {
    this.scheduleAutoReveal()
  },

  beforeUnmount() {
    this.clearTimers()
  },

  methods: {
    clearTimers() {
      if (this.returnTimer) window.clearTimeout(this.returnTimer)
      if (this.autoRevealTimer) window.clearTimeout(this.autoRevealTimer)
      this.returnTimer = null
      this.autoRevealTimer = null
    },

    scheduleAutoReveal() {
      if (!this.existingSrc) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      if (this.autoRevealTimer) window.clearTimeout(this.autoRevealTimer)

      // Independent 24–36 s rhythms + 3 s existing hold = roughly 90/10 scenario/existing.
      const delay = AUTO_REVEAL_MIN_MS +
        Math.random() * (AUTO_REVEAL_MAX_MS - AUTO_REVEAL_MIN_MS)

      this.autoRevealTimer = window.setTimeout(() => {
        this.autoRevealTimer = null
        this.showExisting()
      }, delay)
    },

    showExisting() {
      if (!this.existingSrc) return

      if (this.returnTimer) window.clearTimeout(this.returnTimer)
      if (this.autoRevealTimer) window.clearTimeout(this.autoRevealTimer)
      this.returnTimer = null
      this.autoRevealTimer = null

      this.showingExisting = true

      // Same three-second reveal whether triggered by click or automatically.
      this.returnTimer = window.setTimeout(() => {
        this.showingExisting = false
        this.returnTimer = null
        this.scheduleAutoReveal()
      }, EXISTING_HOLD_MS)
    }
  }
}
</script>

<style scoped>
.scenario-image-reveal {
  /* EXISTING-IMAGE FADE SPEED: increase 1.6s for a slower crossfade. */
  --scenario-image-fade: 1.6s;

  position: relative;
  width: 100%;
}

.scenario-image-reveal.can-reveal {
  cursor: pointer;
}

.scenario-image-reveal:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 3px;
}

.scenario-image {
  display: block;
  width: 100%;
  user-select: none;
}

.scenario-image-base {
  height: auto;
  object-fit: contain;
}

.scenario-image-existing {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--scenario-image-fade) ease;
}

.scenario-image-existing.is-visible {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .scenario-image-existing {
    transition-duration: 0.01ms;
  }
}
</style>
