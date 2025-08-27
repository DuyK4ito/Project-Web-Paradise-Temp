"use client"

import { CameraNormalizer, MODEL_CONFIGS } from "@/const/cameraUtils"
import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import ShirtViewer from "../shirt/ShirtViewer"

function CameraController({ modelType = "shirt" }: { modelType?: string }) {
  const { camera, controls } = useThree()
  const normalizerRef = useRef<CameraNormalizer | null>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (camera && controls && !isInitialized.current) {
      normalizerRef.current = new CameraNormalizer(camera, controls, 600)

      // Chuẩn hóa camera lần đầu
      normalizerRef.current.normalizeForModel(modelType, true)
      normalizerRef.current.updateControlsLimits(modelType)

      isInitialized.current = true
    }
  }, [camera, controls, modelType])

  return <></>
}

export default function ViewerCanvas({ modelType = "shirt" }: { modelType?: string }) {
  const config = MODEL_CONFIGS[modelType]

  return (
    <Canvas
      camera={{
        position: config.cameraPosition,
        fov: 50,
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ShirtViewer />
      <OrbitControls
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={config.minDistance || 2}
        maxDistance={config.maxDistance || 8}
        target={config.cameraTarget || [0, 0, 0]}
      />
      <Environment preset='studio' />
      <CameraController modelType={modelType} />
    </Canvas>
  )
}
