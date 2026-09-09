<template>
  <section class="project-page">
    <div class="project-local-header">
      <span>{{ project.index }}</span>
      <span>{{ project.title }}</span>
      <router-link :to="project.back.to">
        {{ project.back.label }}
      </router-link>
    </div>

    <div
      ref="scroll"
      class="project-scroll"
      @wheel="handleWheel"
    >
      <div class="project-track">
        <aside class="project-intro-column">
          <div class="project-intro">
            <p>{{ project.intro }}</p>

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

            <p v-if="project.note" class="project-note">
              {{ project.note }}
            </p>
          </div>
        </aside>

        <div
          v-for="item in project.items || []"
          :key="item.id || item.image"
          class="project-image-column"
        >
          <img
            v-if="item.image"
            class="project-image"
            :src="item.image"
            :alt="item.alt || ''"
            draggable="false"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import project from '../project/common-values-nyhamnen.json'

export default {
  name: 'ProjectPage02',

  data() {
    return {
      project
    }
  },

  methods: {
    handleWheel(event) {
      if (window.innerWidth <= 768) return

      const scroll = this.$refs.scroll
      if (!scroll) return

      // Keep native horizontal trackpad scrolling.
      // Translate a normal vertical mouse wheel into horizontal movement.
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        scroll.scrollLeft += event.deltaY
        event.preventDefault()
      }
    }
  }
}
</script>

<style scoped>
.project-page {
  --column-gap: 7rem;
  --space-large: 1.3rem;

  /* Same desktop column width as the Could You Live Here project page. */
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

.project-local-header {
  position: fixed;
  top: 32px;
  left: 48px;
  z-index: 100;

  display: grid;
  grid-template-columns: max-content minmax(0, 1fr) max-content;
  align-items: baseline;
  column-gap: 12px;

  box-sizing: border-box;
  width: var(--column-width);
  background: transparent;
}

.project-local-header a {
  color: inherit;
  text-decoration: underline;
  font-style: normal;
}

.project-scroll {
  position: absolute;
  top: 32px;
  right: 0;
  bottom: 0;
  left: 0;

  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.project-scroll::-webkit-scrollbar {
  height: 6px;
}

.project-track {
  display: flex;
  align-items: flex-start;
  gap: var(--column-gap);

  width: max-content;
  min-width: 100%;
  min-height: 100%;

  box-sizing: border-box;
  padding-left: 48px;
  padding-right: 48px;
}

.project-intro-column,
.project-image-column {
  flex: 0 0 var(--column-width);
  width: var(--column-width);
  min-width: 0;
}

.project-intro-column {
  position: relative;
}

.project-intro {
  padding-top: calc(1em + var(--space-large));
}

.project-intro p {
  margin: 0;
}

.project-details {
  display: grid;
  margin-top: var(--space-large);
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

.project-note {
  margin-top: var(--space-large) !important;
}

.project-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  user-select: none;
  cursor: default;
}

@media (max-width: 768px) {
  .project-page {
    --column-width: calc(100vw - 24px);
    --column-gap: 0;
    --space-large: 1.1rem;

    height: 100dvh;
    overflow: hidden;
  }

  .project-local-header {
    top: 12px;
    left: 12px;
    width: calc(100vw - 24px);
  }

  .project-local-header a {
    font-weight: 400 !important;
    text-decoration: underline;
  }

  .project-scroll {
    top: 12px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .project-track {
    display: block;
    width: 100%;
    min-width: 0;
    min-height: 0;
    padding-left: 12px;
    padding-right: 12px;
  }

  .project-intro-column,
  .project-image-column {
    width: 100%;
  }

  .project-intro {
    padding-top: calc(1em + var(--space-large));
  }

  .project-image-column {
    margin-top: 4rem;
  }
}
</style>
