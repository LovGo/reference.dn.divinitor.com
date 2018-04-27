<template>
  <div class="nav">
    <h1>Navigation</h1>
    <ul>
      <router-link to="/" tag="a" exact><li>Home</li></router-link>
      <router-link to="/general" tag="a"><li>General</li></router-link>
      <router-link to="/jobs" tag="a"><li class="disabled">Classes</li></router-link>
      <router-link to="/items" tag="a"><li :class="authed ? '' : 'disabled'">Items</li></router-link>
      <router-link to="/maps" tag="a"><li class="disabled">Maps</li></router-link>
      <router-link to="/monsters" tag="a"><li :class="authed ? '' : 'disabled'">Monsters</li></router-link>
      <router-link to="/npcs" tag="a"><li class="disabled">NPCs</li></router-link>
      <router-link to="/quests" tag="a"><li class="disabled">Quests</li></router-link>
      <router-link to="/skills" tag="a"><li class="disabled">Skills</li></router-link>
      <router-link to="/text" tag="a"><li :class="authed ? '' : 'disabled'">Text</li></router-link>
      <router-link to="/resources" tag="a"><li>Resources</li></router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'navigation-pane',
  computed: {
      authed() {
          return this.$store.getters.isAuthed;
      },
  },
  data () {
    return {
        
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../less/core.less";

.nav {
  h1 {
    font-size: 18px;
    margin: 5px 0 10px 0;
    padding: 0;
  }

  .home {
    padding-left: 0.5em;
    border-left: @dv-c-accent-1 solid 2px;
    transition: border ease-in 0.125s;
    font-weight: normal;
    letter-spacing: 0.1em;
    color: @dv-c-accent-1;
    text-transform: uppercase;
    margin-left: 0.25em;
    margin-top: 1em;
    line-height: 1.25em;

    &:hover {
        color: @dv-c-foreground;
    }

    &.router-link-exact-active {
      color: @dv-c-foreground;
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      text-transform: uppercase;
      font-family: @dv-f-lato;
      font-size: 14px;

      margin-left: 0.25em;
      margin-top: 0.6em;
    
      padding-left: 0.5em;
      padding-top: 0.2em;
      padding-bottom: 0.2em;
      border-left: @dv-c-accent-1 solid 2px;
      transition: border ease-in 0.125s, color ease-in 0.125s, background-color ease-in 0.125s;
      font-weight: normal;
      letter-spacing: 0.1em;
      color: @dv-c-accent-1;
      cursor: pointer;

      &:hover {
          color: @dv-c-foreground;
          background: fade(@dv-c-foreground, 20%);
      }

      &.disabled {
        pointer-events: none;
        color: @dv-c-disabled;
        border-left: @dv-c-disabled solid 2px;
      }
    }
    
    .router-link-active li {
      color: @dv-c-foreground;
      background: fade(@dv-c-accent-2, 10%);
    }
    .router-link-active li:hover {
      background: fade(@dv-c-foreground, 20%);
    }
  }
}

</style>
