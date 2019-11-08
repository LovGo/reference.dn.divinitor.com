<template>
    <div class="itempage">
        <!--
            LOADING
         -->
        <div class="top">&nbsp; <!-- Prevent margin collapse --></div>
        <transition name="fade">
            <div v-if="loading" class="loading">
                <load-indicator
                :loadText="`Item #${itemId}`"></load-indicator>
            </div>
        </transition>
        <!-- <div class="go-back"
            v-on:click="goBack">
            <i class="fa fa-angle-double-left"></i>Back
        </div> -->
        <!--
            ERROR
         -->
        <transition name="fade">
            <div class="error" v-if="error">
                <div class="go-back"
                    v-on:click="goBack"
                    v-if="!$route.query.embed">
                    <i class="fa fa-angle-double-left"></i>Back
                </div>
                <big-error-box 
                    :errorTitle="'Error: ' + error.statusText" 
                    :errorContent="error.bodyText" 
                    :secondaryInfo="`Item ID #${itemId}`"
                    canRetry="true"
                    v-on:retry="fetchData"
                    iconClass="fa-exclamation-triangle"></big-error-box>
            </div>
        </transition>
        <!--
            RESULT
         -->
        <div v-if="!loading && itemData">
            <div class="go-back"
                v-on:click="goBack"
                v-if="!$route.query.embed">
                <i class="fa fa-angle-double-left"></i>Back
            </div>

            <div class="header">
                <div class="icon">
                    <item-icon 
                        class="centering"
                        :iconIndex="itemData.iconIndex" 
                        :rank="itemData.rank"
                        :type="itemData.type.type"
                        :count="itemData.maxStack"
                        :enhanceLvl="enhanceLevel"
                    ></item-icon>
                </div>
                <div class="title">
                    <div class="remark">
                        <span class="iid">#{{ itemId }}<span class="divider">/</span>{{ ownerTable }}</span>
                    </div>
                    <h2 class="head">
                        <span class="enhance" v-if="enhanceLevel > 0">+{{ enhanceLevel }} </span>
                        <ui-string 
                            :mid="nameMessage.id" 
                            :alt="nameMessage.message" 
                            :params="itemData.name._NameIDParam"
                            :inline="true" 
                        />
                    </h2>
                    <div class="remark">
                        <span v-if="itemData.level > 1" class="level">{{ itemData.level }} </span>
                        <template v-if="itemData.tier">
                            <span class="tier" v-html="itemData.tier"></span>&nbsp;
                        </template>
                        <span :class="'rank-' + itemData.rank.toLowerCase()">{{ itemData.rank }} </span> 
                        <span v-if="canUse" class="can-use">{{ canUse }} </span>
                        <span v-if="itemData.cashItem" class="cash">Cash </span>
                        {{ category }}
                    </div>
                </div>
            </div>

            <copy-link :copyContent="link">
                <i class="fa fa-share-square-o"></i> Copy link
                <template slot="ok"><i class="fa fa-check"></i> Link copied!</template>
            </copy-link>

            <div class="desc-model-container">
                <div class="info-top">
                    <item-attribs
                        :itemData="itemData"
                        :forceBound="forceBound"
                        :combinedGearScore="combinedGearScore"
                        :effectiveEnhanceLevel="effectiveEnhanceLevel"/>
                    <!-- {{ itemData.type.type }} -->

                    <div class="stat-stack">
                        <div class="stats">
                            <stat-grid v-if="itemData.stats.length"
                                :statSet="statSet"
                                :enhanceStatSet="enhanceLevelStats"
                                >
                            </stat-grid>
                            
                            <div class="potential section" v-if="itemData.type.potentialId && itemData.potentials && (itemData.potentials.length > 1 || (itemData.potentials.length > 0 && isSkillOnly))">
                                <div class="potential-id">{{ itemData.type.potentialId }}</div>
                                <div class="title">Variations</div>
                                <item-potential
                                    :potentialData="itemData.potentials"
                                    :potentialNum="potentialNum"
                                    :selection="potentialId"
                                    v-on:potentialIdChange="onPotentialIdUpdate"
                                ></item-potential>
                            </div>
                        </div>
                    </div>
                    <div class=""
                        v-if="itemType == 'VEHICLE_MULTI_MOUNT' || itemType == 'VEHICLE'">
                        Vehicle movement speed {{ itemData.type.movementSpeedPercent}}%
                    </div>

                    <div class="desc">
                        <div v-if="itemData.desc">    
                            <ui-string 
                                :mid="itemData.desc._DescID" 
                                :alt="itemData.desc.desc" 
                                :params="itemData.desc._DescIDParam"
                                format="html"
                            />
                        </div>
                        <!-- <div v-if="itemData.desc" v-html="itemData.desc.desc" class="uistring"></div> -->
                        <div v-else>No description</div>
                        <div v-if="itemData.gainText" class="game-tooltip">
                            <div v-html="itemData.gainText" class="gain uistring"></div>
                        </div>

                        <div class="skill" v-if="itemData.skillInfo">
                            <skill-stub-link :skill-id="itemData.skillInfo.id" />
                        </div>

                        <div class="gems" v-if="itemData.gemslots">
                            <div 
                                class="skillgem gemslot tooltip" 
                                v-if="itemData.gemslots.skill" 
                                :style="`background: url('${baseUrl}/server/${region}/dds/uit_re_itemjewelslot03/png') 1px 0, url('${baseUrl}/server/${region}/dds/uit_itemslot_re01_d/png') -4px -4px;`">
                                <div class="count" v-if="itemData.gemslots.skill > 1">
                                    x{{itemData.gemslots.skill}}
                                </div>
                                <div class="tooltext">
                                    <div class="content">Skill gem</div>
                                </div>
                            </div>
                            <div 
                                class="offensive gemslot tooltip" 
                                v-if="itemData.gemslots.offensive" 
                                :style="`background: url('${baseUrl}/server/${region}/dds/uit_re_itemjewelslot02/png') 1px 0, url('${baseUrl}/server/${region}/dds/uit_itemslot_re01_d/png') -4px -4px;`">
                                <div class="count" v-if="itemData.gemslots.offensive > 1">
                                    x{{itemData.gemslots.offensive}}
                                </div>
                                <div class="tooltext">
                                    <div class="content">Offensive gem</div>
                                </div>
                            </div>
                            <div 
                                class="defensive gemslot tooltip" 
                                v-if="itemData.gemslots.defensive" 
                                :style="`background: url('${baseUrl}/server/${region}/dds/uit_re_itemjewelslot01/png') 1px 0, url('${baseUrl}/server/${region}/dds/uit_itemslot_re01_d/png') -4px -4px;`">
                                <div class="count" v-if="itemData.gemslots.defensive > 1">
                                    x{{itemData.gemslots.defensive}}
                                </div>
                                <div class="tooltext">
                                    <div class="content">Defensive gem</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="extra-data">
                        <div class="color" 
                            v-if="itemType == 'HAIRDYE' || itemType == 'CONTACT_LENS' || itemType == 'TWO_TONE_HAIRDYE'">
                            <item-custom-color :colorCode="itemData.type.color" />
                        </div>
                        <div class=""
                            v-if="itemType == 'SKILL_RESET_SCROLL' || itemType == 'UNLIMITED_RESET_SCROLL'">
                            Resets your <strong>{{ itemData.type.minSpec | ordinal}} 
                            <span v-if="itemData.type.minSpec != itemData.type.maxSpec">
                                through {{ itemData.type.maxSpec | ordinal }} 
                            </span>
                            </strong>
                            specialization's skills.
                        </div>
                        <div class=""
                            v-if="itemType == 'REVIVAL_SCROLL'">
                            Adds <strong>{{ itemData.type.reviveIncrAmt }} cash revive(s)</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'PET_ALICORN'">
                            Revives an ally for <strong>{{ itemData.type.reviveDurationDays }} day(s).</strong>
                        </div>
                        <div class=""
                            v-if="itemType == 'DNP_COUPON'">
                            Credits <strong>{{ itemData.type.dnpAmount | thousands }} DNP</strong> to your account.
                        </div>
                        <div class=""
                            v-if="itemType == 'EXP_SCROLL'">
                            Increases EXP gained by <strong>{{ itemData.type.expBoostPercent }}%</strong> 
                            for characters up to <strong>Level {{ itemData.type.maxLevel }}</strong>
                        </div>
                        <div class=""
                            v-if="itemType == 'PET_EXP_JUICE'">
                            Increases ally's EXP by <strong>{{ itemData.type.expAmt | thousands }}</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'INVENTORY_SLOT_EXPANSION'">
                            Expands your inventory by <strong>{{ itemData.type.slotIncrAmt | thousands }} slot(s)</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'STORAGE_SLOT_EXPANSION'">
                            Expands your storage by <strong>{{ itemData.type.slotIncrAmt | thousands }} slot(s)</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'EXP_UP_ITEM'">
                            Increases your EXP by <strong>{{ itemData.type.expIncrAmt | thousands }}</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'ULTIMATE_FTG_UP'">
                            Can only be used by characters <strong>level {{ itemData.type.levelCap }} and below</strong>.
                            <div v-if="itemData.type.isUnlimited"><strong>Unlimited</strong> uses (not consumed when used).</div>
                            <div v-else><strong>One-time</strong> use.</div>
                        </div>
                        <div class=""
                            v-if="itemType == 'PVP_EXP_UP'">
                            Increases your Arena EXP by <strong>{{ itemData.type.expIncrAmt | thousands }}</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'NEW_USER_EXP_INCREASE'">
                            Increases your EXP by <strong>{{ itemData.type.expIncrAmtPercent }}%</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'TALISMAN_SLOT_EXPANSION'">
                            EC Talisman slots last for <strong>{{ itemData.type.durationDays }} day(s)</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'MERCENARY_EXP_POTION'">
                            Increases your active mercenary's EXP by <strong>{{ itemData.type.expBoostAmt | thousands}}</strong>.<br/>
                            Can be used on mercenaries <strong>below Level {{ itemData.type.maxMercLevel }}</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'BONOUS_FISHING_SEA_FISH'">
                            Worth <strong>{{ itemData.type.weight }} fishing point(s)</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'UNSEAL_INCR_AND_WARRANTY'">
                            Usable on 
                            <strong>
                                <span v-if="itemData.type.isCash">cash items</span>
                                <span v-else>unbindable items</span>
                            </strong>
                            only.
                        </div>
                        <div class=""
                            v-if="itemType == 'JUMP_TO_LEVEL'">
                            Jumps your character to <strong>Level {{ itemData.type.targetLevel }}</strong>.<br/>
                            Cannot be used if over <strong>Level {{ itemData.type.targetLevel }}</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'MERC_EXPLORATION_AWAKENING_POTION'">
                            Can only use <strong>{{ itemData.type.maxSimulUse }}</strong> at a time.
                        </div>
                        <div class=""
                            v-if="itemType == 'HERO_LEVEL_EXP_POTION'">
                            Increases your Hero EXP by <strong>{{ itemData.type.heroExpIncrAmt }}</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'HERO_LEVEL_JUMP_TO_LEVEL'">
                            Jumps your Hero EXP to <strong>Hero Level {{ itemData.type.targetLevel }}</strong>.<br/>
                            Cannot be used if at or over <strong>Hero Level {{ itemData.type.targetLevel }}</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'HERO_LEVEL_EXP_SCROLL'">
                            Increases your Hero EXP gain by <strong>{{ itemData.type.heroExpIncrAmtPercent }}%</strong>.
                        </div>
                        <div class=""
                            v-if="itemType == 'FORTUNE_COIN_POINTS'">
                            <!-- TODO -->
                            Gain <point-tag :pointId="itemData.type.coinType" :amount="itemData.type.amount"></point-tag>
                            upon acquisition or activation.
                        </div>            
                        <div class=""
                            v-if="itemType == 'TITLE'">
                            Grants the following title when used:
                            <title-info :titleId="itemData.type.appellationId"/>
                        </div>
                    </div>
                </div>
                <div class="model-view" v-if="hasModel && !$route.query.embed">
                    <item-parts 
                        :itemId="itemData.id"
                        :parts="itemData.parts"
                        :type="itemData.type"
                        :key="`parts-${itemData.id}`"
                        />
                </div>
            </div>

            <div class="section" v-if="itemData.itemSet">
                <div class="title">Item Set</div>
                <item-set :setData="itemData.itemSet" :itemId="itemData.id" :jobs="itemData.needClass"></item-set>
            </div>

            <!-- {{ itemData.type }} -->

            <div class="section" v-if="itemType == 'ENHANCEMENT_HAMMER'">
                <div class="title">Enhancement Hammer</div>
                <mobile-enhance :mobileEnchantId="itemData.type.mobileEnchantId"></mobile-enhance>
            </div>

            <div class="section" v-if="itemType == 'ITEM_TUNER'">
                <div class="title">Item Tuner</div>
                <item-tuner :tunerId="itemData.type.changeMatchingId" :parentItemId="itemId"></item-tuner>
            </div>

            <div class="section" v-if="containerItem">
                <div class="title">Box Contents</div>
                <item-charm
                    :charmId="itemData.type.charmNum || itemData.type.param1"
                    :itemType="itemData.type"
                    :itemId="itemId"
                />
            </div>
            <div class="section" v-if="itemType == 'RANDOM'">
                <div class="title">Box Contents</div>
                <item-random
                    :randomId="itemData.type.itemDropTableId || itemData.type.param1"
                    :itemType="itemData.type"
                >
                </item-random>
            </div>

            <div class="section" v-if="itemData.enchantId">
                <div class="title">Enhancement</div>
                <item-enhance 
                    :enhanceLevel="enhanceLevel" 
                    :itemData="itemData" 
                    v-on:levelUpdate="onLevelUpdate">
                </item-enhance>
            </div>
            <div class="section" v-if="itemData.extract && Object.keys(itemData.extract.results).length">
                <div class="title">Extraction</div>
                Extracting 
                <span v-if="itemData.enchantId">at +{{enhanceLevel}}</span> 
                costs <b>{{ itemData.extract.cost | gold }}</b> and can give one of:

                <transition-group name="fade-item" tag="div" class="item-list" v-if="itemData.extract.results[effectiveEnhanceLevel] && !enhanceData[effectiveEnhanceLevel - 1]">
                    <div class="entry" v-for="(iid, key) in itemData.extract.results[effectiveEnhanceLevel]" :key="key">
                        <item-card :itemId="iid"></item-card>
                    </div>
                </transition-group>
                <transition name="fade-item" v-else-if="enhanceData[effectiveEnhanceLevel - 1]">
                    <item-drop-list :dropId="enhanceData[effectiveEnhanceLevel - 1].disjointDropId" />
                </transition>

                <div class="info toast"
                    v-if="!$route.query.embed">
                    <div class="icon">
                        <i class="fa fa-exclamation-triangle"></i>
                    </div>
                    <div class="content">
                        <div class="heading">
                            Darkness Falls
                        </div>
                        <p>
                            Sorry! We can't show extraction rates because they aren't in the client.
                        </p>
                    </div>
                </div>
            </div>

            <div class="section"
                v-if="!$route.query.embed">
                <div class="title">Procurement</div>
                <!-- <div v-if="itemData.gainText" class="game-tooltip">
                    <div class="title">Game Tooltip</div>
                    <div v-html="itemData.gainText" class="gain uistring"></div>
                </div> -->
                <item-acquire
                    :item="itemData"
                    >
                </item-acquire>

            </div>

            <item-tunings :itemId="itemId" :parentItem="itemData"></item-tunings>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import ItemIcon from "@/old/game/ItemIcon";
