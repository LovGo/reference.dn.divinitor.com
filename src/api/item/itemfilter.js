export default {
    shouldRender(filter, item) {
        //  Check grade
        let grade = item.rank.toLowerCase();
        if (!filter.grades[grade]) {
            return false;
        }
        //  Check level
        let level = item.level;
        if (level < filter.minLevel || level > filter.maxLevel) {
            return false;
        }

        return true;
    },
    defaultFilter() {
        return {
            minLevel: 0,
            maxLevel: 100,
            nameSearch: "",
            selectClass: "",
            grades: {
                normal: true,
                magic: true,
                rare: true,
                epic: true,
                unique: true,
                legendary: true,
                divine: true
            }
        };
    }
}