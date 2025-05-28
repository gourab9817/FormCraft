"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  OrbitControls,
  Float,
  Environment,
  PerspectiveCamera,
  Sphere,
  Box,
  Torus,
  MeshDistortMaterial,
  Stars,
} from "@react-three/drei"
import {
  ArrowRight,
  Zap,
  MousePointer,
  Smartphone,
  Layers,
  Sparkles,
  Play,
  ChevronDown,
  Palette,
  Shield,
  Code,
  Wand2,
  Rocket,
  Globe,
  Heart,
  Sun,
  Moon,
} from "lucide-react"
import Link from "next/link"
import { useRef as useThreeRef } from "react"
import type * as THREE from "three"
import { useTheme } from "@/lib/theme-context"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import AuthForm from "@/components/AuthForm"

// Animated 3D Components
function AnimatedSphere({ position, color, scale = 1 }: any) {
  const meshRef = useThreeRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} position={position} scale={scale} args={[1, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.2}
          speed={1.5}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

function AnimatedTorus({ position, color, scale = 1 }: any) {
  const meshRef = useThreeRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
      <Torus ref={meshRef} position={position} scale={scale} args={[1, 0.4, 16, 32]}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Torus>
    </Float>
  )
}

function AnimatedBox({ position, color, scale = 1 }: any) {
  const meshRef = useThreeRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Box ref={meshRef} position={position} scale={scale} args={[1, 1, 1]}>
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </Box>
    </Float>
  )
}

function ParticleField() {
  const pointsRef = useThreeRef<THREE.Points>(null)
  const particleCount = 500

  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#8b5cf6" transparent opacity={0.4} />
    </points>
  )
}

function Scene3D() {
  return (
    <Canvas className="absolute inset-0" style={{ zIndex: 1 }}>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} />
      <Environment preset="night" />
      <ambientLight intensity={0.2} />
      <pointLight position={[15, 15, 15]} intensity={0.8} />
      <pointLight position={[-15, -15, -15]} intensity={0.4} color="#8b5cf6" />

      <Stars radius={150} depth={80} count={3000} factor={3} saturation={0} fade speed={0.5} />

      <ParticleField />

      {/* Positioned further back to avoid overlap */}
      <AnimatedSphere position={[12, 4, -15]} color="#8b5cf6" scale={0.6} />
      <AnimatedSphere position={[-12, -3, -18]} color="#06b6d4" scale={0.5} />
      <AnimatedTorus position={[10, -4, -20]} color="#f59e0b" scale={0.5} />
      <AnimatedTorus position={[-10, 5, -22]} color="#ef4444" scale={0.4} />
      <AnimatedBox position={[8, 6, -25]} color="#10b981" scale={0.4} />
      <AnimatedBox position={[-8, -5, -20]} color="#f43f5e" scale={0.5} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.2}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}

// Theme Toggle Component
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-background/10 backdrop-blur-sm border border-white/20 dark:border-gray-700 hover:bg-background/20 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
    </motion.button>
  )
}

