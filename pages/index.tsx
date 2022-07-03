import { useEffect, useState } from "react";
import SceneInit from "./lib/SceneInit";

export default function Home() {  
    let test;

    useEffect(() => {
        test = new SceneInit("myThreeJsCanvas");
        test.initScene();
        test.animate();
      }, []);

    return (
    <div className="flex flex-col items-center justify-center">
      <div className="absolute bottom-2 right-2">
        {/* <audio
          id="myAudio"
          src="./fur_elise.mp3"
          className="w-80"
          controls
          autoPlay
          onPlay={play}
        /> */}
      </div>
      <canvas id="myThreeJsCanvas"></canvas>
    </div>
  );
}