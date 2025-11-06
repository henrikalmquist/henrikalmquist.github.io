<template>
  <section
    class="start-cover"
    :style="{ backgroundImage: `url(${bgUrl})` }"
    @click="go"
  >
    <div class="quote">
      <div class="quote-inner">
        <p class="line">
          In embracing the complexity of an existing building or place – we can do more – with less.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "StartPage",
  data() {
    return {
      bgUrl: "" // randomised background
    };
  },
  methods: {
    go() {
      this.$router.push("/adaptive");
    },
    pickRandom(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
  },
  mounted() {
    // images must exist in /public/img/AAAstart/
    const images = [
      "/img/AAAstart/01.jpg",
      "/img/AAAstart/02.jpg"
      // add more here
    ];
    this.bgUrl = this.pickRandom(images);
  }
};
</script>

<style scoped>
/* full-bleed background */
.start-cover {
  position: fixed;
  inset: 0;
  z-index: 1;
  background-size: cover;
  background-position: center;
  cursor: crosshair;
  transition: background-image 0.4s ease-in-out;
  color: #fff !important;
}

/* vertically centre the inner container, not the full viewport text */
.quote {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
}

/* match App.vue’s .container + .page-center */
.quote-inner {
  width: 100%;
  max-width: 1200px; /* same as .page-center */
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px; /* same as .container */
  padding-right: 24px;
}

/* align with AAA: same family, weight, size as .brand-aaa (48 px in App.vue) */
.line {
  font-family: STRATFORD, sans-serif;
  font-weight: 700;
  font-size: 48px;
  line-height: 1;
  text-align: left;
  color: #ffffff; /* white text for dark images */
}

@media (min-width: 1024px) {
  .quote-inner {
    max-width: 1280px; /* match desktop .page-center */
    padding-left: 48px;
    padding-right: 48px;
  }
  /* if you later change .brand-aaa to 56 px on desktop, mirror it here */
  /* .line { font-size: 56px; } */
}

@media (max-width: 768px) {
  .line {
    font-size: 36px;
  }
}
</style>
