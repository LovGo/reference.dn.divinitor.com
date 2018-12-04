const ranks = [
    "",
    "Recruit",
    "Recruit",
    "Grunt",
    "Private",
    "Scout",
    "Corporal",
    "Sergeant",
    "Gladiator",
    "Mercenary",
    "Lanista",
    "Legionnaire",
    "Knight",
    "Royal Knight",
    "Order Knight",
    "Second Lieutenant",
    "First Lieutenant",
    "Captain",
    "High Captain",
    "Centurion",
    "Major",
    "General",
    "Decorated General",
    "Senior General",
    "Warlord",
    "Supreme Warlord",
    "Champion"
];

export default {
    getRankName(rankId) {
        return ranks[rankId];
    }
};
