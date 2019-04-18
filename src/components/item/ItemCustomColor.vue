<template>
<div class="item-custom-color">
    <!-- <table>
        <thead>
            <td v-for="(v, i) in colorCode.toString(2).padStart(32, '0')" :key="i">
                {{ (31 - i).toString().padStart(2, '0') }}
            </td>
        </thead>
        <tbody>
            <tr>
            <td v-for="(v, i) in colorCode.toString(2).padStart(32, '0')" :key="i">
                {{ v }}
            </td>
            </tr>
        </tbody>
    </table> -->

    <i>The colors displayed here may not be 100% accurate due to further color adjustments due to the base texture</i>

    <div class="swatches">
        <div class="swatch">
            <div class="color-tile" :style="`background-color: ${asStyleString(diffuse)}`">
                <div class="label">Base</div><br/>
                <div class="value">{{ asHex(diffuse) }}</div>
            </div>
        </div>
        <div class="swatch">
            <div class="color-tile" :style="`background-color: ${asStyleString(emissive)}`">
                <div class="label">Glow</div><br/>
                <div class="value">{{ asHex(emissive) }}</div>
            </div>
        </div>
        <div class="two swatch">
            <div class="color-tile" :style="`background-color: ${asStyleString(combined)}`">
                <div class="label">Result</div><br/>
                <div class="value">{{ asHex(combined) }}</div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        colorCode: {
            type: Number as () => number,
            required: true,
        },
    },
    computed: {
        diffuse(): number[] {
            const red = this.normalize(this.getDiffuseChannel(20), 8) * 255;
            const green = this.normalize(this.getDiffuseChannel(10), 8) * 255;
            const blue = this.normalize(this.getDiffuseChannel(0), 8) * 255;

            return [red, green, blue];
        },
        emissive(): number[] {
            const red = this.normalize(this.getEmissiveChannel(26), 2) * 255;
            const green = this.normalize(this.getEmissiveChannel(16), 2) * 255;
            const blue = this.normalize(this.getEmissiveChannel(6), 2) * 255;

            return [red, green, blue];
        },
        combined(): number[] {
            const dif = this.diffuse;
            const emi = this.emissive;

            const multi = 0.675;
            return [dif[0] + (emi[0] * multi), dif[1] + (emi[1] * multi), dif[2] + (emi[2] * multi)];
        },
    },
    methods: {
        asStyleString(n: number[]) {
            const values = n.map(v => this.fixed(v)).join(', ');
            return `rgb(${values})`;
        },
        asHex(n: number[]) {
            const values = n.map((v) => (~~v).toString(16).padStart(2, '0')).join('');
            return '#' + values;
        },
        getDiffuseChannel(offset: number): number {
            return this.extractBits(offset, 6);
        },
        getEmissiveChannel(offset: number): number {
            return this.extractBits(offset, 4);
        },
        extractBits(offset: number, bits: number): number {
            const baseBitMask = (1 << bits) - 1;
            const offsetBitMask = baseBitMask << offset;
            return (this.colorCode & offsetBitMask) >> offset;
        },
        normalize(value: number, bits: number): number {
            const max = (1 << bits) - 1;
            return value / max;
        },
        fixed(n: number): string {
            return n.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            });
        }
    }
});
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-custom-color {

    table {
        background: black;
        td {
            padding: 0 2px;
            text-align: left;
            font-size: 12px;
        }
        tr {
            background: transparent;
            color: white;
        }
    }

    >.swatches {
        margin: 8px 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        border: 1px solid @dv-c-foreground;

        >.swatch {
            flex: 1 1;
            margin: 0;
            height: 50px;

            &.two {
                flex: 2 2 100%;
                height: 100px;
            }

            >.color-tile {
                width: 100%;
                height: 100%;

                >.label, >.value {
                    display: inline-block;
                    color: white;
                    font-family: @dv-f-geomanist;
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    background: fade(black, 40%);
                    padding: 2px 4px;
                    margin: 0;
                    margin-left: 8px;
                    color: @dv-c-foreground;
                }
                >.label {
                    user-select: none;
                }
                >.value {
                    font-size: 14px;
                    color: @dv-c-accent-2;
                }
            }
        }
    }

}

</style>
