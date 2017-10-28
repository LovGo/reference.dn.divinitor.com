
function linearEvaluator(rawStat, level, capInfo) 
{
    if (level < 1 || level > 100)
    {
        return -1;
    }
    let levelCap = capInfo.rawCapValues[level - 1];
    let ret = {
        result: rawStat / levelCap,
        capped: false
    };
    if (ret.result >= capInfo.maximum)
    {
        ret.result = capInfo.maximum;
        ret.capped = true;
    }
    return ret;
}

function linearInvEvaluator(percent, level, capInfo) 
{
    if (level < 1 || level > 100)
    {
        return -1;
    }
    let levelCap = capInfo.rawCapValues[level - 1];
    let val = levelCap * percent;
    
    let ret = {
        result: val,
    };
    return ret;
}

function fdEvaluator(rawStat, level, capInfo)
{
    let lin = linearEvaluator(rawStat, level, capInfo);
    if (lin === -1)
    {
        return -1;
    }
    let ret = {
        result: 0,
        capped: false
    };
    if (lin.result < 0.417)
    {
        ret.result = lin.result * 0.35;
    }
    else
    {
        ret.result = Math.pow(lin.result, 2.2);
    }
    if (ret.result >= capInfo.maximum)
    {
        ret.result = capInfo.maximum;
        ret.capped = true;
    }
    return ret;
}

function fdInvEvaluator(percent, level, capInfo)
{
    if (level < 1 || level > 100)
    {
        return -1;
    }
    let levelCap = capInfo.rawCapValues[level - 1];
    let fd = 0;
    if (percent < 0.146) {
        fd = 2.857142857 * percent * levelCap;
    } else {
        fd = levelCap * Math.pow(percent, 0.45454545454545454545);
    }

    let ret = {
        result: fd,
    };
    return ret;
}

const StatCalcTables = {
    crit: 
    {
        maximum: 0.89,
        rawToPercentEvaluator: linearEvaluator,
        percentToRawEvaluator: linearInvEvaluator,
        rawCapValues: 
        [
            1000.0, 1160.0, 1320.0, 1480.0, 1640.0, 1800.0, 1960.0, 2120.0,
            2280.0, 2440.0, 2600.0, 2760.0, 2920.0, 3080.0, 3800.0, 4000.0,
            4200.0, 4400.0, 4600.0, 4800.0, 5000.0, 5200.0, 5400.0, 5600.0,
            5900.0, 6200.0, 6500.0, 6800.0, 7100.0, 7400.0, 7700.0, 8000.0,
            8400.0, 8800.0, 9200.0, 9600.0, 10000.0, 10400.0, 10800.0, 11200.0,
            12000.0, 12800.0, 13600.0, 14400.0, 15300.0, 16200.0, 17100.0,
            18000.0, 19000.0, 20000.0, 21500.0, 23000.0, 24600.0, 26200.0,
            27900.0, 29600.0, 31400.0, 33200.0, 35200.0, 37200.0, 40200.0,
            43200.0, 46200.0, 49200.0, 52400.0, 55600.0, 58800.0, 62000.0,
            65400.0, 68800.0, 74745.0, 80619.0, 86438.0, 92373.0, 98284.0,
            104245.0, 110176.0, 116008.0, 121899.0, 127685.0, 138684.0, 149565.0,
            160545.0, 171433.0, 182263.0, 192994.0, 203931.0, 214891.0, 225855.0,
            236880.0, 277830.0, 321300.0, 367290.0, 794640.0, 937755.0, 1599360.0,
            1867320.0, 2150400.0, 2448600.0, 2704380.0
        ]
    },
    critdmg:
    {
        maximum: 1.0,
        rawToPercentEvaluator: linearEvaluator,
        percentToRawEvaluator: linearInvEvaluator,
        rawCapValues:
        [
            2650.0, 3074.0, 3498.0, 3922.0, 4346.0, 4770.0, 5194.0, 5618.0,
            6042.0, 6466.0, 6890.0, 7314.0, 7738.0, 8162.0, 10070.0, 10600.0,
            11130.0, 11660.0, 12190.0, 12720.0, 13250.0, 13780.0, 14310.0,
            14840.0, 15635.0, 16430.0, 17225.0, 18020.0, 18815.0, 19610.0,
            20405.0, 21200.0, 22260.0, 23320.0, 24380.0, 25440.0, 26500.0,
            27560.0, 28620.0, 29680.0, 31641.0, 33575.0, 35510.0, 37206.0,
            39326.0, 41419.0, 43513.0, 45553.0, 47832.0, 50350.0, 55650.0,
            59757.0, 64580.0, 69589.0, 74756.0, 80109.0, 86310.0, 93121.0,
            99375.0, 103350.0, 107987.0, 113950.0, 121237.0, 129850.0, 139787.0,
            151050.0, 163637.0, 177894.0, 193794.0, 211337.0, 228555.0, 245520.0,
            262220.0, 278587.0, 296902.0, 320100.0, 343263.0, 374976.0, 407979.0,
            431970.0, 453390.0, 474810.0, 496230.0, 517650.0, 542640.0, 567630.0,
            592620.0, 617610.0, 642600.0, 671160.0, 769692.0, 801108.0, 832524.0,
            1021020.0, 1348924.0, 1486905.0, 1631311.0, 1782144.0, 1986705.0, 2249814.0
        ]
    },
    def:
    {
        maximum: 0.85,
        rawToPercentEvaluator: linearEvaluator,
        percentToRawEvaluator: linearInvEvaluator,
        rawCapValues:
        [
            750.0, 870.0, 990.0, 1110.0, 1230.0, 1350.0, 1470.0, 1590.0, 
            1710.0, 1830.0, 1950.0, 2070.0, 2190.0, 2310.0, 2850.0, 3000.0, 
            3150.0, 3300.0, 3450.0, 3600.0, 3750.0, 3900.0, 4050.0, 4200.0, 
            4425.0, 4650.0, 4875.0, 5100.0, 5325.0, 5550.0, 5775.0, 6000.0, 
            6300.0, 6600.0, 6900.0, 7200.0, 7500.0, 7800.0, 8100.0, 8400.0, 
            9000.0, 9600.0, 10200.0, 10800.0, 11475.0, 12150.0, 12825.0, 
            13500.0, 14250.0, 15000.0, 15750.0, 16912.0, 18277.0, 19695.0, 
            21157.0, 22672.0, 24427.0, 26355.0, 28125.0, 29250.0, 30868.0, 
            33056.0, 35685.0, 38771.0, 42331.0, 46383.0, 50943.0, 56137.0, 
            61977.0, 68186.0, 72523.0, 76637.0, 80534.0, 84201.0, 88328.0, 
            92188.0, 95006.0, 99837.0, 104590.0, 106722.0, 112014.0, 
            117306.0, 122598.0, 127890.0, 134064.0, 140238.0, 146412.0, 
            152586.0, 158760.0, 165816.0, 187278.0, 209916.0, 233730.0, 
            258720.0, 286135.0, 314874.0, 344935.0, 376320.0, 409027.0, 
            443058.0
        ]
    },
    fd:
    {
        maximum: 1.0,
        rawToPercentEvaluator: fdEvaluator,
        percentToRawEvaluator: fdInvEvaluator,
        rawCapValues:
        [
            75.0, 87.0, 99.0, 111.0, 123.0, 135.0, 147.0, 159.0, 171.0, 183.0,
            195.0, 207.0, 219.0, 231.0, 285.0, 300.0, 315.0, 330.0, 345.0,
            360.0, 375.0, 390.0, 405.0, 420.0, 442.0, 465.0, 487.0, 510.0,
            532.0, 555.0, 577.0, 600.0, 630.0, 660.0, 690.0, 720.0, 750.0,
            780.0, 810.0, 850.0, 894.0, 938.0, 982.0, 1026.0, 1070.0, 1114.0,
            1158.0, 1202.0, 1246.0, 1290.0, 1346.0, 1402.0, 1458.0, 1514.0,
            1570.0, 1626.0, 1682.0, 1738.0, 1794.0, 1850.0, 1962.0, 2074.0,
            2187.0, 2299.0, 2412.0, 2524.0, 2636.0, 2749.0, 2861.0, 2974.0,
            3128.0, 3283.0, 3437.0, 3592.0, 3747.0, 3901.0, 4056.0, 4210.0,
            4365.0, 4520.0, 4704.0, 4889.0, 5074.0, 5258.0, 5443.0, 5628.0,
            5812.0, 5997.0, 6182.0, 6367.0, 7022.0, 7678.0, 8333.0, 11689.0,
            14944.0, 17461.0, 19977.0, 22494.0, 25010.0, 27527.0
        ]
    }
};

