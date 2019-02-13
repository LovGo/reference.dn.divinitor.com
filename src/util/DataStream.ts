import LittleEndianDataView from './LittleEndianDataView';

export default class DataStream {
    private _dv: LittleEndianDataView|DataView;
    public offset: number;

    constructor(dv: LittleEndianDataView|DataView) {
        this._dv = dv;
        this.offset = 0;
    }

    public readUint8(): number {
        const ret = this._dv.getUint8(this.offset);
        ++this.offset;
        return ret;
    }

    public readInt8(): number {
        const ret = this._dv.getInt8(this.offset);
        ++this.offset;
        return ret;
    }

    public readUint16(): number {
        const ret = this._dv.getUint16(this.offset);
        this.offset += 2;
        return ret;
    }

    public readInt16(): number {
        const ret = this._dv.getInt16(this.offset);
        this.offset += 2;
        return ret;
    }

    public readUint32(): number {
        const ret = this._dv.getUint32(this.offset);
        this.offset += 4;
        return ret;
    }

    public readInt32(): number {
        const ret = this._dv.getInt32(this.offset);
        this.offset += 4;
        return ret;
    }

    public readFloat32(): number {
        const ret = this._dv.getFloat32(this.offset);
        this.offset += 4;
        return ret;
    }

    public readFloat64(): number {
        const ret = this._dv.getFloat64(this.offset);
        this.offset += 8;
        return ret;
    }

    public readUint8Array(arr: Uint8Array, offset?: number, length?: number): void {
        if (offset === undefined) {
            offset = 0;
        }
        if (length === undefined) {
            length = arr.byteLength;
        }

        for (let i = offset; i < length; ++i) {
            arr[i] = this.readUint8();
        }
    }

    public readInt8Array(arr: Int8Array, offset?: number, length?: number): void {
        if (offset === undefined) {
            offset = 0;
        }
        if (length === undefined) {
            length = arr.byteLength;
        }

        for (let i = offset; i < length; ++i) {
            arr[i] = this.readInt8();
        }
    }

    public readUint16Array(arr: Uint16Array, offset?: number, length?: number): void {
        if (offset === undefined) {
            offset = 0;
        }
        if (length === undefined) {
            length = arr.byteLength / Uint16Array.BYTES_PER_ELEMENT;
        }

        for (let i = offset; i < length; ++i) {
            arr[i] = this.readUint16();
        }
    }

    public readInt16Array(arr: Int16Array, offset?: number, length?: number): void {
        if (offset === undefined) {
            offset = 0;
        }
        if (length === undefined) {
            length = arr.byteLength / Int16Array.BYTES_PER_ELEMENT;
        }

        for (let i = offset; i < length; ++i) {
            arr[i] = this.readInt16();
        }
    }

    public readUint32Array(arr: Uint32Array, offset?: number, length?: number): void {
        if (offset === undefined) {
            offset = 0;
        }
        if (length === undefined) {
            length = arr.byteLength / Uint32Array.BYTES_PER_ELEMENT;
        }

        for (let i = offset; i < length; ++i) {
            arr[i] = this.readUint32();
        }
    }

    public readInt32Array(arr: Int32Array, offset?: number, length?: number): void {
        if (offset === undefined) {
            offset = 0;
        }
        if (length === undefined) {
            length = arr.byteLength / Int32Array.BYTES_PER_ELEMENT;
        }

        for (let i = offset; i < length; ++i) {
            arr[i] = this.readInt32();
        }
    }

    public readFloat32Array(arr: Float32Array, offset?: number, length?: number): void {
        if (offset === undefined) {
            offset = 0;
        }
        if (length === undefined) {
            length = arr.byteLength / Float32Array.BYTES_PER_ELEMENT;
        }

        for (let i = offset; i < length; ++i) {
            arr[i] = this.readFloat32();
        }
    }

    public readFloat64Array(arr: Float64Array, offset?: number, length?: number): void {
        if (offset === undefined) {
            offset = 0;
        }
        if (length === undefined) {
            length = arr.byteLength / Float64Array.BYTES_PER_ELEMENT;
        }

        for (let i = offset; i < length; ++i) {
            arr[i] = this.readFloat64();
        }
    }

    public readFixedLengthString(length: number): string {
        const dec = new TextDecoder("utf-8");
        const txt = new Uint8Array(length);
        this.readUint8Array(txt);
        // Find first null
        let end = txt.length;
        for (let i = 0; i < txt.length; ++i) {
            if (txt[i] == 0) {
                end = i;
                break;
            }
        }
        return dec.decode(txt.slice(0, end));
    }
}