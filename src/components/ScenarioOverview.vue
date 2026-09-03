<template>
  <div class="scenario-overview" aria-label="Scenario overview">
    <div
      v-for="(item, index) in overviewItems"
      :key="item.index"
      class="overview-item-anchor"
      :style="item.anchorStyle"
    >
      <div class="overview-item-travel" :style="item.motionStyle">
        <div class="overview-item-orbit" :style="item.orbitStyle">
          <img
            class="overview-image"
            :src="item.image"
            :alt="item.alt || ''"
            :style="item.imageStyle"
            draggable="false"
          />
          <div class="overview-label">{{ scenarioLabel(item) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const MIN_TRAVEL_SECONDS = 12
const MAX_TRAVEL_SECONDS = 18

// Image size automatically adapts to how many overview items exist.
// 7 items = current/reference size.
// More items = smaller images, fewer items = slightly larger images.
const REFERENCE_ITEM_COUNT = 7
const MIN_DENSITY_SCALE = 0.55
const MAX_DENSITY_SCALE = 1.20

const MAX_TRAVEL_RADIUS_VW = 4.2
const MIN_TRAVEL_RADIUS_VW = 1.0

const POSITION_PRESETS = [
  [18, 19], [57, 10], [85, 15], [47, 36], [66, 49],
  [31, 61], [77, 79], [12, 45], [88, 43], [52, 72],
  [20, 82], [75, 29], [37, 13], [59, 61], [92, 72],
  [9, 72], [68, 16], [34, 42], [83, 59], [48, 86]
]

export default {
  name: 'ScenarioOverview',

  props: {
    items: {
      type: Array,
      default: () => []
    },
    counts: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    maxVotes() {
      return this.items.reduce((max, item) => {
        if (item.existing || item.hidden || !item.index) return max
        return Math.max(max, Number(this.counts[item.index]) || 0)
      }, 0)
    },

    overviewItems() {
      // Existing source images stay in JSON for later scenario-level reveal,
      // but are not shown in the floating overview.
      const visibleItems = this.items.filter(item => !item.existing && !item.hidden && item.image)

      const prepared = visibleItems.map((item, positionIndex) => {
        const isVotable = !item.existing && Boolean(item.index)
        const votes = isVotable ? (Number(this.counts[item.index]) || 0) : 0
        const ratio = isVotable && this.maxVotes > 0
          ? Math.sqrt(votes / this.maxVotes)
          : 0

        const itemCount = Math.max(1, visibleItems.length)

        // Area grows with the square of width, so sqrt() gives a natural
        // density adjustment: doubling the number of images does not halve
        // their width, it reduces it by about 29%.
        const densityScale = Math.max(
          MIN_DENSITY_SCALE,
          Math.min(
            MAX_DENSITY_SCALE,
            Math.sqrt(REFERENCE_ITEM_COUNT / itemCount)
          )
        )

        // Vote scaling remains relative inside the density-adjusted size.
        // Existing/non-votable items stay at the base size because ratio = 0.
        const desktopWidth = (7.5 + (8.5 * ratio)) * densityScale

        // Mobile starts from a slightly more compact base, but uses the same
        // item-count logic so 5, 10, 15, 20 items all adapt automatically.
        const mobileWidth = (15 + (10 * ratio)) * densityScale
        const [x, y] = this.positionFor(positionIndex)

        return {
          ...item,
          positionIndex,
          x,
          y,
          desktopWidth,
          mobileWidth
        }
      })

      return prepared.map((item, positionIndex) => {
        const seed = this.hashString(
          item.digiIndex || item.index || String(positionIndex)
        )
        const safeRadius = this.safeTravelRadius(item, prepared)

        const p1 = this.motionPoint(seed + 11, safeRadius, 0.75)
        const p2 = this.motionPoint(seed + 29, safeRadius, 1.00)
        const p3 = this.motionPoint(seed + 47, safeRadius, 0.82)
        const p4 = this.motionPoint(seed + 71, safeRadius, 0.62)

        const travelDuration =
          MIN_TRAVEL_SECONDS +
          (seed % (MAX_TRAVEL_SECONDS - MIN_TRAVEL_SECONDS + 1))

        const orbitRadius = 5 + (seed % 9)
        const orbitDuration = 7 + (seed % 6)

        return {
          ...item,
          anchorStyle: {
            left: `${item.x}%`,
            top: `${item.y}%`
          },
          imageStyle: {
            '--overview-width': `${item.desktopWidth}vw`,
            '--overview-width-mobile': `${item.mobileWidth}vw`
          },
          motionStyle: {
            '--travel-x1': `${p1.x}vw`,
            '--travel-y1': `${p1.y}vw`,
            '--travel-x2': `${p2.x}vw`,
            '--travel-y2': `${p2.y}vw`,
            '--travel-x3': `${p3.x}vw`,
            '--travel-y3': `${p3.y}vw`,
            '--travel-x4': `${p4.x}vw`,
            '--travel-y4': `${p4.y}vw`,
            '--travel-duration': `${travelDuration}s`,
            '--travel-delay': `${-(seed % travelDuration)}s`
          },
          orbitStyle: {
            '--orbit-radius': `${orbitRadius}px`,
            '--orbit-radius-neg': `${-orbitRadius}px`,
            '--orbit-duration': `${orbitDuration}s`,
            '--orbit-delay': `${-(seed % orbitDuration)}s`
          }
        }
      })
    }
  },

  methods: {
    safeTravelRadius(item, allItems) {
      let nearestClearance = Infinity

      allItems.forEach(other => {
        if (other.index === item.index) return

        const dx = other.x - item.x
        const dy = other.y - item.y
        const centerDistance = Math.sqrt((dx * dx) + (dy * dy))

        const combinedRadius =
          (item.desktopWidth * 0.52) +
          (other.desktopWidth * 0.52) +
          2.5

        nearestClearance = Math.min(
          nearestClearance,
          centerDistance - combinedRadius
        )
      })

      if (!Number.isFinite(nearestClearance)) {
        return MAX_TRAVEL_RADIUS_VW
      }

      return Math.max(
        MIN_TRAVEL_RADIUS_VW,
        Math.min(MAX_TRAVEL_RADIUS_VW, nearestClearance * 0.38)
      )
    },

    motionPoint(seed, radius, radiusFactor) {
      const angle = ((seed % 360) * Math.PI) / 180
      const r = radius * radiusFactor

      return {
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r
      }
    },

    positionFor(index) {
      if (index < POSITION_PRESETS.length) {
        return POSITION_PRESETS[index]
      }

      const seed = this.hashString(String(index))

      return [
        8 + (seed % 84),
        10 + ((Math.floor(seed / 97)) % 76)
      ]
    },

    hashString(value) {
      let hash = 2166136261

      for (let i = 0; i < value.length; i += 1) {
        hash ^= value.charCodeAt(i)
        hash = Math.imul(hash, 16777619)
      }

      return Math.abs(hash)
    },

    scenarioLabel(item) {
      if (item.digiIndex) return item.digiIndex
      if (item.combinedTitle) return item.combinedTitle
      return item.index || ''
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

.scenario-overview {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: transparent;
}

.overview-item-anchor {
  position: absolute;
  transform: translate(-50%, -50%);
}

.overview-item-travel {
  animation:
    localTravel var(--travel-duration, 15s)
    ease-in-out var(--travel-delay, 0s)
    infinite;
  will-change: transform;
}

.overview-item-orbit {
  animation:
    smallOrbit var(--orbit-duration, 9s)
    linear var(--orbit-delay, 0s)
    infinite;
  will-change: transform;
}

.overview-image {
  display: block;
  width: clamp(64px, var(--overview-width), 300px);
  height: auto;
  object-fit: contain;
  user-select: none;
  transition: width 0.8s ease;
}

.overview-label {
  margin-top: 0.25rem;
  white-space: nowrap;
  font-family: 'Consola', Helvetica, Arial, sans-serif;
  font-size: 0.85em; /* matched to intervention + vote diagram scenario text */
  line-height: inherit;
}

@keyframes localTravel {
  0% {
    transform: translate3d(var(--travel-x1), var(--travel-y1), 0);
  }

  24% {
    transform: translate3d(var(--travel-x2), var(--travel-y2), 0);
  }

  51% {
    transform: translate3d(var(--travel-x3), var(--travel-y3), 0);
  }

  77% {
    transform: translate3d(var(--travel-x4), var(--travel-y4), 0);
  }

  100% {
    transform: translate3d(var(--travel-x1), var(--travel-y1), 0);
  }
}

@keyframes smallOrbit {
  0% {
    transform: translate3d(0, var(--orbit-radius-neg), 0);
  }

  25% {
    transform: translate3d(var(--orbit-radius), 0, 0);
  }

  50% {
    transform: translate3d(0, var(--orbit-radius), 0);
  }

  75% {
    transform: translate3d(var(--orbit-radius-neg), 0, 0);
  }

  100% {
    transform: translate3d(0, var(--orbit-radius-neg), 0);
  }
}

@media (max-width: 768px) {
  .scenario-overview {
    inset: 0;
  }

  .overview-image {
    width: clamp(48px, var(--overview-width-mobile), 170px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .overview-item-travel,
  .overview-item-orbit {
    animation: none;
  }

  .overview-image {
    transition: none;
  }
}
</style>