import Points from "@/old/game/Points";
import StatGrid from "@/old/game/StatGrid";
import ItemCard from "@/old/items/ItemCard";
import ItemEnhance from "@/old/items/ItemEnhance";
import ItemTuner from "@/old/items/ItemTuner";
import ItemCharm from "@/old/items/ItemCharm";
import ItemRandom from "@/old/items/ItemRandom";
import MobileEnhance from "@/old/items/MobileEnhance";
import ItemPotential from "@/old/items/ItemPotential";
import ItemAcquire from "@/old/items/ItemAcquire";
import ItemSet from "@/old/items/ItemSet";
import ItemTunings from "@/old/items/ItemTunings";
import ItemParts from "@/old/items/ItemParts";
import BigErrorBox from '@/old/util/BigErrorBox';
import ItemDropListComponent from "@/old/items/ItemDropListComponent";
import ItemAttribs from "@/old/items/ItemAttribs";

import Item from "@/old/api/item/item";
import ItemStat from "@/old/api/item/itemstat";

import CopyLink from "@/components/util/CopyLink.vue";
import { ApiHttpClient } from "@/globals";

import SkillStubLink from "@/components/skill/SkillStubLink.vue";
import UiString from "@/components/uistring/UiString.vue";
import TitleInfo from "@/components/title/TitleInfo.vue";
import ItemCustomColor from "@/components/item/ItemCustomColor.vue";

