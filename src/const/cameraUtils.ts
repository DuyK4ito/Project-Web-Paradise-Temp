// const/cameraUtils.ts
import * as THREE from "three"

export interface ModelConfig {
    scale: number
    position: [number, number, number]
    cameraPosition: [number, number, number]
    cameraTarget?: [number, number, number]
    minDistance?: number
    maxDistance?: number
}

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
    shirt: {
        scale: 2.0, // Giảm scale từ 2.2 xuống 2.0
        position: [0, -3.5, 0], // Nâng lên từ -2.6 lên -2.2
        cameraPosition: [0, 0, 4.5],
        cameraTarget: [0, -1.2, 0], // Điều chỉnh target cho phù hợp
        minDistance: 3,
        maxDistance: 10,
    },
    shirt2: {
        scale: 0.2, // Giảm scale từ 1.8 xuống 1.6
        position: [0, -0.6, 0], // Nâng lên từ -2.0 lên -1.8
        cameraPosition: [0, 0, 3],
        cameraTarget: [0, -0.8, 0], // Điều chỉnh target
        minDistance: 3.5,
        maxDistance: 12,
    },
}

export class CameraNormalizer {
    private camera: THREE.Camera
    private controls?: any
    private animationDuration: number

    constructor(camera: THREE.Camera, controls?: any, animationDuration: number = 1000) {
        this.camera = camera
        this.controls = controls
        this.animationDuration = animationDuration
    }

    /**
     * Chuẩn hóa camera cho model cụ thể với animation mượt
     * @param modelType - Loại model (shirt, shirt2, ...)
     * @param immediate - Có chuyển đổi ngay lập tức hay không
     */
    normalizeForModel(modelType: string, immediate: boolean = false): Promise<void> {
        const config = MODEL_CONFIGS[modelType]
        if (!config) {
            console.warn(`No camera config found for model: ${modelType}`)
            return Promise.resolve()
        }

        return this.animateToPosition(
            config.cameraPosition,
            config.cameraTarget || [0, 0, 0],
            immediate,
        )
    }

    /**
     * Animation camera đến vị trí mới
     */
    private animateToPosition(
        targetPosition: [number, number, number],
        targetLookAt: [number, number, number],
        immediate: boolean = false,
    ): Promise<void> {
        return new Promise((resolve) => {
            if (immediate || !this.controls) {
                // Chuyển đổi ngay lập tức
                this.camera.position.set(...targetPosition)
                if (this.controls) {
                    this.controls.target.set(...targetLookAt)
                    this.controls.update()
                }
                resolve()
                return
            }

            // Animation mượt
            const startPosition = this.camera.position.clone()
            const startTarget = this.controls.target.clone()
            const endPosition = new THREE.Vector3(...targetPosition)
            const endTarget = new THREE.Vector3(...targetLookAt)

            const startTime = Date.now()

            const animate = () => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / this.animationDuration, 1)

                // Sử dụng easing function để animation mượt hơn
                const easeProgress = this.easeInOutCubic(progress)

                // Interpolate camera position
                this.camera.position.lerpVectors(startPosition, endPosition, easeProgress)

                // Interpolate controls target
                this.controls.target.lerpVectors(startTarget, endTarget, easeProgress)
                this.controls.update()

                if (progress < 1) {
                    requestAnimationFrame(animate)
                } else {
                    resolve()
                }
            }

            animate()
        })
    }

    /**
     * Cubic easing function cho animation mượt
     */
    private easeInOutCubic(t: number): number {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    /**
     * Fit camera to bounding box của object
     */
    fitCameraToObject(
        object: THREE.Object3D,
        fitRatio: number = 1.2,
        immediate: boolean = false,
    ): Promise<void> {
        const box = new THREE.Box3().setFromObject(object)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())

        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = (this.camera as THREE.PerspectiveCamera).fov * (Math.PI / 180)
        const distance = (maxDim / (2 * Math.tan(fov / 2))) * fitRatio

        const direction = this.camera.position.clone().sub(center).normalize()
        const newPosition = center.clone().add(direction.multiplyScalar(distance))

        return this.animateToPosition(
            [newPosition.x, newPosition.y, newPosition.z],
            [center.x, center.y, center.z],
            immediate,
        )
    }

    /**
     * Reset camera về vị trí mặc định
     */
    resetToDefault(
        modelType: string = "shirt",
        immediate: boolean = false,
    ): Promise<void> {
        return this.normalizeForModel(modelType, immediate)
    }

    /**
     * Cập nhật controls limits dựa trên model config
     */
    updateControlsLimits(modelType: string): void {
        const config = MODEL_CONFIGS[modelType]
        if (!config || !this.controls) return

        if (config.minDistance !== undefined) {
            this.controls.minDistance = config.minDistance
        }
        if (config.maxDistance !== undefined) {
            this.controls.maxDistance = config.maxDistance
        }
        this.controls.update()
    }
}

/**
 * Hook để sử dụng camera normalizer dễ dàng hơn
 */
export const useCameraNormalizer = (
    camera?: THREE.Camera,
    controls?: any,
    animationDuration: number = 1000,
) => {
    if (!camera) return null

    return new CameraNormalizer(camera, controls, animationDuration)
}

/**
 * Utility function để tính toán camera position tối ưu cho object
 */
export const calculateOptimalCameraPosition = (
    object: THREE.Object3D,
    viewAngle: number = 45,
    fitRatio: number = 1.2,
): [number, number, number] => {
    const box = new THREE.Box3().setFromObject(object)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = viewAngle * (Math.PI / 180)
    const distance = (maxDim / (2 * Math.tan(fov / 2))) * fitRatio

    return [center.x, center.y, center.z + distance]
}
