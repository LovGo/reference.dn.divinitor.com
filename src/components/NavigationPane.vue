<template>
  <div class="nav">
    <h1>Navigation</h1>
    <router-link to="/" class="home">Home</router-link>
    <ul>
      <li class="disabled"><router-link to="/job">Classes</router-link></li>
      <li class="disabled"><router-link to="/item">Items</router-link></li>
      <li class="disabled"><router-link to="/npc">Maps</router-link></li>
      <li class="disabled"><router-link to="/monster">Monsters</router-link></li>
      <li class="disabled"><router-link to="/npc">NPCs</router-link></li>
      <li class="disabled"><router-link to="/quest">Quests</router-link></li>
      <li class="disabled"><router-link to="/skill">Skills</router-link></li>
      <li class="disabled"><router-link to="/uistring">UI Strings</router-link></li>
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
      line-height: 1.25em;
      
      a {
        padding-left: 0.5em;
        border-left: @dv-c-accent-1 solid 2px;
        transition: border ease-in 0.125s, color ease-in 0.125s;
        font-weight: normal;
        letter-spacing: 0.1em;
        color: @dv-c-accent-1;

        &:hover {
            color: @dv-c-foreground;
        }

        &.router-link-active {
          border-left: @dv-c-accent-2 solid 2px;
          color: @dv-c-foreground;
        }
      }

      &.disabled {
        pointer-events: none;
        a {
          color: @dv-c-disabled;
          border-left: @dv-c-disabled solid 2px;
        }
      }

      &.sub {
        margin-top: 0;
        padding-left: 2em;
        line-height: 1.75em;
        a {
          color: @dv-c-idle;
          
          &:hover {
            color: @dv-c-foreground;
          }
        }
      }
    }
  }
}

</style>
