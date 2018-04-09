<template>
  <div class="home">
    <h1>Welcome</h1>

    <div class="warn toast">
      <div class="content">
        <div class="heading">Under construction!</div>
        <p>
          Please check back later when we have real content.
        </p>
      </div>
    </div>

    <p>
      This site provides information on various aspects of Dragon Nest. Information on monsters, 
      bosses, nests, items, skills, and more are or will be available here.
    </p>
    <p>
      Begin by selecting a category in the navigation pane. Change regions using the region selector in the top right.
    </p>
    <p>
      Additional categories, other regions, side-by-side region comparisons, and language overrides will be coming 
      later.
    </p>

    <h2>Region Information</h2>
    <div class="loading" v-if="loading">
      <load-indicator
        loadText="Region Information" inline></load-indicator>
    </div>
    <div class="warn toast" v-if="error">
      <div class="content">
        <div class="heading">
          Error
        </div>
        <p>{{ error }}</p>
      </div>
    </div>
    <div class="tag-table" v-if="server">
      <div class="row">
        <div class="rowhead">Region</div>
        <div class="data">{{ server.displayNames.default }}</div>
      </div>
      <div class="row">
        <div class="rowhead">Version</div>
        <div class="data">{{ server.version }}</div>
      </div>
      <div class="row">
        <div class="rowhead">Patched</div>
        <div class="data">{{ server.patchedTime | moment("MMM DD YYYY") }}</div>
      </div>
      <!-- <div class="row">
        <div class="rowhead">Language</div>
        <div class="data">{{ server.defaultLocale }}</div>
      </div>
      <div class="row">
        <div class="rowhead">Level Cap</div>
        <div class="data">{{ server.levelCap }}</div>
      </div> -->
    </div>

    <server-time big="true" />
  </div>
</template>

<script>
import Vue from 'vue';
import region from '@/api/region';

import Loader from "@/components/util/Loader";
import ServerTime from "@/components/util/ServerTime";

Vue.component("load-indicator", Loader);
Vue.component("server-time", ServerTime);

export default {
  name: 'home',
  data () {
    return {
      loading: false,
      server: null,
      error: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.error = this.server = null;
      this.loading = true;
      region.getRegionByShortName(this.$store.state.regionCode,
        (d) => {
          this.server = d;
          this.loading = false;
        },
        (err) => {
          this.error = err;
          this.loading = false;
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../less/core.less";

.tag-table {
  .row {
    position: relative;
    vertical-align: center;
    .rowhead {
      width: 70px;
      font-family: @dv-f-lato;
      color: @dv-c-foreground;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: inline-block;
    }
    .data {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      display: inline-block;
    }
  }
}

</style>
