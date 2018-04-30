
import PvPRank from '@/api/pvprank';
import LadderRank from '@/api/ladderrank';

export default {
    install: function(Vue, opt) {
        Vue.filter("thousands", this.thousands);
        Vue.filter("thousandsFloor", this.thousandsFloor);
        Vue.filter("gold", this.gold);
        Vue.filter("goldG", this.goldG);
        Vue.filter("dec2hex", this.dec2hex);
        Vue.filter("dec2hexcolor", this.dec2hexcolor);
        Vue.filter("enhancePercent", this.enhancePercent);
        Vue.filter("ordinal", this.ordinal);
        Vue.filter("zeroDash", this.zeroDash);
        Vue.filter("stat", this.stat);
        Vue.filter("statPercent", this.statPercent);
        Vue.filter("rate", this.rate);
        Vue.filter("pvprank", this.pvpRank);
        Vue.filter("ladderrank", this.ladderRank);
        Vue.filter("fileSize", this.fileSize);
    },

    thousands: function(value, key) {
        if (value == null) {
            return value;
        }
        if (key) {
            value = value[key];
        }

        return value.toLocaleString(undefined, {
            useGrouping: true
        });
    },

    thousandsFloor: function(value, key) {
        if (value == null) {
            return value;
        }
        if (key) {
            value = value[key];
        }
        return value.toLocaleString(undefined, {
            maximumFractionDigits: 0
        });
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

        if (amt <= 100) {
            return `${amt.toLocaleString(undefined, {
                minimumFractionDigits: (Math.floor(amt * 100) / 100 == Math.floor(amt)) ? 0 : 1,
            })}c`;

        }

        if (amt < 10000) {
            amt = amt / 100;
            return `${amt.toLocaleString(undefined, {
                minimumFractionDigits: (Math.floor(amt * 100) / 100 == Math.floor(amt)) ? 0 : 1
            })}s`;
        }

        return `${gold.toLocaleString(undefined, {
            minimumFractionDigits: (Math.floor(amt * 100) / 100 == Math.floor(amt)) ? 0 : 1,
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
    },
    rate(v) {
        let mult = v * 100;
        if (mult > 10) {
            return Math.round(mult);
        }

        if (mult >= 0.1) {
            return Math.round(mult * 10) / 10;
        }

        if (mult >= 0.01) {
            return Math.round(mult * 100) / 100;
        }

        return Math.round(mult * 100000) / 100000;
    },
    pvpRank(v) {
        let rank = Number(v);
        return PvPRank.getRankName(rank);
    },
    ladderRank(v) {
        let rank = Number(v);
        return LadderRank.getRankName(rank);
    },
    fileSize(v) {
        let size = Number(v);
        if (isNaN(size)) {
            return "N/A";
        }

        const KB = 1024;
        const MB = 1024 * KB;
        const GB = 1024 * MB;
        const TB = 1024 * GB;

        if (size < KB) {
            return size + " bytes";
        }
        if (size < MB) {
            return ((size / KB).toLocaleString(undefined, {
                maximumFractionDigits: 0
            })) + " KB";
        }
        if (size < GB / 2 * 3) {
            const sizeMb = size / MB;
            if (sizeMb < 10) {
                return (sizeMb.toLocaleString(undefined, {
                    maximumFractionDigits: 1
                })) + " MB"
            }
            return (sizeMb.toLocaleString(undefined, {
                maximumFractionDigits: 0
            })) + " MB"
        }
        if (size < TB / 2 * 3) {
            const sizeGb = size / GB;
            if (sizeGb < 10) {
                return (sizeGb.toLocaleString(undefined, {
                    maximumFractionDigits: 1
                })) + " GB"
            }
            return (sizeGb.toLocaleString(undefined, {
                maximumFractionDigits: 0
            })) + " GB"
        }
        const sizeTb = size / TB;
        return (sizeTb.toLocaleString(undefined, {
            maximumFractionDigits: 1
        })) + " TB"
    }
};
