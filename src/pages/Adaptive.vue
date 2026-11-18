
<template>
  <section class="adaptive-page">

    <!-- Intro image -->
    <figure class="adaptive-image adaptive-image--intro">
      <img :src="images[0].src" :alt="images[0].alt" fetchpriority="high" />

      <div class="adaptive-intro">
        <div class="adaptive-intro__grid">
          <div class="adaptive-intro__content">
            <div class="adaptive-intro__text">
              <p>AAA helps property owners, developers and municipalities unlock the potential of existing buildings and places.</p>

<p>We identify opportunities for reuse, adaptation and development, combining architectural insight with strategic, economic and environmental thinking to evaluate alternatives and shape a clear way forward.</p>

<p>From early investigations to concrete strategies, AAA brings clarity to complex situations, helping to make informed decisions and put existing resources to their best use.</p> </div>
          </div>
        </div>
      </div>

      <figcaption
  class="adaptive-legend"
  :style="{ '--legend-position': (images[0].legendPosition ?? 50) + '%' }"
>
  {{ images[0].legend }}
</figcaption>
    </figure>

    <!-- Remaining images -->
    <div class="adaptive-images">
      <figure
        v-for="image in images.slice(1)"
        :key="image.src"
        class="adaptive-image"
      >
        <img :src="image.src" :alt="image.alt" loading="lazy" />

       <figcaption
  class="adaptive-legend"
  :style="{ '--legend-position': (image.legendPosition ?? 50) + '%' }"
>
  {{ image.legend }}
</figcaption>
      </figure>
    </div>

  </section>
</template>

<script>
export default {
  name: 'AdaptivePage',

  data() {
    return {
      images: [
        {
          src: '/img/AAA021/AAA021_02.jpg',
          alt: 'AAA021',
          legend: 'Many qualities we seek to create are often already there.',
          legendPosition: 78
        },
        {
          src: '/img/AAA021/20250918_131927.jpg',
          alt: 'AAA021',
          legend: 'The way we live and work is rapidly changing, to what extent do we need to adapt?',
          legendPosition: 64
        },
        {
          src: '/img/AAA021/primus%20int%20002.png',
          alt: 'AAA021',
          legend: 'Exploring alternatives before committing to a single direction requires to understand the design universe of the possible.',
          legendPosition: 71
        },
        {
          src: '/img/AAA024/AAA024_Extending_into_the_Sun_01w.jpg',
          alt: 'AAA024 – Extending into the Sun',
          legend: 'Deciding what to keep, what to change and where new value can emerge bridges the material qualities with the projects wider ambitions.',
          legendPosition: 67
        }
      ]
    }
  }
}
</script>

<style scoped>
.adaptive-page {
  width: 100%;
}

/* Images */

.adaptive-image {
  position: relative;
  width: 100vw;
  margin: 0 0 0 calc(50% - 50vw);
  padding: 0;
}

.adaptive-image > img {
  display: block;
  width: 100%;
  height: auto;
}

.adaptive-images {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Introductory text */

.adaptive-intro {
  position: absolute;
  inset: 0;
  z-index: 1;
  color: #000;
  pointer-events: none;
}

.adaptive-intro__grid {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 5.4rem 48px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7rem;
  box-sizing: border-box;
}

.adaptive-intro__content {
  grid-column: 1;
  min-width: 0;
}

.adaptive-intro__text p {
  margin: 0 0 1rem;
  font: inherit;
  color: #000;
}

/* Image legends */

.adaptive-legend {
  position: absolute;
  z-index: 2;
  left: max(12px, calc((100vw - 1280px) / 2 + 48px));
  top: var(--legend-position, 50%);
  transform: translateY(-50%);
  width: calc(50% - 48px);
  margin: 0;
  color: rgb(255, 255, 0);
  font: inherit;
  font-size: 2.3rem;
  line-height: 1.2;
  font-weight: 700;
  text-align: left;
}

/* Mobile */

@media (max-width: 768px) {
  .adaptive-intro__grid {
    padding: 4.4rem 12px 0;
    grid-template-columns: 1fr;
    gap: 0;
  }

  .adaptive-intro__content {
    grid-column: 1;
  }

  .adaptive-intro__text p {
    background: rgba(255,255,255,.65);
    padding: 0.1rem;
  }

  .adaptive-legend {

    width: calc(100% - 24px);
    font-size: 1rem;
    font-weight: 400;
  }
}
</style>
