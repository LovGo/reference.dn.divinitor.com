import { __values } from 'tslib';


export interface Filter {
    name: string;
    filter: Function;
}

const filters = {
    thousands: (v: any, k: any, f?: boolean) => {
        if (v == null) {
            return v;
        }
        if (k !== undefined) {
            v = v[k];
        }

        return (<number>v).toLocaleString(undefined, {
            useGrouping: true,
            maximumFractionDigits: (f ? 0 : undefined),
        });
    },
    thousandsFloor: (v: any, k: any) => {
        return filters.thousands(v, k, true);
    },
    gold: (value: any) => {
        let amt = value;
        if (amt == 0) {
            return "0g";
        }
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
    goldG: (value: any) => {
        let amt = value;
        let gold = Math.floor((amt * 100 / 10000)) / 100;
        if (gold > 100 || amt == 0) {
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
    dec2hex: (x: any) => {
        return ("00000000" + x.toString(16)).substr(-8);
    },
    dec2hexcolor: function(x: any) {
        return ("000000" + x.toString(16)).substr(-6);
    },
    enhancePercent: function(n: any) {
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
    percent: function(n: any) {
        let p = n * 100;
        return p;
    },
    ordinal: function(n: any) {
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
    zeroDash: function(n: any) {
        if (n === 0) {
            return "‒";
        }
        
        return n;
    },
    stat(s: any) {
        return Math.floor(s).toLocaleString();
    },
    statPercent(s: any) {
        return (s * 100).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + "%";
    },
    rate(v: any) {
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
    // pvpRank(v: any) {
    //     let rank = Number(v);
    //     return PvPRank.getRankName(rank);
    // },
    // ladderRank(v: any) {
    //     let rank = Number(v);
    //     return LadderRank.getRankName(rank);
    // },
    fileSize(v: any) {
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
                })) + " MB";
            }
            return (sizeMb.toLocaleString(undefined, {
                maximumFractionDigits: 0
            })) + " MB";
        }
        if (size < TB / 2 * 3) {
            const sizeGb = size / GB;
            if (sizeGb < 10) {
                return (sizeGb.toLocaleString(undefined, {
                    maximumFractionDigits: 1
                })) + " GB";
            }
            return (sizeGb.toLocaleString(undefined, {
                maximumFractionDigits: 0
            })) + " GB";
        }
        const sizeTb = size / TB;
        return (sizeTb.toLocaleString(undefined, {
            maximumFractionDigits: 1
        })) + " TB";
    }
}

export function install(Vue: any, options: any) {
    Object.keys(filters).forEach((k: string) => {
        //@ts-ignore
        Vue.filter(k, filters[k]);
    });
};
