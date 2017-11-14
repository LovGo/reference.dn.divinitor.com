<<template>
    <div class="item-icon">
        <div class="enhance" v-if="enhanceLvl > 0">{{ enhanceLvl }}</div>
        <div class="count" v-if="count > 1">{{ count | thousands}}</div>
        <div class="item"  
            :style="`background:url(${iconData.url}) -${iconData.x}px -${iconData.y}px`"></div>
        <div class="overlay"
            :style="`background:url(${slotData.url}) -${slotData.x}px -${slotData.y}px`"></div>
    </div>
</template>

<script>
import item from '@/api/item/item';
import region from '@/api/region';

export default {
    props: ["iconIndex", "rank", "type", "count", "enhanceLvl"],
    computed: {
        iconData: function() {
            let ret = item.getIconCoordinates(this.iconIndex);
            ret.url = item.getItemIconPageUrl(ret.page, this.$store.state.regionCode);
            return ret;
        },
        slotData: function() {
            let ret = item.getSlotOverlay(this.rank, this.type, this.$store.state.regionCode);
            return ret;
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.item-icon {
    width: 52px;
    height: 52px;
    position: relative;
    display: inline-block;

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .item {
        position: absolute;
        top: 1px;
        left: 1px;
        right: 0;
        bottom: 0;
    }

    .count {
        @text-shadow: #000;
        @offset: 1px;
        font-family: @dv-f-lato;
        position: absolute;
        z-index: 1;
        font-size: 14px;
        user-select: none;
        text-shadow:
            -@offset -@offset 0 @text-shadow,
             @offset -@offset 0 @text-shadow,
            -@offset  @offset 0 @text-shadow,
             @offset  @offset 0 @text-shadow;
        right: 7px;
        bottom: 4px;
        text-align: right;
        color: white;
    }

    .enhance {
        @text-shadow: #000;
        @offset: 1px;
        position: absolute;
        z-index: 1;
        font-size: 14px;
        user-select: none;
        text-shadow:
            -@offset -@offset 0 @text-shadow,
             @offset -@offset 0 @text-shadow,
            -@offset  @offset 0 @text-shadow,
             @offset  @offset 0 @text-shadow;
        left: 1px;
        top: 2px;
        color: #F0F080;
        text-align: right;

        &::before {
            content: "+";
        }
    }
}
</style>
