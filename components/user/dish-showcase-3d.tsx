"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"
import type * as THREE from "three"

function DishModel({ rotation }: { rotation: number }) {
  const { scene } = useGLTF("/models/dish.glb")
  const ref = useRef<THREE.Group>()

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = rotation
    }
  })

  return <primitive object={scene} ref={ref} />
}

export function DishShowcase3D() {
  const [rotation, setRotation] = useState(0)

  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <DishModel rotation={rotation} />
        <OrbitControls enableZoom={false} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}

