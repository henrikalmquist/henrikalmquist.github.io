<template>
  <div class="layout-grid">
    <!-- sticky header -->
    <header class="site-header" :class="{ 'is-white': $route.path === '/' }">

      <div class="container top-pad page-center">
        <div class="brand-row">
          <span class="brand-aaa">
            <router-link to="/" class="inherit-link">AAA</router-link>
          </span>
         <span class="brand-sub">
  <router-link to="/agency" class="header-link" :class="{ 'is-active': $route.path === '/agency' }">Agency</router-link>
  <span>&nbsp;for&nbsp;</span>
  <router-link to="/adaptive" class="header-link" :class="{ 'is-active': $route.path === '/adaptive' }">Adaptive</router-link>
  <span>&nbsp;</span>
  <router-link to="/architecture" class="header-link" :class="{ 'is-active': $route.path === '/architecture' }">Architecture</router-link>
  <span>&nbsp;</span>
  <!-- Language toggle -->
  <span class="lang-toggle">
    <a href="#" class="header-link" :class="{ 'is-active': lang === 'sv' }" @click.prevent="setLang('sv')">sv</a>&hairsp;/<a href="#" class="header-link" :class="{ 'is-active': lang === 'en' }" @click.prevent="setLang('en')">en</a>
  </span>
</span>

        </div>
      </div>
    </header>

    <!-- centered content area with spacing below header -->
    <main class="container main-pad page-center">
      <router-view />
    </main>

    <footer class="container bottom-pad page-center">
      <div>
          <a href="mailto:contact@a-a-a.se" title="contact@a-a-a.se" aria-label="contact@a-a-a.se">mail</a>&nbsp;
  <a href="tel:+46793513461" title="+46793513461" aria-label="+46793513461">phone</a>&nbsp;
  <a href="https://www.instagram.com/almquisthenrik/" title="Instagram" aria-label="@almquisthenrik">@almquisthenrik</a>
</div>
    </footer>
  </div>
</template>


<script>
import { ref, provide } from 'vue';

export default {
  name: 'App',
  setup() {
    const lang = ref('en'); // default language
    const setLang = (v) => (lang.value = v);
    provide('lang', lang);  // make available to all child components
    return { lang, setLang };
  }
};

</script>

<style scoped>
/* layout containers */
.container { padding: 0 12px; }
.top-pad   { padding-top: 12px; }
.bottom-pad{ padding: 0px 12px 12px; }

/* sticky header; transparent so no white bar */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: transparent;
}

/* center page content */
.page-center {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* space under header */
.main-pad { margin-top: 16px; }

/* header layout */
.brand-row { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }

/* AAA — the only big text (set family + weight explicitly here) */
.brand-aaa {
  font-family: STRATFORD, sans-serif;  /* ensure same family on all breakpoints */
  font-weight: 700;                    /* always bold */
  font-size: 48px;
  line-height: 1;
}

/* subtitle: same size as body, just italic */
.brand-sub {
  font-style: normal;
  font-size: inherit;
  line-height: inherit;
}

/* links */
.inherit-link { color: inherit; text-decoration: none; font-style: normal; } /* AAA link */

/* header nav links: italic by default; active = regular + underline */
.header-link { color: inherit; text-decoration: none; font-style: italic; }
.header-link.is-active { font-style: italic; text-decoration: none; }

  .layout-grid > main {
    padding-bottom: 1.5rem;  /* adjust value as you like */
  }


/* Guard against margin-collapsing pulling the footer up */
.layout-grid > main > *:first-child {
  margin-top: 0;
}

@media (min-width:1024px){
  .container   { padding: 0 48px; }
  .top-pad     { padding-top: 32px; }
  .page-center { max-width: 1280px; }
  

  /* Keep AAA bold on desktop too — only change size if you want */
  .brand-aaa {
    font-family: STRATFORD, sans-serif;
    font-weight: 700;
    font-size: 48px;   /* change to 56px if you want same size as mobile */
    line-height: 1;
  }
}
.site-header.is-white {
  color: white;
}

.lang-toggle a {
  text-decoration: underline;
  font-style: normal;
}

.lang-toggle a.is-active {
  text-decoration: none;
  font-style: italic;
}



/* Make the root fill the viewport (must be global, not scoped) */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Grid layout: header | main | footer */
.layout-grid {
  min-height: 100vh;               /* use 100dvh if you prefer on mobile */
  display: grid;
  grid-template-rows: auto 1fr auto;
}

/* Let the main row stretch/shrink without forcing overflow */
.layout-grid > main {
  min-height: 0;
}

/* Guard against margin-collapsing pulling the footer up */
.layout-grid > main > *:first-child {
  margin-top: 0;
}


</style>


