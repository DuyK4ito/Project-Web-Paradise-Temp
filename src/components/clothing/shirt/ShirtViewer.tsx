"use client"

import { useShirtStore } from "@/store/shirt"
import { useGLTF } from "@react-three/drei"
import { useEffect, useMemo } from "react"
import * as THREE from "three"

type ShirtViewerProps = {
  modelUrl?: string
}

export default function ShirtViewer({
  modelUrl = "/models/shirt/scene.gltf",
}: ShirtViewerProps) {
  const { color, logoDataUrl } = useShirtStore()
  const gltf = useGLTF(modelUrl) as any

  const logoTexture = useMemo(() => {
    if (!logoDataUrl) return null
    const t = new THREE.TextureLoader().load(logoDataUrl)
    t.flipY = false
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [logoDataUrl])

  useEffect(() => {
    if (!gltf?.scene) return

    gltf.scene.traverse((obj: any) => {
      if (!obj.isMesh) return
      const base = obj.material as THREE.MeshStandardMaterial
      if (!base) return

      obj.material = base.clone()
      const mat = obj.material as THREE.MeshStandardMaterial

      if (logoTexture) {
        mat.map = logoTexture
        mat.color.set(0xffffff)
      } else {
        mat.map = null
        mat.color = new THREE.Color(color)
      }

      mat.metalness = 0.1
      mat.roughness = 0.9
      mat.needsUpdate = true
    })
  }, [gltf, color, logoTexture])

  return (
    <group position={[0, -1.2, 0]}>
      <primitive object={gltf.scene} />
    </group>
  )
}

useGLTF.preload("/models/shirt/scene.gltf")
