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
      returnTimer: null
    }
  },

  beforeUnmount() {
    if (this.returnTimer) window.clearTimeout(this.returnTimer)
  },

  methods: {
    showExisting() {
      if (!this.existingSrc) return

      if (this.returnTimer) window.clearTimeout(this.returnTimer)
      this.showingExisting = true

      // Existing condition stays visible for three seconds, then cross-fades back.
      this.returnTimer = window.setTimeout(() => {
        this.showingExisting = false
        this.returnTimer = null
      }, 3000)
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
