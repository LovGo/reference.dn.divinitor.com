import Vue from 'vue';
import Store from '@/store';
import * as MT from '@/store/mutation-types';

export default {
    updates: [
        {
            "title": "MinervaTax",
            "timestamp": "Mar 13 16:38",
            "body": "Added a tax/fee calculator to the <a href=\"/general/taxes/\">Taxes and Fees page</a>"
        },
        {
            "title": "Mad Skills",
            "timestamp": "Mar 2 09:43",
            "body": "Added support for skill variants on items<br/>Fixed several style issues<br/>Basic skill information on items with skills coming soon™"
        },
        {
            "title": "Loadin Loadin Loadin",
            "timestamp": "Feb 19 00:25",
            "body": "Implemented new loading indicators<br/>Updated EC shop acquisition to filter unobtainables<br/>Added coupons to EC shop prices"
        },
        {
            "title": "Shiny Chrome",
            "timestamp": "Feb 14 15:08",
            "body": "Fix issue with Chrome rendering things as zero-width<br/>Updated NPC sell price prop with new format and Golden Goose tooltip<br/>Identified more shops<br/>Disabled Enhancement Hammer information<br/>Added a UIString Permalink<br/>Started improving Item Search<br/>Added Item Toolkit (for dataminers)"
        },
        {
            "title": "Minerva",
            "timestamp": "Jan 03 00:31",
            "body": "We have a name!<br/>Item sets have been optimized, now only shows items of the same class, and can now be filtered<br/>Tweaked some animations and styles to be prettier<br/>Added new index pages for General and Items"
        },
        {
            "title": "Blacksmith's Craftmanship",
            "timestamp": "Dec 30 00:08",
            "body": "Added crafting acquisition to items<br/>Adjusted some text<br/>Added Golden Goose support to shop acquisition<br/>Item stack tooltips now also list the number of items in the stack"
        },
        {
            "title": "Shopping Spree",
            "timestamp": "Dec 29 10:24",
            "body": "Added shop acquisition to items<br/>Fixed missing contents list for random pouches<br/>Made certain item lists cap out in height"
        },
        {
            "title": "Taxes Sux",
            "timestamp": "Dec 20 23:42",
            "body": "Added the taxes/fees page under General<br/>Reorganized General<br/>Gave other checkboxes the pretty treatment"
        },
        {
            "title": "Activated Carbon Filtration",
            "timestamp": "Dec 17 01:24",
            "body": "Added the ability to filter by name in item lists (e.g. pouch items). Also made the filter panel pretty.<br/>Fixed item set list entries not being links"
        },
        {
            "title": "Ready, Set, Go",
            "timestamp": "Dec 13 19:02 EST",
            "body": "Added the ability to view set bonuses and items in sets<br/>Fixed extremely low rates showing way too many decimal points"
        },
        {
            "title": "In Tune",
            "timestamp": "Nov 29 09:12 EST",
            "body": "Added seeing what an item can be tuned to using what tuner<br/>Reduced emphasis on item ID on item cards<br/>Added hover effects to Material and Stat Grids"
        },
        {
            "title": "Let there be clarity",
            "timestamp": "Nov 26 20:16 EST",
            "body": "Adjusted background to be less icky and more pretty<br/>Some code cleanup in the back<br/>Added note about extraction rates"
        },
        {
            "title": "GomenaSIKE",
            "timestamp": "Nov 25 11:57 EST",
            "body": "Tuners showing weird things wasn't a bug, reverted<br/>Added Stat Grid to Item Enhancement<br/>Point Items now have more information<br/>Blood Phantom items now no longer refuse to load"
        },
        {
            "title": "False Hope",
            "timestamp": "Nov 25 00:30 EST",
            "body": "Fixed charm items (dragon eggs, pouches, etc) displaying items that they no longer can drop"
        },
        {
            "title": "Gridlock",
            "timestamp": "Nov 24 22:38 EST",
            "body": "Added the Material Grid<br/>Reordered Stat calculators<br/>Fixed stat percent rounding resulting in off-by-one results<br/>Added emphasis to Stat More Info's % by Level input<br/>Added Back button to Stat More Info"
        },
        {
            "title": "Burnt Toast",
            "timestamp": "Nov 24 21:49 EST",
            "body": "Added update/changelog toast messages (like this one)"
        },
    ],

    getLatestUpdate() {
        return this.updates[0];
    },
    getNewUpdates(cap) {
        let numUpdatesToReturn = this.updates.length - Store.getters.lastAckedUpdate;
        numUpdatesToReturn = Math.min(cap, numUpdatesToReturn);
        let ret = [];
        for (let i = 0; i < numUpdatesToReturn; ++i) {
            ret.push(this.updates[i]);
        }

        return ret;
    },
    markAsRead() {
        Store.commit(MT.ACK_UPDATE, this.updates.length);
    },
    hasNewUpdate() {
        return Store.getters.lastAckedUpdate < this.updates.length;
    }
}
