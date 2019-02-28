<template>
<div class="test-page">
    <h3>Item tile</h3>
    <div class="dv-item-tile">
        Test Item Tile
    </div>
    <br/><br/>
    <div class="dv-item-tile">
        <div class="title">
            Item tile title
            <div class="subtitle">
                Item subtitle
            </div>    
        </div>
    </div>
    <br/><br/>
    <div class="dv-item-tile">
        <div class="title">
            Item tile title long title lorem ipsum abcd efghi
            <div class="subtitle">
                Item subtitle
            </div>    
        </div>
    </div>

    <h3>Button</h3>
    <button class="dv-button">
        Test button
    </button>

    <h3>Secondary Button</h3>
    <button class="dv-button secondary">
        Test button
    </button>

    <h3>Section</h3>
    <div class="dv-section">
        <div class="dividing title">
            Section title
        </div>
        <p>
            Lorem ipsum
        </p>
    </div>
    <div class="dv-section">
        <div class="dividing title">
            Section title 2
        </div>
        Test
        <p>
            Lorem ipsum 2
        </p>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    
});
</script>

<style lang="less" scoped>
@import "../../less/common/common.less";

.test-page {

}
</style>

