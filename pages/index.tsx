import { useEffect, useState } from "react";
import * as THREE from "three";
import SceneInit from "./lib/SceneInit";
import { fragmentShader, vertexShader } from "./lib/Shaders"

export default function Home() {  
    let sceneInit, audioContext, audioElement, dataArray, analyser, source;

    // function adapted from SuboptimalEng/gamedex on Github
    // get audio information from the music player
    const setupAudioContext = () => {
        audioContext = new window.AudioContext();
        analyser = audioContext.createAnalyser();
        
        audioElement = document.getElementById('music');
        source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser)

        analyser.connect(audioContext.destination);
        
        // Fast Fourier Transform size. 
        // higher value, more details in frequency
        // lower value, fewer details in time
        analyser.fftSize = 1024;

        // array of unsigned 8-bit integers to hold frequency bin count
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    const play = async () => {
        if (audioContext == undefined) {
          setupAudioContext();
        }

        const uniforms = {
            u_time: {
              type: "f",
              value: 1.0,
            },
            u_amplitude: {
              type: "f",
              value: 3.0,
            },
            u_data_arr: {
              type: "float[64]",
              value: dataArray,
            },
            // u_black: { type: "vec3", value: new THREE.Color(0x000000) },
            // u_white: { type: "vec3", value: new THREE.Color(0xffffff) },
          };
      
        // create custom plane material using shaders
        // shaders control vertices and colour on plane
        const planeMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms, // data passed into the shaders (dataArray, time)
            vertexShader: vertexShader(),
            // fragmentShader: fragmentShader(),
            wireframe: true
        })
        const normalPlaneMaterial = new THREE.MeshNormalMaterial({wireframe: true})
        // create plane and add to scene
        const planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(64, 64, 64, 64), 
            planeMaterial
        );

        planeMesh.rotation.x = -Math.PI / 2 + Math.PI / 4;
        planeMesh.scale.x = 2;
        planeMesh.scale.y = 2;
        planeMesh.scale.z = 2;
        planeMesh.position.y = 8;

        sceneInit.scene.add(planeMesh);

        const render = (time) => {
            // update array with music data every time new frame is rendered
            analyser.getByteFrequencyData(dataArray);
            uniforms.u_time.value = time;
            uniforms.u_data_arr.value = dataArray;
            
            requestAnimationFrame(render);
        }
        render();
    }

    useEffect(() => {
        sceneInit = new SceneInit("myThreeJsCanvas");
        sceneInit.initScene();
        sceneInit.animate();
    }, []);

    return (
        <div>
            <div className='absolute bottom-2 right-2'>
                <audio
                    id='music'
                    src='./slide.mp3'
                    className='w-80'
                    controls
                    autoPlay
                    onPlay={play}
                />
            </div>
            <canvas id="myThreeJsCanvas"></canvas>
        </div>
    );
}