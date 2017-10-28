<template>
  <div class="nav">
    <h1>Navigation</h1>
    <router-link to="/" class="home">Home</router-link>
    <ul>
      <router-link to="/general" tag="li">General</router-link>
      <router-link to="/job" tag="li" class="disabled">Classes</router-link>
      <router-link to="/item" tag="li" class="disabled">Items</router-link>
      <router-link to="/npc" tag="li" class="disabled">Maps</router-link>
      <router-link to="/monster" tag="li" class="disabled">Monsters</router-link>
      <router-link to="/npc" tag="li" class="disabled">NPCs</router-link>
      <router-link to="/quest" tag="li" class="disabled">Quests</router-link>
      <router-link to="/skill" tag="li" class="disabled">Skills</router-link>
      <router-link to="/text" tag="li" class="">Text</router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'navigation-pane',
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
      margin-top: 1em;
    
      padding-left: 0.5em;
      border-left: @dv-c-accent-1 solid 2px;
      transition: border ease-in 0.125s, color ease-in 0.125s;
      font-weight: normal;
      letter-spacing: 0.1em;
      color: @dv-c-accent-1;
      cursor: pointer;

      &:hover {
          color: @dv-c-foreground;
      }

      &.router-link-active {
        border-left: @dv-c-accent-2 solid 2px;
        color: @dv-c-foreground;
      }

      &.disabled {
        pointer-events: none;
        color: @dv-c-disabled;
        border-left: @dv-c-disabled solid 2px;
      }
    }
  }
}

</style>
