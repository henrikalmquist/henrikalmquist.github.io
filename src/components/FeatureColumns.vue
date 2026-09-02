<template>
  <!-- Single column on small screens -->
  <div v-if="isSmallScreenComputed" class="h-full">
    <div :style="firstComlumeStyleComputed">
      <images-container
        v-for="(feature, i) in singelFeatureColumnComputed"
        :key="featureKey(feature, i)"
        :header="feature.header || ''"
        :header-index="feature.index || ''"
:header-title="feature.title || ''"
:header-link="feature.link || ''"
        :images="feature.images || []"
        :description="feature.text || ''"
        :meta="feature.meta || []"
        :type="feature.type"
        :rem-unit="safeRemUnit"
        :use-markdown="useMarkdown"
        :center-content="centerImages"
        :isSmallScreen="isSmallScreenComputed"
        :showonload="feature.showonload ?? 0"
        @descriptionClicked="featureClicked"
      />
    </div>
  </div>

  <!-- Two columns on larger screens -->
  <div v-else class="h-full grid grid-cols-2" :style="gapComputed">
    <div :style="firstComlumeStyleComputed">
      <images-container
        v-for="(feature, i) in featureColumnsComputed[0]"
        :key="featureKey(feature, i)"
        :header="feature.header || ''"
        :header-index="feature.index || ''"
:header-title="feature.title || ''"
:header-link="feature.link || ''"
        :images="feature.images || []"
        :description="feature.text || ''"
        :meta="feature.meta || []"
        :type="feature.type"
        :rem-unit="safeRemUnit"
        :use-markdown="useMarkdown"
        :center-content="centerImages"
        :isSmallScreen="isSmallScreenComputed"
        :showonload="feature.showonload ?? 0"
        @descriptionClicked="featureClicked"
      />
    </div>
    <div>
      <images-container
        v-for="(feature, i) in featureColumnsComputed[1]"
        :key="featureKey(feature, i)"
        :header="feature.header || ''"
        :header-index="feature.index || ''"
:header-title="feature.title || ''"
:header-link="feature.link || ''"
        :images="feature.images || []"
        :description="feature.text || ''"
        :meta="feature.meta || []"
        :type="feature.type"
        :rem-unit="safeRemUnit"
        :use-markdown="useMarkdown"
        :center-content="centerImages"
        :isSmallScreen="isSmallScreenComputed"
        :showonload="feature.showonload ?? 0"
        @descriptionClicked="featureClicked"
      />
    </div>
  </div>
</template>

<script>
import ImagesContainer from './ImagesContainer.vue';
import { useMatchMedia } from '../utilities/useMatchMedia';

const ColumnCount = 2;

function reOrderFeatures(features) {
  const list = Array.isArray(features) ? features : [];
  const withPrio = list.filter(f => f && f.prio != null);
  //const withoutPrio = list.filter(f => f && f.prio == null);

  const groups = {};
  for (const item of withPrio) {
    const k = String(item.prio);
    (groups[k] ||= []).push(item);
  }

  const result = [];
  Object.keys(groups).sort().forEach(k => {
    const g = groups[k].slice().sort(() => Math.random() - 0.5);
    result.push(...g);
  });
  //result.push(...withoutPrio);
  return result;
}

export default {
  name: "FeatureColumns",
  components: { ImagesContainer },
  props: {
    features: { type: Array, default: () => [] },
    introText: { type: String, default: '' },
    remUnit: { type: Number, default: 7 },
    useMarkdown: { type: Boolean, default: true },
    centerImages: { type: Boolean, default: true },
  },
  data() {
    return {
      featureColumns: [[], []],
      singelFeatureColumn: [],
    };
  },
  mounted() { this.reShuffleFeatures(); },
  watch: {
    features: { handler() { this.reShuffleFeatures(); }, deep: true },
    introText() { this.reShuffleFeatures(); },
  },
  computed: {
    featureColumnsComputed() { return this.featureColumns; },
    singelFeatureColumnComputed() { return this.singelFeatureColumn; },
    safeRemUnit() { return Number(this.remUnit) || 7; },
    gapComputed() { return `gap: ${this.safeRemUnit}rem;`; },
    firstComlumeStyleComputed() { 
      //return "";
      return this.useMarkdown ? `margin-top: -1.2rem;` : ""; 
      },
    isSmallScreenComputed() {
      try { return useMatchMedia("(max-width: 768px)").value; }
      catch { return false; }
    },
  },
  methods: {
    featureKey(feature, i) {
      return (feature && (feature.header || (feature.images && feature.images[0]))) || `f-${i}`;
    },
    
reShuffleFeatures() {
  const reordered = reOrderFeatures(this.features);
  const cols = [[], []];

  // Build a “virtual feature” for the intro text
  const intro = (this.introText && this.introText.trim())
    ? [{ text: this.introText, images: [], type: "intro", showonload: 1 }]
    : [];

  // Single-column layout (mobile)
  this.singelFeatureColumn = [...intro, ...reordered];

  // Two-column layout (desktop)
  let idx = 0;
  for (const f of reordered) {
    cols[idx % ColumnCount].push(f);
    idx++;
  }

  // Put intro at the top of the left column if it exists
  if (intro.length) cols[0].unshift(intro[0]);

  this.featureColumns = cols;
},

    featureClicked(feature) {
      this.$emit('featureClicked', feature);
    }
  }
};
</script>
