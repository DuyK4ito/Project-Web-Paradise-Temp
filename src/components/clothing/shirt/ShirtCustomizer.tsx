"use client"

import { CameraNormalizer, MODEL_CONFIGS } from "@/const/cameraUtils"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"

function ShirtModel({ color, model }: { color: string; model: "shirt" | "shirt2" }) {
  const { scene, materials } = useGLTF(`/models/${model}/scene.gltf`)
  const config = MODEL_CONFIGS[model]

  if (materials) {
    Object.values(materials).forEach((mat: any) => {
      if (mat.color) {
        mat.color.set(color)
      }
    })
  }

  return <primitive object={scene} scale={config.scale} position={config.position} />
}

function CameraController({ model }: { model: "shirt" | "shirt2" }) {
  const { camera, controls } = useThree()
  const normalizerRef = useRef<CameraNormalizer | null>(null)

  useEffect(() => {
    if (camera && controls) {
      normalizerRef.current = new CameraNormalizer(camera, controls, 800)
    }
  }, [camera, controls])

  useEffect(() => {
    if (normalizerRef.current) {
      // Chuẩn hóa camera khi chuyển đổi model
      normalizerRef.current.normalizeForModel(model, false)
      normalizerRef.current.updateControlsLimits(model)
    }
  }, [model])

  return <></>
}

function ShirtViewer({ color, model }: { color: string; model: "shirt" | "shirt2" }) {
  const config = MODEL_CONFIGS[model]

  return (
    <Canvas
      camera={{
        position: config.cameraPosition,
        fov: 50,
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <ShirtModel color={color} model={model} />
      <OrbitControls
        ref={(controls) => {
          if (controls && config.cameraTarget) {
            controls.target.set(...config.cameraTarget)
            controls.minDistance = config.minDistance || 2
            controls.maxDistance = config.maxDistance || 8
            controls.update()
          }
        }}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
      />
      <CameraController model={model} />
    </Canvas>
  )
}

function ShirtCustomizer() {
  const [color, setColor] = useState("#ffffff")
  const [model, setModel] = useState<"shirt" | "shirt2">("shirt")

  // Một số màu áo phổ biến
  const presetColors = [
    { code: "#000000", name: "Đen" },
    { code: "#ffffff", name: "Trắng" },
    { code: "#2F4F4F", name: "Xanh Navy" },
    { code: "#8B0000", name: "Đỏ Đô" },
    { code: "#A0522D", name: "Nâu" },
    { code: "#D2B48C", name: "Be" },
    { code: "#808080", name: "Xám" },
    { code: "#f8c6c9", name: "Hồng" },
  ]

  return (
    <div className='flex h-screen'>
      {/* Vùng 3D */}
      <div className='flex-1'>
        <ShirtViewer color={color} model={model} />
      </div>

      {/* Sidebar chỉnh màu + model */}
      <div className='w-80 p-6 bg-gray-100 rounded-l-2xl shadow-lg flex flex-col'>
        <h2 className='text-lg font-bold mb-4'>Vui lòng chọn màu</h2>
        <div className='grid grid-cols-3 gap-4'>
          {presetColors.map((c) => (
            <button
              key={c.code}
              className='flex flex-col items-center'
              onClick={() => setColor(c.code)}
            >
              <div
                className='w-12 h-12 rounded-full border shadow'
                style={{ backgroundColor: c.code }}
              />
              <span className='text-xs mt-1'>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Hiển thị màu đã chọn */}
        <div className='mt-6'>
          <p className='text-sm font-semibold'>Màu đã chọn:</p>
          <div className='flex items-center mt-2'>
            <div
              className='w-6 h-6 rounded-full border mr-2'
              style={{ backgroundColor: color }}
            />
            <span>{presetColors.find((c) => c.code === color)?.name || color}</span>
          </div>
        </div>

        {/* Chọn model */}
        <div className='mt-6'>
          <p className='text-sm font-semibold'>Chọn kiểu áo:</p>
          <div className='flex gap-2 mt-2'>
            <button
              className={`px-3 py-2 rounded-lg border font-medium transition-all duration-200 ${
                model === "shirt"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setModel("shirt")}
            >
              Shirt 1
            </button>
            <button
              className={`px-3 py-2 rounded-lg border font-medium transition-all duration-200 ${
                model === "shirt2"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setModel("shirt2")}
            >
              Shirt 2
            </button>
          </div>
        </div>

        <button
          className='mt-6 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors duration-200'
          onClick={() => {
            setColor("#ffffff") //reset màu
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default ShirtCustomizer
