import ISknEntry from './ISknEntry';

export default interface ISkn {
    magicNumber: string;
    mshName: string;
    version: number;
    entries: ISknEntry[];
}