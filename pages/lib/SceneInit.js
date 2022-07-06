import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

export default class SceneInit {
    constructor(canvasID) {
        this.canvasID = canvasID;
    }

    initScene() {
        this.camera = new THREE.PerspectiveCamera(
            36,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.camera.position.z = 196;

        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();

        this.uniforms = {
            u_time: { type: "f", value: 1.0 },
            colorB: { type: "vec3", value: new THREE.Color(0xfff000) },
            colorA: { type: "vec3", value: new THREE.Color(0xffffff) },
        };

        // get canvas created in HTML
        const canvas = document.getElementById(this.canvasID);
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        // ambient light which is for the whole scene
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        ambientLight.castShadow = false;
        this.scene.add(ambientLight);

        // spot light which is illuminating the chart directly
        let spotLight = new THREE.SpotLight(0xffffff, 0.55);
        spotLight.castShadow = true;
        spotLight.position.set(0, 80, 10);
        this.scene.add(spotLight);

        // if window resizes
        window.addEventListener("resize", () => this.onWindowResize(), false);
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.stats.update();
        this.controls.update();
    }

    render() {
        this.uniforms.u_time.value += this.clock.getDelta();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}