Vue.component('item-icon', ItemIcon);
Vue.component('point-tag', Points);
Vue.component('stat-grid', StatGrid);
Vue.component('item-card', ItemCard);
Vue.component('item-enhance', ItemEnhance);
Vue.component('item-tuner', ItemTuner);
Vue.component('item-charm', ItemCharm);
Vue.component('item-random', ItemRandom);
Vue.component('item-potential', ItemPotential);
Vue.component('item-set', ItemSet);
Vue.component('item-tunings', ItemTunings);
Vue.component('mobile-enhance', MobileEnhance);
Vue.component('item-acquire', ItemAcquire);
Vue.component('item-parts', ItemParts);
Vue.component('item-drop-list', ItemDropListComponent);
Vue.component('item-attribs', ItemAttribs);

Vue.component('big-error-box', BigErrorBox);

export default {
    name: "item-page",
    components: {
        SkillStubLink,
        CopyLink,
        ItemCustomColor,
        UiString,
        TitleInfo,
    },
    data: function() {
        return {
            itemId: this.extractItemId(this.$route.params.itemId),
            loading: true,
            itemData: null,
            enhanceLevel: 0,
            enhanceLevelStats: null,
            enhanceData: [],
            potentialNum: 0,
            potentialId: 0,
            error: null,
            copyStatus: null,
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        '$route'(to, from) {
            this.itemId = this.extractItemId(this.$route.params.itemId);
        },
        itemId(to, from) {
            if (to != from) {
                this.fetchData();
            }
        },
        enhanceLevel(to, from) {
            if (to != from) {
                this.updateQueryParams();
            }
        },
        potentialNum(to, from) {
            if (to != from) {
                this.updateQueryParams();
            }
        },
        potentialId(to, from) {
            if (to != from) {
                this.updateQueryParams();
            }
        }
    },
    computed: {
        region() {
            return this.$store.state.regionCode;
        },
        baseUrl() {
            return ApiHttpClient.defaults.baseURL;
        },
        name() {
            if (this.itemData.name) {
                if (this.itemData.name.name && this.itemData.name._NameID) {
                    return this.itemData.name.name;
                } else if (this.itemData.name._NameID) {
                    return "Item MID:" + this.itemData.name._NameID;
                }
            }
            
            return "Unnamed Item " + this.itemId;
        },
        nameMessage() {
            return {
                id: Number((this.itemData.name && this.itemData.name._NameID) || 0),
                message: this.name,
            };
        },
        ownerTable() {
            if (this.itemData) {
                return this.itemData.ownerTable;
            }

            return 'virt.itemtable';
        },
        canUse() {
            if (this.itemData.needClass) {
                return this.itemData.needClass.filter(c => c.id != 0).map(c => c.displayName).join("/\u200B");
            }

            return null;
        },
        category() {
            return Item.getItemDetailedCategory(this.itemData);
        },
        containerItem() {
            let t = this.itemData.type.type;
            let tid = this.itemData.type.typeId;
            return t === "ITEM_DROP_POUCH" || t === "MULTI_ITEM_DROP_POUCH" || t === "ITEM_DROP_DUAL_POUCH" ||
                t === "HERO_POUCH" || tid === 142;
        },
        forceBound() {
            //  Certain items (COUGH QUEST) are untradable at all times
            let t = this.itemData.type.type;
            return t === "QUEST";
        },
        hasModel() {
            return !!this.itemData.parts && this.itemData.parts.parts.length;
        },
        statSet() {
            let ret = ItemStat.joinStatSet(this.itemData.stats);
            if (this.itemData.potentials) {
                let potentials = this.itemData.potentials;
                if (potentials.length == 1) {
                    let potSet = ItemStat.joinStatSet(potentials[0].states, "value");
                    ret = ItemStat.zipStatSets(ret, potSet);
                }
            }

            return ret;
        },
        effectiveEnhanceLevel() {
            if (isNaN(this.enhanceLevel)) {
                return 0;
            }

            return this.enhanceLevel;
        },
        itemType() {
            return this.itemData.type.type;
        },
        hasExtraData() {
            let t = this.itemData.type.type;
            switch(t) {
                case "HAIRDYE":
                case "ENCHANT_JELLY":
                case "REVIVE_SCROLL":
                case "SKINDYE":
                case "CONTACT_LENS":

                case "TWO_TONE_HAIRDYE":
                    return true;
            }

            return false;
        },
        combinedGearScore() {
            let ret = {
                base: this.itemData.gearScore,
                potential: this.potentialGearScore,
                enhance: this.enhanceGearScore
            };

            ret.total = ret.base + ret.potential + ret.enhance;

            return ret;
        },
        potentialGearScore() {
            if (this.potentialId) {
                for (let k in this.itemData.potentials) {
                    let v = this.itemData.potentials[k];
                    if (v.id == this.potentialId) {
                        return v.gearScore;
                    }
                }
            }

            return 0;
        },
        enhanceGearScore() {
            if (this.enhanceLevel && this.enhanceData && this.enhanceData[this.enhanceLevel - 1]) {
                return this.enhanceData[this.enhanceLevel - 1].gearScoreBonus;
            }

            return 0;
        },
        link() {
            let queries = {};
            queries = Object.assign(queries, this.$route.query);
            delete queries["embed"];
            queries.region = this.$store.state.regionCode;

            let url = window.location.origin + this.$route.path;

            let qString = Object.keys(queries).map(k => `${k}=${queries[k]}`).join("&");
            if (qString.length > 0) {
                url += "?" + qString;
            }

            return url;
        },
        isSkillOnly() {
            return this.itemData.potentials.filter((p) => p.skill).length == this.itemData.potentials.length;
        }
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.error = null;
            this.enhanceLevelStats = null;
            this.enhanceLevel = Number(this.$route.query.enhance);
            this.potentialNum = Number(this.$route.query.potential);
            this.potentialId = Number(this.$route.query.p);
            if (isNaN(this.enhanceLevel)) {
                this.enhanceLevel = 0;
            }

            this.itemData = null;
            Item.getItem(this.itemId, this.region,
                (res) => {
                    this.itemData = res;
                    this.loading = false;
                    this.updateQueryParams();
                },
                (err) => {
                    this.loading = false;
                    if (err.response) {
                        if (err.response.status == 404) {
                            this.error = {
                                statusText: "Item not found",
                                bodyText: "The item you are looking for does not exist in this region. Double check the ID or try another region."
                            }
                        } else if (err.response.status >= 500) {
                            this.error = {
                                statusText: "Service error",
                                bodyText: "There was an issue fetching data for this item. Please try again later.",
                            }
                        } else {
                            this.error = {
                                statusText: "Unknown error",
                                bodyText: axiosErrorToString(err),
                            }
                        }
                    } else {
                        this.error = err;
                    }
                });
        },
        onLevelUpdate(newLevel, enhanceStatSet, enhanceData)  {
            this.enhanceLevel = newLevel;
            this.enhanceLevelStats = enhanceStatSet;
            this.enhanceData = enhanceData;
        },
        onPotentialIdUpdate(newPotentialId) {
            this.potentialId = newPotentialId;
        },
        updateQueryParams() {
            let query = {};
            if (this.enhanceLevel > 0) {
                query.enhance = this.enhanceLevel;
            }

            if (this.potentialId > 0) {
                query.p = this.potentialId;
            }

            if (this.$route.query.embed) {
                query.embed = this.$route.query.embed;
            }

            this.$router.replace({ 
                name: 'item-view', 
                params: {
                    itemId: this.toEasyName(this.itemId, this.itemData)
                }, 
                query: query
            });
        },
        extractItemId(str) {
            let split = str.split("-", 2);
            return Number(split[0]);
        },
        toEasyName(itemId, itemData) {
            return Item.itemEasyUrl(itemId, itemData);
        },
        goBack() {
            this.$router.back();
        },
        copyLink() {
            appInsights.trackEvent(`interaction.item.item.copyLink`, {
                itemId: this.itemId,
                region: this.region
            });
            let box = this.$refs['copyLink'];
            box.value = this.link;
            box.focus();
            box.select();
            let success = document.execCommand('copy');
            if (success) {
                this.copyStatus = 'ok';
            } else {
                this.copyStatus = 'err';
            }

            setTimeout(() => this.copyStatus = null, 2000);
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.itempage {
    position: relative;
    min-height: 1vh;
    margin-top: 0;
    padding-top: 0;
    width: 100%;
    .header {
        position: relative;
        width: 100%;
        .padding-left(0);
        padding-bottom: 0;
        display: flex;
        flex-direction: row;

        .icon{ 
            flex: 0 0 50px;
            vertical-align: middle;
            width: 50px;
            
            .centering {
                position: absolute;
                top: 50%;
                transform: translate(0px, -50%);
            }

        }

        .title {
            flex: 1 1 auto;
            .margin-left(10px);
            .border-left(2px solid @dv-c-accent-1);
            .padding-left(12px);
            padding-top: 8px;
            padding-bottom: 8px;

            .head {
                margin: -4px 0;
                padding: 0;
                font-size: 24px;
            }

            .remark {
                font-size: 12px;
                letter-spacing: 0.2em;
                text-transform: uppercase;

                .iid {
                    .divider {
                        margin: 0 6px;
                        color: @dv-c-idle;
                    }
                }

                .tier {
                    display: inline-block;
                }

                .level {
                    color: @dv-c-accent-2;
                    &::before {
                        content: "LV ";
                        font-size: 0.625em;
                        color: @dv-c-accent-1;
                    }
                }

                .can-use {
                    color: @dv-c-accent-2;
                }

                .cash {
                    color: #10A020;
                }
            }
        }

    }

    .section {
        position: relative;
        margin-top: 25px;
        border-top: 1px solid @dv-c-accent-1;
        padding-top: 4px;
        .title {
            font-size: 12px;
            color: @dv-c-accent-1;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            position: absolute;
            top: -1.3em;
            .left(0);
            user-select: none;
        }

        .side-remark {
            font-size: 14px;
            color: @dv-c-body;
            .fa {
                color: @dv-c-foreground;
            }
            margin: 8px 0;
            // font-family: @dv-f-geomanist;
            // letter-spacing: 0.05em;
            // text-transform: uppercase;
        }
    }

    .attrib {
        flex: 0 1 auto;
        margin: 0 8px;
        // &:first-child {
        //     margin-left: 0;
        // }
        // &:last-child {
        //     margin-right: 0;
        // }

        &.yes {
            .fa {
                color: saturate(@dv-c-green, -20%);
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
                    .margin-left(-0.4em);
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
                        .margin-left(-0.75em);
                    }
                    &:nth-child(3) {
                        color: lighten(@dv-c-green, 20%);
                        .margin-left(-0.75em);
                    }
                }
            }
        }
    }

    .desc-model-container {
        display: flex;
        flex-direction: row;

        @3d-size: 256px;
        
        @media only screen and (max-width: (@3d-size * 3)) {
            flex-wrap: wrap;
        }

        .info-top {
            flex: 1 1 auto;

            .attributes {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

            }

            .desc {
                position: relative;
                margin-top: 25px;
                border-top: 1px solid @dv-c-accent-1;
                padding-top: 4px;
                &::before {
                    content: "Description";
                    font-size: 12px;
                    color: @dv-c-accent-1;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    position: absolute;
                    top: -1.3em;
                    .left(0);
                }

                .gain {
                    margin-top: 0.5em;
                }

                .skill {
                    margin-top: 16px;
                }
            }

            .stats {
                position: relative;
                // margin-top: 25px;
                // border-top: 1px solid @dv-c-accent-1;
                padding-top: 4px;
                // &::before {
                //     content: "Stats";
                //     font-size: 12px;
                //     color: @dv-c-accent-1;
                //     text-transform: uppercase;
                //     letter-spacing: 0.2em;
                //     position: absolute;
                //     top: -1.3em;
                //     left: 0;
                // }

                .potential {
                    margin-top: 20px;
                    border-top: 1px solid fade(@dv-c-accent-1, 25%);
                }
            }

            .extra-data {
                margin-top: 1em;
            }
        }

        .model-view {
            flex: 0 0 @3d-size;
            height: @3d-size;
            text-align: center;
            vertical-align: middle;
            border: 1px solid @dv-c-accent-1;
            .margin-left(30px);
        }
    }


    .gems {
        margin-top: 12px;
        border-top: 1px solid fade(@dv-c-accent-1, 25%);
        padding-top: 6px;
        display: flex;
        flex-direction: row;

        .gemslot {
            flex: 0 0 48px;
            width: 48px;
            height: 48px;
            position: relative;
            margin: 0 2px;

            .count {
                position: absolute;
                .right(0px);
                bottom: 0px;
            }
        }
    }

    .item-list {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .entry {
            flex: 1 1 400px;
            border: 1px solid @dv-c-foreground;
            border-top-color: transparent;

            &:first-child {
                border-top-color: @dv-c-foreground;
            }

            @media only screen and (min-width:@min-desktop-wide-width) {
                flex: 0 1 460px;
                .border-right-color(transparent);
                &:first-child,
                &:nth-child(2) {
                    border-top-color: @dv-c-foreground;
                }
                &:nth-child(2n) {
                    .border-right-color(@dv-c-foreground);
                }
                &:last-child {
                    .border-right-color(@dv-c-foreground);
                    padding-right: 1px;
                }
                &:first-child:last-child {
                    .border-right-color(@dv-c-foreground);
                }

            }
        }

    }
     
    .game-tooltip {
        position: relative;
        margin-top: 2em;
    }

    
    .loading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;

        // padding-top: 100px;
        .loader-box {
            position: absolute;
            top: 150px;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 16px 0;;
            text-align: center;
            
            .label {
                position: absolute;
                left: 0;
                right: 0;
                top: 50%;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                color: @dv-c-foreground;
                transform: translate(0, 4px);
            }

            .loader,
            .loader:after {
                border-radius: 50%;
                width: 10em;
                height: 10em;
            }
            .loader {
                position: absolute;
                left: 50%;
                top: 50%;
                line-height: 100%;
                font-size: 16px;
                margin: -5em -6em;
                text-indent: -9999em;
                border-top: 1.1em solid rgba(0, 0, 0, 0.75);
                .border-right(1.1em solid rgba(0, 0, 0, 0.75));
                border-bottom: 1.1em solid rgba(0, 0, 0, 0.75);
                .border-left(1.1em solid @dv-c-foreground);
                background: rgba(0, 0, 0, 0.5);
                //   -webkit-transform: translateZ(0);
                //   -ms-transform: translateZ(0);
                //   transform: translateZ(0);
                -webkit-animation: load8 1.1s infinite linear;
                animation: load8 1.1s infinite linear;
            }
        }
    }
}
</style>
