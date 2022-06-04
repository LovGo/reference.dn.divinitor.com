
export type IDntSchema = IDntColumnSchema[];

export default interface IDntColumnSchema {
    name: string;
    dataType: DntSchemaDataType;
}

export type DntSchemaDataType = 'INTEGER'|'FLOAT'|'DOUBLE'|'TEXT'|'BOOLEAN';