export function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [openAuth, setOpenAuth] = useState(false)

  // Improved parallax transforms with better separation
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -300])
  const midgroundY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -50])

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9])

  const featuresY = useTransform(scrollYProgress, [0.2, 0.8], [100, -100])
  const featuresOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0])

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const smoothY = useSpring(backgroundY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const features = [
    {
      icon: MousePointer,
      title: "Drag & Drop Magic",
      description: "Intuitive visual form builder with magical drag-and-drop functionality",
      color: "from-blue-500 to-cyan-500",
      delay: 0,
    },
    {
      icon: Smartphone,
      title: "Responsive Perfection",
      description: "Forms that look stunning on every device, from mobile to desktop",
      color: "from-green-500 to-emerald-500",
      delay: 0.1,
    },
    {
      icon: Layers,
      title: "Multi-Step Wizardry",
      description: "Create complex multi-step forms with beautiful progress tracking",
      color: "from-purple-500 to-violet-500",
      delay: 0.2,
    },
    {
      icon: Palette,
      title: "Theme Customization",
      description: "Unlimited customization with beautiful themes and color schemes",
      color: "from-pink-500 to-rose-500",
      delay: 0.3,
    },
    {
      icon: Zap,
      title: "Conditional Logic",
      description: "Smart forms that adapt based on user responses in real-time",
      color: "from-yellow-500 to-orange-500",
      delay: 0.4,
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with encryption and compliance standards",
      color: "from-red-500 to-pink-500",
      delay: 0.5,
    },
  ]

  return (
    <div
      ref={containerRef}
      className={`min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      } overflow-hidden`}
    >
      {/* Enhanced Animated Background - Separated layer */}
      <motion.div
        style={{ y: smoothY }}
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <motion.div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            theme === "dark" ? "bg-blue-500/20" : "bg-blue-400/30"
          }`}
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Multiple floating orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-64 h-64 rounded-full blur-3xl ${
              theme === "dark"
                ? i % 2 === 0
                  ? "bg-purple-500/10"
                  : "bg-pink-500/10"
                : i % 2 === 0
                  ? "bg-purple-400/20"
                  : "bg-pink-400/20"
            }`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* 3D Scene - Background layer */}
      <motion.div style={{ y: backgroundY }} className="fixed inset-0" style={{ zIndex: 1 }}>
        <Scene3D />
      </motion.div>

      {/* Content layer - Foreground */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* Enhanced Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 md:w-6 h-4 md:h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50 animate-pulse" />
              </motion.div>
              <span
                className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                  theme === "dark" ? "from-white to-blue-200" : "from-gray-900 to-blue-600"
                } bg-clip-text text-transparent`}
              >
                FormCraft
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {["Features", "Demo"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`${
                    theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  } transition-colors relative group`}
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {item}
                  <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              <Dialog open={openAuth} onOpenChange={setOpenAuth}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className={`${
                        theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"
                      } backdrop-blur-sm text-sm md:text-base`}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent>
                  <AuthForm />
                </DialogContent>
              </Dialog>
              <Link href="/builder">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg backdrop-blur-sm text-sm md:text-base px-3 md:px-4">
                    <Rocket className="w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Start</span>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Enhanced Hero Section */}
        <motion.section
          style={{ y: foregroundY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 pt-10 md:pt-20 pb-20 md:pb-40 px-4 md:px-6"
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Badge
                  className={`mb-6 md:mb-8 bg-gradient-to-r ${
                    theme === "dark"
                      ? "from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30"
                      : "from-blue-100 to-purple-100 text-blue-700 border-blue-300"
                  } backdrop-blur-sm text-sm md:text-lg px-4 md:px-6 py-2`}
                >
                  <Wand2 className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                  AI-Powered Form Generation
                </Badge>
              </motion.div>

              <motion.h1
                className={`hero-text text-5xl md:text-7xl lg:text-9xl font-bold mb-6 md:mb-8 leading-tight ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                } drop-shadow-lg`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{
                  textShadow: theme === "dark" ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(255,255,255,0.8)",
                  fontWeight: 900,
                }}
              >
                Build Forms
                <motion.span
                  className="block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                  style={{
                    backgroundSize: "200% 200%",
                    fontWeight: 900,
                    filter: "drop-shadow(0 2px 10px rgba(59, 130, 246, 0.3))",
                  }}
                >
                  Magically
                </motion.span>
              </motion.h1>

              <motion.p
                className={`hero-subtitle text-lg md:text-2xl mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                } font-medium`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                  textShadow: theme === "dark" ? "0 2px 10px rgba(0,0,0,0.3)" : "0 2px 10px rgba(255,255,255,0.5)",
                }}
              >
                Create stunning, responsive forms with our revolutionary drag-and-drop builder.
                <span className="text-blue-500 font-semibold"> No coding required.</span>
                <span className="text-purple-500 font-semibold"> Infinite possibilities.</span>
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Link href="/builder">
                  <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                    <Button
                      size="lg"
                      className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 rounded-2xl shadow-2xl"
                    >
                      <Sparkles className="mr-2 md:mr-3 w-5 md:w-6 h-5 md:h-6" />
                      Start Building Free
                      <ArrowRight className="ml-2 md:ml-3 w-5 md:w-6 h-5 md:h-6" />
                    </Button>
                  </motion.div>
                </Link>

                <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className="relative group">
                  <div
                    className={`absolute inset-0 ${
                      theme === "dark" ? "bg-white/10" : "bg-gray-200/50"
                    } rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity`}
                  />
                  <Button
                    size="lg"
                    variant="outline"
                    className={`relative ${
                      theme === "dark"
                        ? "border-white/30 text-white hover:bg-white/10"
                        : "border-gray-300 text-gray-900 hover:bg-gray-100"
                    } text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 rounded-2xl backdrop-blur-sm`}
                  >
                    <Play className="mr-2 md:mr-3 w-5 md:w-6 h-5 md:h-6" />
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                className="absolute bottom-5 md:bottom-10 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <ChevronDown
                  className={`w-6 md:w-8 h-6 md:h-8 ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Features Section */}
        <motion.section
          id="features"
          style={{ y: featuresY, opacity: featuresOpacity }}
          className={`relative z-10 py-20 md:py-40 ${
            theme === "dark"
              ? "bg-gradient-to-r from-white/5 to-blue-500/5"
              : "bg-gradient-to-r from-blue-50/80 to-purple-50/80"
          } backdrop-blur-sm`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                className="inline-block mb-4 md:mb-6"
              >
                <Badge
                  className={`${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30"
                      : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300"
                  } text-sm md:text-lg px-4 md:px-6 py-2`}
                >
                  <Code className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                  Powerful Features
                </Badge>
              </motion.div>

              <h2
                className={`section-title text-4xl md:text-6xl font-bold mb-6 md:mb-8 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Everything You Need
              </h2>
              <p
                className={`text-lg md:text-2xl max-w-4xl mx-auto ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Professional-grade tools to create, customize, and optimize your forms
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 100, rotateX: -30 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: feature.delay,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    y: -20,
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.3 },
                  }}
                  viewport={{ once: true }}
                  className="group perspective-1000"
                >
                  <Card
                    className={`${
                      theme === "dark"
                        ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/40"
                        : "bg-gradient-to-br from-white/80 to-white/60 border-gray-200 hover:border-gray-300"
                    } backdrop-blur-sm transition-all duration-500 h-full transform-gpu shadow-lg hover:shadow-2xl`}
                  >
                    <CardContent className="p-6 md:p-8 h-full flex flex-col">
                      <motion.div className="mb-4 md:mb-6" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                        <div
                          className={`w-12 md:w-16 h-12 md:h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg relative`}
                        >
                          <feature.icon className="w-6 md:w-8 h-6 md:h-8 text-white" />
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity`}
                          />
                        </div>
                      </motion.div>

                      <h3
                        className={`text-xl md:text-2xl font-semibold mb-3 md:mb-4 ${
                          theme === "dark"
                            ? "text-white group-hover:text-blue-300"
                            : "text-gray-900 group-hover:text-blue-600"
                        } transition-colors`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        } leading-relaxed flex-grow text-sm md:text-base`}
                      >
                        {feature.description}
                      </p>

                      <motion.div
                        className={`mt-4 md:mt-6 flex items-center ${
                          theme === "dark"
                            ? "text-blue-400 group-hover:text-blue-300"
                            : "text-blue-600 group-hover:text-blue-700"
                        } transition-colors`}
                        whileHover={{ x: 10 }}
                      >
                        <span className="text-sm font-medium">Learn more</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Enhanced Interactive Demo Section */}
        <motion.section style={{ y: midgroundY }} className="relative z-10 py-20 md:py-40 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2
                className={`section-title text-4xl md:text-6xl font-bold mb-6 md:mb-8 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                See It In Action
              </h2>
              <p
                className={`text-lg md:text-2xl mb-8 md:mb-12 max-w-3xl mx-auto ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Watch how easy it is to create professional forms in minutes
              </p>

              <motion.div
                className="relative max-w-4xl mx-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`aspect-video ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-gray-900 to-gray-800"
                      : "bg-gradient-to-br from-gray-100 to-gray-200"
                  } rounded-3xl shadow-2xl overflow-hidden border ${
                    theme === "dark" ? "border-white/20" : "border-gray-300"
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                      <div className="relative w-16 md:w-24 h-16 md:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                        <Play className="w-8 md:w-12 h-8 md:h-12 text-white ml-1" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Floating UI Elements */}
                <motion.div
                  className={`absolute -top-2 md:-top-4 -left-2 md:-left-4 ${
                    theme === "dark" ? "bg-white/10" : "bg-white/80"
                  } backdrop-blur-sm rounded-lg p-2 md:p-3 border ${
                    theme === "dark" ? "border-white/20" : "border-gray-200"
                  }`}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <MousePointer className="w-4 md:w-6 h-4 md:h-6 text-blue-400" />
                </motion.div>

                <motion.div
                  className={`absolute -bottom-2 md:-bottom-4 -right-2 md:-right-4 ${
                    theme === "dark" ? "bg-white/10" : "bg-white/80"
                  } backdrop-blur-sm rounded-lg p-2 md:p-3 border ${
                    theme === "dark" ? "border-white/20" : "border-gray-200"
                  }`}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                >
                  <Sparkles className="w-4 md:w-6 h-4 md:h-6 text-purple-400" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced CTA Section */}
        <motion.section style={{ y: foregroundY }} className="relative z-10 py-20 md:py-40 px-4 md:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
                className="inline-block mb-6 md:mb-8"
              >
                <Heart className="w-12 md:w-16 h-12 md:h-16 text-red-400 mx-auto" />
              </motion.div>

              <h2
                className={`text-4xl md:text-6xl font-bold mb-6 md:mb-8 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Ready to Create Magic?
              </h2>
              <p
                className={`text-lg md:text-2xl mb-8 md:mb-12 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                Join thousands of creators building amazing forms every day
              </p>

              <Link href="/builder">
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group inline-block"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />
                  <Button
                    size="lg"
                    className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-xl md:text-2xl px-12 md:px-16 py-6 md:py-8 rounded-3xl shadow-2xl"
                  >
                    <Rocket className="mr-3 md:mr-4 w-6 md:w-8 h-6 md:h-8" />
                    Start Building Now
                    <Sparkles className="ml-3 md:ml-4 w-6 md:w-8 h-6 md:h-8" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Footer */}
        <footer
          className={`relative z-10 border-t ${
            theme === "dark"
              ? "border-white/10 bg-gradient-to-r from-black/20 to-purple-900/20"
              : "border-gray-200 bg-gradient-to-r from-white/80 to-blue-50/80"
          } backdrop-blur-sm py-12 md:py-16`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div className="flex items-center space-x-3 mb-6 md:mb-0" whileHover={{ scale: 1.05 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="relative"
                >
                  <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 md:w-6 h-4 md:h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50" />
                </motion.div>
                <span
                  className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${
                    theme === "dark" ? "from-white to-blue-200" : "from-gray-900 to-blue-600"
                  } bg-clip-text text-transparent`}
                >
                  FormCraft
                </span>
              </motion.div>

              <div className="flex items-center space-x-6 md:space-x-8 mb-4 md:mb-0">
                {["Privacy", "Terms", "Support"].map((item, index) => (
                  <motion.a
                    key={item}
                    href="#"
                    className={`${
                      theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                    } transition-colors text-sm md:text-base`}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>

              <motion.div
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                } flex items-center text-sm md:text-base`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Globe className="w-4 h-4 mr-2" />© 2024 FormCraft. Made with magic.
              </motion.div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
