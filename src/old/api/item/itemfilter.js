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

        if (!this.nameMatch(filter.nameSearch, item.name.name)) {
            return false;
        }

        return true;
    },
    nameMatch(query, itemName) {
        if (!query) {
            return true;
        }

        query = query.toLowerCase();
        itemName = itemName.toLowerCase().replace(/[^a-z0-9]/g, " ");
        let querySplit = query.split(/\s+/g);
        let nameSplit = itemName.split(/\s+/g);

        let offset = 0;
        for (let i = 0; i < querySplit.length; ++i) {
            let q = querySplit[i];
            if (!q) {
                continue;
            }

            let matched = false;
            for (let j = offset; j < nameSplit.length; ++j) {
                let n = nameSplit[j];
                if (!n) {
                    continue;
                }

                if (n.startsWith(q)) {
                    matched = true;
                    offset = j;
                    break;
                }
            }

            if (!matched) {
                return false;
            }
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
                divine: true,
                ancient: true,
            }
        };
    }
}