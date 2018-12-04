<template>
<div class="nav">
    <div class="mobile-hide">
        <h1>Navigation</h1>
        <ul>
            <router-link to="/" tag="a" exact><li>Home</li></router-link>
            <router-link to="/general" tag="a"><li>General</li></router-link>
            <router-link to="/jobs" tag="a"><li class="">Classes</li></router-link>
            <router-link to="/items" tag="a"><li class="">Items</li></router-link>
            <router-link to="/maps" tag="a"><li class="">Maps</li></router-link>
            <router-link to="/monsters" tag="a"><li class="">Monsters</li></router-link>
            <!-- <router-link to="/npcs" tag="a"><li class="disabled">NPCs</li></router-link>
            <router-link to="/quests" tag="a"><li class="disabled">Quests</li></router-link> -->
            <router-link to="/skills" tag="a"><li class="">Skills</li></router-link>
            <router-link to="/text" tag="a"><li class="">Text</li></router-link>
            <router-link to="/resources" tag="a"><li>Resources</li></router-link>
        </ul>

        <div class="related-links">
            <div class="link">
                <a href="https://divinitor.com" target="_blank">Divinitor Home</a>
            </div>
            <div class="link">
                <a href="https://www.patreon.com/divinitor" target="_blank">Patreon</a>
            </div>
            <div class="link">
                <a href="https://discord.gg/BeqJcCq" target="_blank">Discord</a>
            </div>
            <div class="link">
                <a href="https://blog.divinitor.com" target="_blank">Divinitor Blog</a>
            </div>
            <div class="link">
                <a href="https://labs.divinitor.com" target="_blank">Divinitor Labs</a>
            </div>

        </div>
    </div>
    <div class="mobile-only">
        <div class="menu-icon" v-on:click="toggleMenu" :open="mobileOpenState">
            <i class="fa fa-navicon"></i>
        </div>
        <div class="mobile" v-if="mobileOpenState">
            <h1>Navigation</h1>
            <ul>
                <router-link to="/" tag="a" exact><li>Home</li></router-link>
                <router-link to="/general" tag="a"><li>General</li></router-link>
                <router-link to="/jobs" tag="a"><li class="">Classes</li></router-link>
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
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Store from "@/store";

interface IData {
    mobileOpenState: boolean;
}

export default Vue.extend({
    computed: {
        authed(): boolean {
            return this.$store.getters.authenticated;
        },
    },
    data(): IData {
        return {
            mobileOpenState: false,
        };
    },
    watch: {
        ["$route"]() {
            this.setMenuState(false);
        }
    },
    methods: {
        toggleMenu() {
            this.setMenuState(!this.mobileOpenState);
        },
        setMenuState(state: boolean) {
            if (this.mobileOpenState && !state) {
                this.$anime({
                    targets: ".mobile",
                    opacity: ["1.0", "0.0"],
                    duration: 250,
                    easing: "easeOutCubic",
                }).finished.then(() => {
                    this.mobileOpenState = false;
                });
            } else if (!this.mobileOpenState && state) {
                this.mobileOpenState = true;
                Vue.nextTick().then(() => {
                    this.$anime({
                        targets: ".mobile",
                        opacity: ["0.0", "1.0"],
                        duration: 250,
                        easing: "easeInCubic",
                    });
                    this.$anime({
                        targets: ".mobile ul",
                        translateX: {
                            value: ["400", "0"],
                            duration: 100,
                            easing: "easeOutCubic",
                            elasticity: 500,
                        },
                        opacity: {
                            value: ["0.0", "1.0"],
                            duration: 250,
                            easing: "easeOutCubic",
                        },
                        delay: 150,
                    })
                });
            }
        }
    }
});
</script>

<style lang="less" scoped>
@import "./../../less/core.less";

.nav {
    user-select: none;

    h1 {
        font-size: 18px;
        margin: 5px 0 10px 0;
        padding: 0;
    }

    a {
        outline: 0;
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

    .related-links {
        margin: 20px 0 0 12px;

        .link {
            font-family: @dv-f-geomanist;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.1em;
            line-height: 18px;
            a {
                color: @dv-c-idle;

                &:hover {
                    color: @dv-c-foreground;
                }
            }
        }
    }

    .menu-icon {
        position: absolute;
        top: 0;
        right: 0;
        width: 40px;
        height: 40px;
        border: 1px solid @dv-c-idle;
        text-align: center;
        color: @dv-c-idle;
        font-size: 30px;
        cursor: pointer;
        transition: border-color 0.125s ease-in, color 0.125s ease-in;

        &:hover,
        &[open] {
            border-color: @dv-c-foreground;
            color: @dv-c-foreground;
        }
    }

    .mobile {
        z-index: 100;
        width: 100%;
        position: fixed;
        top: 74px;
        right: 0;
        left: 0;
        bottom: 0;
        overflow-y: auto;
        background-color: @dv-c-background;
        padding: 10px 20px;
        overflow-x: hidden;

        li {
            margin-right: 50px;
        }
    }
}
</style>

