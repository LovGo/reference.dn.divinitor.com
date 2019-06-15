<template>
<div class="dnts-to-int">
<h1>Convert DNT Schema to TypeScript Interface</h1>

<textarea v-model="inputJson" />
<button @click="convert">Convert</button>
<textarea v-model="result" readonly/>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

interface IData {
    inputJson: string;
    result: string;
}

interface ISchemaEntry {
    name: string;
    type: 'INTEGER'|'DOUBLE'|'FLOAT'|'BOOLEAN'|'TEXT';
}

export default Vue.extend({
    data(): IData {
        return {
            inputJson: '',
            result: '',
        };
    },
    methods: {
        toTsType(type: 'INTEGER'|'DOUBLE'|'FLOAT'|'BOOLEAN'|'TEXT'): string {
            switch (type) {
                case 'INTEGER':
                case 'DOUBLE':
                case 'FLOAT':
                    return 'number';
                case 'BOOLEAN':
                    return 'boolean';
                case 'TEXT': 
                    return 'string';
                default:
                    return 'any';
            }
        },
        convert() {
            const schema = JSON.parse(this.inputJson) as ISchemaEntry[];
            let res = 'export default interface IModel {\n';
            for (const s of schema) {
                res += `    ${s.name}: ${this.toTsType(s.type)};\n`;
            }

            res += '}';
            this.result = res;
        }
    }
})
</script>
