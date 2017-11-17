export default {
    install: function(Vue, opt) {
        Vue.filter("thousands", this.thousands);
        Vue.filter("gold", this.gold);
        Vue.filter("goldG", this.goldG);
        Vue.filter("dec2hex", this.dec2hex);
        Vue.filter("dec2hexcolor", this.dec2hexcolor);
        Vue.filter("enhancePercent", this.enhancePercent);
        Vue.filter("ordinal", this.ordinal);
        Vue.filter("zeroDash", this.zeroDash);
        Vue.filter("stat", this.stat);
        Vue.filter("statPercent", this.statPercent);
    },

    thousands: function(value) {
        if (value == null) {
            return value;
        }
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
    goldG: function(value) {
        let amt = value;
        let gold = Math.floor((amt * 100 / 10000)) / 100;
        if (gold > 100) {
            gold = Math.floor(gold);
            return gold.toLocaleString() + "g";
        }

        return `${gold.toLocaleString(undefined, {
            minimumFractionDigits: 1,
        })}g`;
    },
    dec2hex: function(x) {
        return ("00000000" + x.toString(16)).substr(-8);
    },
    dec2hexcolor: function(x) {
        return ("000000" + x.toString(16)).substr(-6);
    },
    enhancePercent: function(n) {
        let p = n * 100;
        if (p === 0) {
            return "‒";
        }
        if (p < 10) {
            return Math.floor(p * 100) / 100 + "%";
        } else {
            return Math.floor(p) + "%";
        }
    },
    ordinal: function(n) {
        if (n > 20) {
            n = n % 10;
        }

        if (n == 1) {
            return "1st";
        }
        if (n == 2) {
            return "2nd";
        }
        if (n == 3) {
            return "3rd";
        }
        return n + "th";
    },
    zeroDash: function(n) {
        if (n === 0) {
            return "‒";
        }
        
        return n;
    },
    stat(s) {
        return Math.floor(s).toLocaleString();
    },
    statPercent(s) {
        return (s * 100).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + "%";
    }
};
