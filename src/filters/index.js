export default {
    install: function(Vue, opt) {
        Vue.filter("thousands", this.thousands);
        Vue.filter("gold", this.gold);
        Vue.filter("dec2hex", this.dec2hex);
        Vue.filter("dec2hexcolor", this.dec2hexcolor);
        Vue.filter("enhancePercent", this.enhancePercent);
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
    },
    dec2hex: function(x) {
        return ("00000000" + x.toString(16)).substr(-8);
    },
    dec2hexcolor: function(x) {
        return ("000000" + x.toString(16)).substr(-6);
    },
    enhancePercent: function(n) {
        let p = n * 100;
        if (p < 10) {
            return Math.floor(p * 100) / 100;
        } else {
            return Math.floor(p);
        }
    }
};
