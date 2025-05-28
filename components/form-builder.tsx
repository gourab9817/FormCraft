"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useFormBuilderStore } from "@/lib/store"
import { FieldPalette } from "./field-palette"
import { FormCanvas } from "./form-canvas"
import { FieldConfigPanel } from "./field-config-panel"
import { FormPreview } from "./form-preview"
import { FormHeader } from "./form-header"
import { MultiStepManager } from "./multi-step-manager"
import { ConditionalLogicManager } from "./conditional-logic-manager"
import { ThemeCustomizer } from "./theme-customizer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Settings,
  Layers,
  Save,
  Share2,
  Palette,
  BarChart3,
  Zap,
  Sparkles,
  Download,
  Globe,
  Sun,
  Moon,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"

export function FormBuilder() {
  const { currentForm, isPreviewOpen, togglePreview, createNewForm, saveForm, generateShareableLink } =
    useFormBuilderStore()
  const { theme, toggleTheme } = useTheme()

  const [activeTab, setActiveTab] = useState("build")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!currentForm) return
    setIsLoading(true)

    // Simulate save delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000))

    saveForm()
    setIsLoading(false)
    toast({
      title: "Form Saved",
      description: "Your form has been saved successfully.",
    })
  }

  const handleShare = () => {
    if (!currentForm) return
    const link = generateShareableLink()
    navigator.clipboard.writeText(link)
    toast({
      title: "Link Copied",
      description: "Shareable link has been copied to clipboard.",
    })
  }

  const handleExport = () => {
    if (!currentForm) return

    const formData = {
      ...currentForm,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentForm.title.replace(/\s+/g, "-").toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Form Exported",
      description: "Form has been exported as JSON file.",
    })
  }

  if (!currentForm) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 to-purple-900"
            : "bg-gradient-to-br from-blue-50 to-purple-50"
        }`}
      >
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card
            className={`p-8 md:p-12 text-center max-w-md shadow-2xl border-0 ${
              theme === "dark" ? "bg-gray-800/80 text-white" : "bg-white/80 text-gray-900"
            } backdrop-blur-sm`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to FormCraft
            </h2>
            <p className={`mb-8 leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Create beautiful, interactive forms with our advanced drag-and-drop builder.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={createNewForm}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg mb-6"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create New Form
              </Button>
            </motion.div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Globe className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      className={`h-screen flex flex-col ${
        theme === "dark" ? "bg-gradient-to-br from-gray-900 to-purple-900" : "bg-gradient-to-br from-gray-50 to-blue-50"
      }`}
    >
      <FormHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className={`w-80 border-r ${
              theme === "dark" ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
            } backdrop-blur-sm overflow-y-auto shadow-lg`}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-4 m-2">
                <TabsTrigger value="build" className="flex items-center gap-1 text-xs">
                  <Layers className="w-3 h-3" />
                  Build
                </TabsTrigger>
                <TabsTrigger value="steps" className="flex items-center gap-1 text-xs">
                  <Settings className="w-3 h-3" />
                  Steps
                </TabsTrigger>
                <TabsTrigger value="logic" className="flex items-center gap-1 text-xs">
                  <Zap className="w-3 h-3" />
                  Logic
                </TabsTrigger>
                <TabsTrigger value="theme" className="flex items-center gap-1 text-xs">
                  <Palette className="w-3 h-3" />
                  Theme
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                {activeTab === "build" && (
                  <TabsContent key="build" value="build" className="mt-0 h-full">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <FieldPalette />
                    </motion.div>
                  </TabsContent>
                )}
                {activeTab === "steps" && (
                  <TabsContent key="steps" value="steps" className="mt-0 h-full">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <MultiStepManager />
                    </motion.div>
                  </TabsContent>
                )}
                {activeTab === "logic" && (
                  <TabsContent key="logic" value="logic" className="mt-0 h-full">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <ConditionalLogicManager />
                    </motion.div>
                  </TabsContent>
                )}
                {activeTab === "theme" && (
                  <TabsContent key="theme" value="theme" className="mt-0 h-full">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <ThemeCustomizer />
                    </motion.div>
                  </TabsContent>
                )}
              </AnimatePresence>
            </Tabs>
          </motion.div>

          {/* Center Canvas */}
          <div
            className={`flex-1 ${
              theme === "dark"
                ? "bg-gradient-to-br from-gray-900 to-purple-900"
                : "bg-gradient-to-br from-gray-50 to-blue-50"
            } overflow-y-auto`}
          >
            <FormCanvas />
          </div>

          {/* Right Sidebar - Field Config */}
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            className={`w-80 border-l ${
              theme === "dark" ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
            } backdrop-blur-sm overflow-y-auto shadow-lg`}
          >
            <FieldConfigPanel />
          </motion.div>
        </div>

        {/* Preview Panel */}
        <AnimatePresence>
          {isPreviewOpen && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`w-96 border-l ${
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              } shadow-2xl`}
            >
              <FormPreview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Bottom Actions */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`border-t ${
          theme === "dark" ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-200"
        } backdrop-blur-sm p-4 shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={togglePreview} className="shadow-sm">
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewOpen ? "Hide Preview" : "Show Preview"}
              </Button>
            </motion.div>

            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="shadow-sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </motion.div>
            </Link>

            <Button variant="ghost" onClick={toggleTheme} className="shadow-sm">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={handleExport} className="shadow-sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={handleSave} disabled={isLoading} className="shadow-sm">
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-blue-500 rounded-full"
                  />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleShare}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
