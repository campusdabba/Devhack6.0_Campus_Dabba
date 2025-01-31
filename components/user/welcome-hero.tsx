"use client"

import { Canvas } from "@react-three/fiber"
import {
  Environment,
  Float,
  Text3D,
  Center,
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls,
} from "@react-three/drei"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export function WelcomeHero() {
  return (
    <Card className="relative overflow-hidden">
      <div className="grid md:grid-cols-2 gap-6 p-6">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold tracking-tight">
              Homemade Goodness,
              <br />
              <span className="text-primary">Delivered to Campus</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Connect with local families and enjoy delicious home-cooked meals. Support your community while satisfying
            your cravings.
          </motion.p>
        </div>
        <div className="h-[300px]">
          <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
            <Environment preset="city" />
            <Float speed={4} rotationIntensity={1} floatIntensity={2}>
              <Center>
                <Text3D font="/fonts/Inter_Bold.json" size={1.5} height={0.2} curveSegments={12}>
                  {"Dabba"}
                  <meshStandardMaterial color="#7C3AED" />
                </Text3D>
              </Center>
            </Float>
            <AccumulativeShadows temporal frames={60} alphaTest={0.85} scale={10}>
              <RandomizedLight amount={8} radius={5} ambient={0.5} position={[5, 3, 2]} />
            </AccumulativeShadows>
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
      </div>
    </Card>
  )
}

