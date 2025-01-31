"use client"

import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, Float, Text3D, Center } from "@react-three/drei"

function Scene() {
  return (
    <>
      <Environment preset="city" />
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <Center>
          <Text3D font="/fonts/Inter_Bold.json" size={0.5} height={0.2} curveSegments={12}>
            {`Campus\nDabba`}
            <meshStandardMaterial color="#7C3AED" />
          </Text3D>
        </Center>
      </Float>
    </>
  )
}

export default function Scene3D() {
  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Scene />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}