const Constraints = {
    crit: {
        minPercent: 0,
        maxPercent: 89,
        minStat: 0,
        maxStat: 9999999
    },
    critdmg: {
        minPercent: 200,
        maxPercent: 300,
        minStat: 0,
        maxStat: 9999999
    },
    def: {
        minPercent: 0,
        maxPercent: 85,
        minStat: 0,
        maxStat: 9999999
    },
    fd: {
        minPercent: 0,
        maxPercent: 100,
        minStat: 0,
        maxStat: 99999
    }
};

export default {
    getLimits(stat, level) {
        let ret = Object.assign({}, Constraints[stat]);
        if (level > 0) {
            ret.maxStat = Math.round(this.getValue((ret.maxPercent - ret.minPercent) / 100, level, StatCalcTables[stat]).result);
        }
        return ret;
    },

    getCapValues(stat) {
        return StatCalcTables[stat].rawCapValues;
    },

    getPercent(rawStat, level, capInfo)
    {
        return capInfo.rawToPercentEvaluator(rawStat, level, capInfo);
    },

    getValue(percent, level, capInfo)
    {
        return capInfo.percentToRawEvaluator(percent, level, capInfo);
    },

    getCriticalPercent(rawStat, level)
    {
        return this.getPercent(rawStat, level, StatCalcTables.crit);
    },
    getCriticalValue(percent, level)
    {
        return this.getValue(percent, level, StatCalcTables.crit);
    },

    getCritDamagePercent(rawStat, level)
    {
        return this.getPercent(rawStat, level, StatCalcTables.critdmg);
    },
    getCritDamageValue(percent, level)
    {
        percent = percent - 2;
        return this.getValue(percent, level, StatCalcTables.critdmg);
    },

    getDefensePercent(rawStat, level)
    {
        return this.getPercent(rawStat, level, StatCalcTables.def);
    },
    getDefenseValue(percent, level)
    {
        return this.getValue(percent, level, StatCalcTables.def);
    },

    getFinalDamagePercent(rawStat, level)
    {
        return this.getPercent(rawStat, level, StatCalcTables.fd);
    },
    getFinalDamageValue(percent, level)
    {
        return this.getValue(percent, level, StatCalcTables.fd);
    },

    getPercentByName(rawStat, level, stat) {
        return this.getPercent(rawStat, level, StatCalcTables[stat]);
    },
    getValueByName(percent, level, stat) {
        return this.getValue(percent, level, StatCalcTables[stat]);
    }
};
