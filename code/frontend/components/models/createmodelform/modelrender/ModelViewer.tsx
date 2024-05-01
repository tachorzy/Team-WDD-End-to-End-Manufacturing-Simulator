/* eslint-disable react/no-unknown-property */

import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

interface ModelProps {
    modelUrl: string;
}

interface GLTFResult extends THREE.GLTF {
    scene: THREE.Scene;
}

const Model: React.FC<ModelProps> = ({ modelUrl }) => {
    const gltf = useLoader<GLTFResult, string>(
        GLTFLoader,
        modelUrl,
    ) as GLTFResult;
    return <primitive object={gltf.scene} scale={[0.5, 0.5, 0.5]} />;
};

interface ModelViewerProps {
    file: File;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ file }) => {
    const fileURL = URL.createObjectURL(file);

    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0, 30], fov: 50 }}
            style={{ width: "200px", height: "200px", marginLeft: "-10px" }}
            gl={{ alpha: false, antialias: true }}
            onCreated={({ gl, camera }) => {
                gl.setClearColor(new THREE.Color("#ffffff"));
                camera.lookAt(new THREE.Vector3(0, 0, 0));
            }}
        >
            <ambientLight intensity={0.5} />

            <spotLight
                position={[10, 10, 10]}
                angle={0.3}
                penumbra={1}
                intensity={2}
                castShadow
            />

            <Model modelUrl={fileURL} />
            <OrbitControls />
        </Canvas>
    );
};
/* eslint-enable react/no-unknown-property */
export default ModelViewer;
