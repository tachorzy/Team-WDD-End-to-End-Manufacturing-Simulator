import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const Model: React.FC<{ modelUrl: string }> = ({ modelUrl }) => {
    const gltf = useLoader(GLTFLoader, modelUrl);
    const modelRef = useRef<THREE.Group>(null);

    useEffect(() => {
        if (modelRef.current) {
            const bbox = new THREE.Box3().setFromObject(modelRef.current);
            const center = new THREE.Vector3();
            bbox.getCenter(center);
            modelRef.current.position.x -= center.x;
            modelRef.current.position.y -= center.y;
            modelRef.current.position.z -= center.z;
        }
    }, [modelUrl]);

    return <primitive object={gltf.scene} ref={modelRef} scale={0.5} />;
};

const ModelViewer: React.FC<{ file: File }> = ({ file }) => {
    const fileURL = URL.createObjectURL(file);
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(0, 0, 20); 
        camera.updateProjectionMatrix();
       
    }, []);

    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            style={{ width: "100%", height: "100%" }}
            gl={{ alpha: false, antialias: true }}
            camera={{ position: [0, 0, 20], fov: 50 }}
            onCreated={({ gl }) => {
                gl.setClearColor(new THREE.Color('#494949'));
            }}
        >
            <ambientLight intensity={0.3} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <Suspense fallback={null}>
                <Model modelUrl={fileURL} />
                <OrbitControls enableZoom={true} />
            </Suspense>
        </Canvas>
    );
};

export default ModelViewer;
