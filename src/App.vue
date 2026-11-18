<template>
  <div
    class="layout-grid"
    :class="{
      'project-mode': $route.path.startsWith('/project'),
      'adaptive-mode': $route.path === '/adaptive'
    }"
  >
    <!-- sticky header -->
    <header v-if="!$route.path.startsWith('/project')" class="site-header" :class="{ 'is-white': $route.path === '/' }">
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
            <!-- <span class="lang-toggle">
              <a href="#" class="header-link" :class="{ 'is-active': lang === 'sv' }" @click.prevent="setLang('sv')">sv</a>&hairsp;/<a href="#" class="header-link" :class="{ 'is-active': lang === 'en' }" @click.prevent="setLang('en')">en</a>
            </span> -->
          </span>
        </div>
      </div>
    </header>

    <main
      :class="$route.path.startsWith('/project')
        ? 'project-main'
        : 'container main-pad page-center'"
    >
      <router-view />
    </main>

    <footer v-if="!$route.path.startsWith('/project')" class="container bottom-pad page-center">
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
    const lang = ref('en');
    const setLang = (v) => (lang.value = v);
    provide('lang', lang);
    return { lang, setLang };
  }
};
</script>

<style scoped>
.container { padding: 0 12px; }
.top-pad { padding-top: 12px; }
.bottom-pad { padding: 0px 12px 12px; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: transparent;
}

.page-center {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.main-pad { margin-top: 16px; }

.brand-row { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }

.brand-aaa {
  font-family: STRATFORD, sans-serif;
  font-weight: 700;
  font-size: 48px;
  line-height: 1;
}

.brand-sub {
  font-style: normal;
  font-size: inherit;
  line-height: inherit;
}

.inherit-link { color: inherit; text-decoration: none; font-style: normal; }
.header-link { color: inherit; text-decoration: none; font-style: italic; }
.header-link.is-active { font-style: italic; text-decoration: none; }

.layout-grid > main {
  padding-bottom: 1.5rem;
}

.layout-grid > main > *:first-child {
  margin-top: 0;
}

@media (min-width:1024px) {
  .container { padding: 0 48px; }
  .top-pad { padding-top: 32px; }
  .page-center { max-width: 1280px; }
  .brand-aaa {
    font-family: STRATFORD, sans-serif;
    font-weight: 700;
    font-size: 48px;
    line-height: 1;
  }
}

.site-header.is-white { color: white; }

.lang-toggle a { text-decoration: underline; font-style: normal; }
.lang-toggle a.is-active { text-decoration: none; font-style: italic; }

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.layout-grid {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.layout-grid > main { min-height: 0; }

.layout-grid > main > *:first-child { margin-top: 0; }

/* Adaptive: keep the same sticky header behavior as the other pages.
   The negative margin lets the first image begin behind it, without fixing
   or absolutely positioning the header. */
.layout-grid.adaptive-mode {
  min-height: 100vh;
}

.adaptive-mode .site-header {
  position: sticky;
  top: 0;
  background: transparent;
  margin-bottom: -80px;
  z-index: 50;
}

.adaptive-mode > main {
  margin-top: 0;
  padding: 0;
  max-width: none;
}

.adaptive-mode > footer {
  position: relative;
}

.layout-grid.project-mode {
  grid-template-rows: minmax(0, 1fr);
  height: 100vh;
  overflow: hidden;
}

.project-main {
  width: 100%;
  max-width: none;
  min-width: 0;
  min-height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
