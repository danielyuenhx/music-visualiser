import { useEffect, useState } from "react";
import * as THREE from "three";
import SceneInit from "./lib/SceneInit";

export default function Home() {  
    let sceneInit, audioContext, audioElement, dataArray, analyser, source;

    useEffect(() => {
        sceneInit = new SceneInit("myThreeJsCanvas");
        sceneInit.initScene();
        sceneInit.animate();
      
        // create plane geometry and add to scene
        const planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(64, 64, 64, 64), 
            new THREE.MeshNormalMaterial({ wireframe: true })
        );

        planeMesh.rotation.x = -Math.PI / 2 + Math.PI / 4;
        planeMesh.scale.x = 2;
        planeMesh.scale.y = 2;
        planeMesh.scale.z = 2;
        planeMesh.position.y = 8;

        sceneInit.scene.add(planeMesh);
    }, []);

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

        const render = () => {
            // update array with music data every time new frame is rendered
            analyser.getByteFrequencyData(dataArray);
    
            requestAnimationFrame(render);
            console.log(dataArray)
        }
    
        render();
    }

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