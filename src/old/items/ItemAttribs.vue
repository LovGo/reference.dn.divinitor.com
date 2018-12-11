<template>
<div class="attributes">
    <div class="attrib" v-if="itemData.durationDays">
        <div class="icon"><i class="fa fa-clock-o"></i></div>
        {{ itemData.durationDays }} days
    </div>
    <div v-if="itemData.cashItem">
        <div class="attrib yes" v-if="itemData.canTrade">
            <div class="icon"><i class="fa fa-exchange"></i></div>
            <span v-if="itemData.listings">{{ itemData.listings }} listings</span>
            <span v-else>Need warranty</span>
        </div>
        <div class="attrib no" v-else>
            <div class="icon"><i class="fa fa-chain"></i></div>
            Untradable
        </div>
    </div>
    <div v-else>
        <div class="attrib yes" v-if="itemData.canTrade && !forceBound">
            <div class="icon"><i class="fa fa-exchange"></i></div>
            Tradable
        </div>
        <div class="" v-else>
            <div class="attrib yes tooltip" v-if="itemData.unstampCount > 0">
                <div class="icon"><i class="fa fa-unlink"></i></div>
                Unbind {{ itemData.unstampCount }}x
                <div class="tooltext">
                    <div class="content">Uses {{ unstampAmt }} stamps</div>
                </div>
            </div>
            <div class="attrib no" v-else>
                <div class="icon"><i class="fa fa-chain"></i></div>
                Untradable
            </div>
        </div>
    </div>
    <div class="attrib maybe tooltip" v-if="itemData.premiumStorage">
        <div class="icon">
            <i class="fa fa-suitcase"></i>
        <div class="tooltext">
            <div class="content">Requires <strong>{{itemData.premiumStorage.item.name.name}}</strong> x{{itemData.premiumStorage.count}}</div>
        </div>
        </div>
        Premium storagable
    </div>
    <div class="attrib yes" v-else-if="itemData.canServerStorage && !forceBound">
        <div class="icon"><i class="fa fa-suitcase"></i></div>
        Server storagable
    </div>
    <div class="attrib no" v-else>
        <div class="icon"><i class="fa fa-lock"></i></div>
        Character bound
    </div>
    <div class="attrib no" v-if="!itemData.canDestroy && !itemData.cashItem">
        <div class="icon"><i class="fa fa-minus-circle"></i></div>
        Cannot be destroyed
    </div>
    <div class="attrib tooltip" v-if="itemData.npcSellAmount">
        <div class="icon">
            <i class="fa fa-dollar"></i>
            <!-- More dollars for more gold -->
            <i class="fa fa-dollar" v-if="itemData.npcSellAmount >= 10000000"></i>
            <i class="fa fa-dollar" v-if="itemData.npcSellAmount >= 100000000"></i>
        </div>
        NPC for {{ itemData.npcSellAmount | goldG }}
        <div class="tooltext" v-if="!$fOn($f.DisableGoldenGoose)">
            <div class="content">Sell to an NPC for <strong>{{ itemData.npcSellAmount | gold }}</strong><br/>Golden Goose (+15%): <strong>{{ Math.round(itemData.npcSellAmount * 1.15, 1) | gold }}</strong></div>
        </div>
    </div>
    <div class="attrib yes tooltip" v-if="itemData.gearScore">
        <div class="icon">
            <i class="fa fa-diamond"></i>
            <i class="fa fa-diamond" v-if="itemData.gearScore >= 300"></i>
            <i class="fa fa-diamond" v-if="itemData.gearScore >= 600"></i>
        </div>
        <strong>+{{ combinedGearScore.total | thousands }}</strong> GS
        <div class="tooltext">
            <div class="content">Gear Score (GS) is a rough rating of an item's strength<br/>
            <span v-if="combinedGearScore.total != combinedGearScore.base">Base <strong>{{itemData.gearScore}} GS</strong> + Variant <strong>{{combinedGearScore.potential}} GS</strong> + Enhance <strong>{{combinedGearScore.enhance}} GS</strong></span></div>
        </div>
    </div>
    <div class="attrib tooltip" v-if="itemData.equipPoints">
        <div class="icon"><i class="fa fa-balance-scale"></i></div>
        <strong>{{ itemData.equipPoints | thousands }}</strong> EP
        <div class="tooltext">
            <div class="content">Equipment Points (EP) is an item's weight.<br/>Max <strong>50 EP</strong> of equipment can be worn.</div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: [
        "itemData",
        "forceBound",
        "combinedGearScore",
        "effectiveEnhanceLevel",
    ],
    computed: {
        unstampAmt() {
            if (this.itemData.unstampCosts) {
                return this.itemData.unstampCosts[this.effectiveEnhanceLevel];
            }

            return "unknown";
        },
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";
.attributes {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.attrib {
    flex: 0 1 auto;
    margin: 0 8px;

    &.yes {
        .fa {
            color: saturate(@dv-c-green, -20%);
        }
    }

    &.maybe {
        .fa {
            color: saturate(@dv-c-orange, -20%);
        }
    }

    &.no {
        .fa {
            color: saturate(@dv-c-red, -20%);
        }
    }

    .icon {
        display: inline-block;

        .fa {
            &:nth-child(2),
            &:nth-child(3) {
                margin-left: -0.4em;
            }

            &.fa-dollar {
                color: lighten(@dv-c-body, -20%);

                &:nth-child(2) {
                    color: @dv-c-body;
                }
                &:nth-child(3) {
                    color: white;
                }
            }

            &.fa-diamond {
                color: lighten(@dv-c-green, -10%);

                &:nth-child(2) {
                    color: @dv-c-green;
                    margin-left: -0.75em;
                }
                &:nth-child(3) {
                    color: lighten(@dv-c-green, 20%);
                    margin-left: -0.75em;
                }
            }
        }
    }
}
</style>
