// import { useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, ContactShadows, useGLTF, Center } from "@react-three/drei";

// const Model = ({ url, height }) => {
//   const { scene } = useGLTF(url);
//   return <primitive object={scene} position={[0, height, 0]} />;
// };

// const ModelViewer = ({ modelUrl }) => {
  
//   const [lightIntensity, setLightIntensity] = useState(1.2);
//   const [fov, setFov] = useState(50);
//   const [autoRotate, setAutoRotate] = useState(false);
//   const [modelHeight, setModelHeight] = useState(0);

//   return (
//     <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg overflow-hidden flex flex-col">
//       {/* Canvas */}
//       <div className="flex-1">
//         <Canvas shadows camera={{ position: [0, 1.5, 5], fov }}>
        
//           <ambientLight intensity={0.8} />
//           <directionalLight
//             position={[3, 5, 2]}
//             intensity={lightIntensity}
//             castShadow
//             shadow-mapSize-width={1024}
//             shadow-mapSize-height={1024}
//           />

        
//           <Center>
//             <Model url={modelUrl} height={modelHeight} />
//           </Center>

         
//           <ContactShadows
//             position={[0, 0, 0]}
//             opacity={0.4}
//             scale={10}
//             blur={2.5}
//             far={4.5}
//           />

       
//           <OrbitControls
//             enablePan={false}
//             maxPolarAngle={Math.PI}
//             minPolarAngle={0}
//             autoRotate={autoRotate}
//             autoRotateSpeed={1.5}
//           />
//         </Canvas>
//       </div>

    
//       <div className="p-4 bg-gray-900 text-white text-sm space-y-4">
      
//         <div className="flex items-center justify-between">
//           <span className="font-medium">Auto Rotate</span>
//           <button
//             onClick={() => setAutoRotate((prev) => !prev)}
//             className={`px-4 py-1 rounded-lg transition duration-200 ${
//               autoRotate
//                 ? "bg-emerald-500 hover:bg-emerald-600"
//                 : "bg-gray-600 hover:bg-gray-700"
//             }`}
//           >
//             {autoRotate ? "ON" : "OFF"}
//           </button>
//         </div>

      
//         <div className="flex items-center justify-between gap-4">
//           <label htmlFor="light" className="whitespace-nowrap">
//             Light Intensity
//           </label>
//           <input
//             id="light"
//             type="range"
//             min="0"
//             max="4"
//             step="0.1"
//             value={lightIntensity}
//             onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
//             className="w-full accent-blue-500"
//           />
//           <span className="w-10 text-right">{lightIntensity.toFixed(1)}</span>
//         </div>

     
//         <div className="flex items-center justify-between gap-4">
//           <label htmlFor="fov" className="whitespace-nowrap">
//             FOV
//           </label>
//           <input
//             id="fov"
//             type="range"
//             min="20"
//             max="100"
//             step="1"
//             value={fov}
//             onChange={(e) => setFov(parseInt(e.target.value))}
//             className="w-full accent-blue-500"
//           />
//           <span className="w-10 text-right">{fov}°</span>
//         </div>

       
//         <div className="flex items-center justify-between gap-4">
//           <label htmlFor="height" className="whitespace-nowrap">
//             Model Height
//           </label>
//           <input
//             id="height"
//             type="range"
//             min={-10}
//             max={10}
//             step={0.1}
//             value={modelHeight}
//             onChange={(e) => setModelHeight(parseFloat(e.target.value))}
//             className="w-full accent-blue-500"
//           />
//           <span className="w-12 text-right">{modelHeight.toFixed(1)}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModelViewer;
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useGLTF, Center } from "@react-three/drei";

const Model = ({ url, height, scale }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={[0, height, 0]} scale={scale} />;
};

const ModelViewer = ({ modelUrl }) => {
  const [lightIntensity, setLightIntensity] = useState(1.2);
  const [autoRotate, setAutoRotate] = useState(false);
  const [modelHeight, setModelHeight] = useState(0);
  const [modelScale, setModelScale] = useState(1);

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg overflow-hidden flex flex-col">
      {/* Canvas */}
      <div className="flex-1">
        <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[3, 5, 2]}
            intensity={lightIntensity}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          <Center>
            <Model url={modelUrl} height={modelHeight} scale={modelScale} />
          </Center>

          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4.5}
          />

          <OrbitControls
            enablePan={false}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
            autoRotate={autoRotate}
            autoRotateSpeed={1.5}
          />
        </Canvas>
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-900 text-white text-sm space-y-4">
        {/* Auto Rotate */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Auto Rotate</span>
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`px-4 py-1 rounded-lg transition duration-200 ${
              autoRotate
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {autoRotate ? "ON" : "OFF"}
          </button>
        </div>

   
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="light" className="whitespace-nowrap">
            Light Intensity
          </label>
          <input
            id="light"
            type="range"
            min="0"
            max="4"
            step="0.1"
            value={lightIntensity}
            onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
          <span className="w-10 text-right">{lightIntensity.toFixed(1)}</span>
        </div>

    
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="height" className="whitespace-nowrap">
            Model Height
          </label>
          <input
            id="height"
            type="range"
            min={-10}
            max={10}
            step={0.1}
            value={modelHeight}
            onChange={(e) => setModelHeight(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
          <span className="w-12 text-right">{modelHeight.toFixed(1)}</span>
        </div>

      
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="scale" className="whitespace-nowrap">
            Model Scale
          </label>
          <input
            id="scale"
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={modelScale}
            onChange={(e) => setModelScale(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
          <span className="w-12 text-right">{modelScale.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;
