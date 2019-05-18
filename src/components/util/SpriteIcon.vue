<<template>
<div class="sprite-icon-wrapper"
    :style="`width: ${sizePx}px; height: ${sizePx}px;`">
    <div class="sprite-icon-resize" :style="`transform: scale(${resize})`">
        <div class="sprite-icon"
            :style="`width: ${iconInfo.size}px; height: ${iconInfo.size}px;`">
            <div class="sprite"  
                :style="`background:url(${iconInfo.url}) -${iconInfo.x}px -${iconInfo.y}px;`"></div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import IIconInfo from '@/models/util/IIconInfo';
export default Vue.extend({
    props: {
        iconInfo: {
            type: Object as () => IIconInfo,
        },
        sizeOverride: {
            type: Number as () => number,
        }
    },
    computed: {
        resize(): number {
            if (this.sizeOverride) {
                const n = Number(this.sizeOverride);
                return Math.floor(n / this.iconInfo.size * 100) / 100;
            }

            return 1;
        },
        sizePx(): number {
            return this.iconInfo.size * this.resize;
        }
    }
});
</script>


<style lang="less" scoped>
@import "../../less/core.less";

.sprite-icon-wrapper {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    vertical-align: bottom;

    .sprite-icon-resize {
        position: relative;
        transform-origin: top left;
        // transform-origin: top right;

        .sprite-icon {
            position: relative;

            .sprite {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }
        }
    }
}
</style>
