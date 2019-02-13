import THREE from 'three';

export default interface IThreeInstance<C extends THREE.Camera, R extends THREE.Renderer> {
    scene: THREE.Scene;
    camera: C;
    renderer: R;
};
