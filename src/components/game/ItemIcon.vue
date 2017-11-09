<<template>
    <div class="item-icon">
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
    props: ["iconIndex", "rank", "type"],
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
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
}
</style>
