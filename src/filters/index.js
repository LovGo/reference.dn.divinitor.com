export default {
    install: function(Vue, opt) {
        Vue.filter("thousands", this.thousands);
        Vue.filter("gold", this.gold);
    },

    thousands: function(value) {
        return value.toLocaleString();
    },

    gold: function(value) {
        let amt = value;
        let copper = amt % 100;
        let silver = Math.floor(amt / 100) % 100;
        let gold = Math.floor((amt / 10000));
        let ret = [];
        if (copper > 0) {
            ret.push(`${copper} copper`);
        }
        if (silver > 0) {
            ret.push(`${silver} silver`);
        }
        if (gold > 0) {
            ret.push(`${gold.toLocaleString()} gold`);
        }

        return ret.reverse().join(" ");
    }
};
