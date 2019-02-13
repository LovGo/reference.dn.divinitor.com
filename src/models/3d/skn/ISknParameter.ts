export enum SknParameterType {
    FLOAT = "FLOAT",
    INT = "INT",
    VEC4F ="VEC4F",
    STRING = "STRING",
};

export enum SknParameterName {
    DIFFUSE_TEX = "g_DiffuseTex",
    MASK_TEX = "g_MaskTex",
    EYE_COLOR = "g_EyeColor",
    SKIN_COLOR = "g_SkinColor",
    TATOO_TEX = "g_TatooTex",
    CUSTOM_COLOR = "g_CustomColor",
    CUSTOM_COLOR2 = "g_CustomColor2",
    LAYER_TEX = "g_LayerTex",
    ROTATION_SPEED = "g_RotationSpeed",
    EMISSIVE_TEX = "g_EmissiveTex",
    EMISSIVE_POWER = "g_EmissivePower"
};

export default interface ISknParameter {
    name: string;
    type: SknParameterType;
}

export interface IFloatSknParameter extends ISknParameter {
    type: SknParameterType.FLOAT;
    floatVal: number;
}

export interface IIntSknParameter extends ISknParameter {
    type: SknParameterType.INT;
    intVal: number;
}

export interface IVec4fSknParameter extends ISknParameter {
    type: SknParameterType.VEC4F;
    vec4Val: number[];
}

export interface IStringSknParameter extends ISknParameter {
    type: SknParameterType.STRING;
    stringVal: string;
}
