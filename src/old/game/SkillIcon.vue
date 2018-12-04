<<template>
    <div class="skill-icon">
        <div class="skill"  
            :style="`background:url(${iconData.url}) -${iconData.x}px -${iconData.y}px`"></div>
    </div>
</template>

<script>
import Skill from '@/old/api/skill/skill';

export default {
    props: ["iconIndex"],
    computed: {
        iconData: function() {
            let ret = Skill.getIconCoordinates(this.iconIndex);
            ret.url = Skill.getIconUrl(ret.page);
            return ret;
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.skill-icon {
    width: 50px;
    height: 50px;
    position: relative;
    display: inline-block;

    .skill {
        position: absolute;
        top: 1px;
        left: 1px;
        right: 0;
        bottom: 0;
        width: 48px;
        height: 48px;
    }
}
</style>
