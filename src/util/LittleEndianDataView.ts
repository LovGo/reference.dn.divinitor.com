export default class LittleEndianDataView {

    private _dv: DataView;

    constructor(dv: DataView) {
        this._dv = dv;
    }

    getFloat32(byteOffset: number, littleEndian?: boolean | undefined): number {
        return this._dv.getFloat32(byteOffset, littleEndian === undefined ? true : littleEndian);
    }
    getFloat64(byteOffset: number, littleEndian?: boolean | undefined): number {
        return this._dv.getFloat64(byteOffset, littleEndian === undefined ? true : littleEndian);
    }
    getInt8(byteOffset: number): number {
        return this._dv.getInt8(byteOffset);
    }
    getInt16(byteOffset: number, littleEndian?: boolean | undefined): number {
        return this._dv.getInt16(byteOffset, littleEndian === undefined ? true : littleEndian);
    }
    getInt32(byteOffset: number, littleEndian?: boolean | undefined): number {
        return this._dv.getInt32(byteOffset, littleEndian === undefined ? true : littleEndian);
    }
    getUint8(byteOffset: number): number {
        return this._dv.getUint8(byteOffset);
    }
    getUint16(byteOffset: number, littleEndian?: boolean | undefined): number {
        return this._dv.getUint16(byteOffset, littleEndian === undefined ? true : littleEndian);
    }
    getUint32(byteOffset: number, littleEndian?: boolean | undefined): number {
        return this._dv.getUint32(byteOffset, littleEndian === undefined ? true : littleEndian);
    }
    setFloat32(byteOffset: number, value: number, littleEndian?: boolean | undefined): void {
        this._dv.setFloat32(byteOffset, value, littleEndian === undefined ? true : littleEndian);
    }
    setFloat64(byteOffset: number, value: number, littleEndian?: boolean | undefined): void {
        this._dv.setFloat64(byteOffset, value, littleEndian === undefined ? true : littleEndian);
    }
    setInt8(byteOffset: number, value: number): void {
        this._dv.setInt8(byteOffset, value);
    }
    setInt16(byteOffset: number, value: number, littleEndian?: boolean | undefined): void {
        this._dv.setInt16(byteOffset, value, littleEndian === undefined ? true : littleEndian);
    }
    setInt32(byteOffset: number, value: number, littleEndian?: boolean | undefined): void {
        this._dv.setInt32(byteOffset, value, littleEndian === undefined ? true : littleEndian);
    }
    setUint8(byteOffset: number, value: number): void {
        this._dv.setUint8(byteOffset, value);
    }
    setUint16(byteOffset: number, value: number, littleEndian?: boolean | undefined): void {
        this._dv.setUint16(byteOffset, value, littleEndian === undefined ? true : littleEndian);
    }
    setUint32(byteOffset: number, value: number, littleEndian?: boolean | undefined): void {
        this._dv.setUint32(byteOffset, value, littleEndian === undefined ? true : littleEndian);
    }
    [Symbol.toStringTag]: string;
}
