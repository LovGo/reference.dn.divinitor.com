<<template>
    <div class="job-icon">
        <div class="job"  
            :style="`background:url(${iconData.url}) -${iconData.x}px -${iconData.y}px`"></div>
    </div>
</template>

<script>
import Job from '@/api/job/job';

export default {
    props: ["iconIndex"],
    computed: {
        iconData: function() {
            let ret = Job.getIconCoordinates(this.iconIndex);
            ret.url = Job.getIconUrl();
            return ret;
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../less/core.less";

.job-icon {
    width: 55px;
    height: 55px;
    position: relative;
    display: inline-block;

    .job {
        position: absolute;
        top: 1px;
        left: 1px;
        right: 0;
        bottom: 0;
    }
}
</style>
