<template>
<div class="page-section">
    <div class="title">Basic Info</div>
    <div class="two-col">
        <table class="col">
            <thead>
                <th>Property</th>
                <th>Value</th>
            </thead>
            <tbody>
                <tr>
                    <th>Map Type</th>
                    <td>
                        {{ mapTypeDesc }} ({{ mapData.mapType }})
                    </td>
                </tr>
                <tr>
                    <th>Map SubType</th>
                    <td>
                        {{ mapSubTypeDesc }} ({{ mapData.mapSubType }})
                    </td>
                </tr>
                <tr>
                    <th>Max Weekly Clears</th>
                    <td>
                        <template v-if="mapData.maxClearCount">
                            {{ mapData.maxClearCount }}
                            <template v-if="mapData.vipClearCount - mapData.maxClearCount > 0">
                                (VIP +{{ mapData.vipClearCount - mapData.maxClearCount }})
                            </template>
                        </template>
                        <template v-else>
                            Unlimited
                        </template>
                    </td>
                </tr>
                <tr>
                    <th>Can Rejoin</th>
                    <td>
                        {{ mapData.allowRejoin | yesNo }}
                    </td>
                </tr>
                <tr>
                    <th>Can Return to Town</th>
                    <td>
                        {{ mapData.returnVillage | yesNo }}
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="col">
            <thead>
                <th>Property</th>
                <th>Value</th>
            </thead>
            <tbody>
                <tr>
                    <th>Pet</th>
                    <td>
                        {{ mapData.allowPet | allowDisallow }}
                        <template v-if="mapData.hidePet">, but hidden</template>
                    </td>
                </tr>
                <tr>
                    <th>Mount</th>
                    <td>
                        {{ mapData.allowVehicle | allowDisallow }}
                    </td>
                </tr>
                <tr>
                    <th>Auto-pickup Gold</th>
                    <td>
                        {{ mapData.autoPickupGold | yesNo }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import IGameMap, { MapType, MapSubType } from '../../models/maps/IGameMap';
export default Vue.extend({
    props: {
        mapData: {
            type: Object as () => IGameMap,
        }
    },
    filters: {
        yesNo(val: any): string {
            const v = String(val);
            if (v === 'true') {
                return 'Yes';
            }

            return 'No';
        },
        allowDisallow(val: any): string {
            const v = String(val);
            if (v === 'true') {
                return 'Allowed';
            }

            return 'Disabled';
        }
    },
    computed: {
        mapTypeDesc(): string {
            switch (this.mapData.mapType) {
                case MapType.UNKNOWN:
                    return 'Unknown';
                case MapType.TOWN_FARM_ARENA_GUILDHOUSE:
                    return 'Village';
                case MapType.FIELDS_TITLES_TUTORIALS:
                    return 'Field/Tutorial/Title Screen';
                case MapType.DUNGEONS_NESTS:
                    return 'Dungeon/Nest';
                default:
                    return 'Unknown';
            }
        },
        mapSubTypeDesc(): string {
            switch (this.mapData.mapSubType) {
                case MapSubType.GENERAL:
                    return 'General';
                case MapSubType.NESTS:
                    return 'Nest';
                case MapSubType.COLOSSEUM_TOWN:
                    return 'Arena Town';
                case MapSubType.COLOSSEUM_LOBBY:
                    return 'PvP Lobby';
                case MapSubType.FARM:
                    return 'Farm';
                case MapSubType.DARK_BANQUET:
                    return 'Dark Banquet';
                case MapSubType.ATRIUM_MEZZ_GAZEBO:
                    return 'Atrium/Mezzanine/Gazebo';
                case MapSubType.PRACTICE_SOLO_NESTS:
                    return 'Practice Mode/Solo Nest';
                case MapSubType.DARK_GATEWAY_VILLAGE:
                    return 'Dark Gateway Lobby';
                case MapSubType.TREASURE_DUNGEON:
                    return 'Treasure Dungeon';
                case MapSubType.DRAGON_EXPEDITION:
                    return 'Dragon Expedition';
                case MapSubType.SAINTS_HAVEN_DEFENSE:
                    return 'Saint Haven Defense';
                case MapSubType.TRIAL_NEST:
                    return 'Trial Nest';
                case MapSubType.HEROS_BATTLEFIELD:
                    return "Hero's Battlefield";
                case MapSubType.CITADEL_OF_EROSION:
                    return 'Citadel of Erosion';
                case MapSubType.CITADEL_OF_EROSION_FIELD:
                    return 'Citadel of Erosion field';
                case MapSubType.INFINITE_BATTLEFIELD:
                    return 'Infinite Battlefield';
                case MapSubType.NIGHTMARE:
                    return 'Nightmare';
                case MapSubType.PVE_TRAINING:
                    return 'PvE Training';
                case MapSubType.GUILD_HOUSE:
                    return 'Guild Base';
                default:
                    return 'Unknown';
            }
        },
    }
})
</script>

<style lang="less" scoped>

</style>
