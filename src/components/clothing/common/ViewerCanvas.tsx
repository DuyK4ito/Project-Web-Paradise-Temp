"use client"

import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import ShirtViewer from "../shirt/ShirtViewer"

export default function ViewerCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ShirtViewer />
      <OrbitControls enablePan={false} />
      <Environment preset='studio' />
    </Canvas>
  )
}
