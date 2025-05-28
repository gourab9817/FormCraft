"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useFormBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Type, Layout, Sparkles } from "lucide-react"

interface FormTheme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderRadius: number
  spacing: number
  fontFamily: string
  fontSize: number
  shadowIntensity: number
  gradientEnabled: boolean
}

const colorPresets = [
  { name: "Ocean", primary: "#3b82f6", secondary: "#06b6d4", bg: "#f8fafc" },
  { name: "Forest", primary: "#10b981", secondary: "#34d399", bg: "#f0fdf4" },
  { name: "Sunset", primary: "#f59e0b", secondary: "#fb923c", bg: "#fffbeb" },
  { name: "Purple", primary: "#8b5cf6", secondary: "#a78bfa", bg: "#faf5ff" },
  { name: "Rose", primary: "#f43f5e", secondary: "#fb7185", bg: "#fff1f2" },
  { name: "Dark", primary: "#6366f1", secondary: "#8b5cf6", bg: "#0f172a" },
]

const fontOptions = [
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
]

export function ThemeCustomizer() {
  const { currentForm, updateForm } = useFormBuilderStore()
  const [theme, setTheme] = useState<FormTheme>({
    primaryColor: "#3b82f6",
    secondaryColor: "#06b6d4",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderRadius: 8,
    spacing: 16,
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    shadowIntensity: 2,
    gradientEnabled: true,
  })

  if (!currentForm) return null

  const applyPreset = (preset: (typeof colorPresets)[0]) => {
    setTheme((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      backgroundColor: preset.bg,
    }))
  }

  const generateCSS = () => {
    return `
      .form-theme {
        --primary-color: ${theme.primaryColor};
        --secondary-color: ${theme.secondaryColor};
        --background-color: ${theme.backgroundColor};
        --text-color: ${theme.textColor};
        --border-radius: ${theme.borderRadius}px;
        --spacing: ${theme.spacing}px;
        --font-family: ${theme.fontFamily};
        --font-size: ${theme.fontSize}px;
        --shadow: 0 ${theme.shadowIntensity}px ${theme.shadowIntensity * 2}px rgba(0,0,0,0.1);
        ${theme.gradientEnabled ? `--gradient: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});` : ""}
      }
    `
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-500" />
          Theme Customizer
        </h3>
        <p className="text-sm text-gray-600 mb-4">Customize the appearance of your form</p>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          {/* Color Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Color Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {colorPresets.map((preset, index) => (
                  <motion.button
                    key={preset.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applyPreset(preset)}
                    className="p-3 rounded-lg border text-left hover:shadow-md transition-all"
                    style={{ backgroundColor: preset.bg }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                    </div>
                    <div className="text-sm font-medium">{preset.name}</div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Custom Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Primary Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="w-12 h-8 rounded border"
                  />
                  <span className="text-sm text-gray-600">{theme.primaryColor}</span>
                </div>
              </div>

              <div>
                <Label>Secondary Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                    className="w-12 h-8 rounded border"
                  />
                  <span className="text-sm text-gray-600">{theme.secondaryColor}</span>
                </div>
              </div>

              <div>
                <Label>Background Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                    className="w-12 h-8 rounded border"
                  />
                  <span className="text-sm text-gray-600">{theme.backgroundColor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Enable Gradient</Label>
                <Switch
                  checked={theme.gradientEnabled}
                  onCheckedChange={(checked) => setTheme({ ...theme, gradientEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Type className="w-4 h-4" />
                Typography Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Font Family</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {fontOptions.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => setTheme({ ...theme, fontFamily: font.value })}
                      className={`p-2 text-left rounded border transition-colors ${
                        theme.fontFamily === font.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ fontFamily: font.value }}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Font Size: {theme.fontSize}px</Label>
                <Slider
                  value={[theme.fontSize]}
                  onValueChange={([value]) => setTheme({ ...theme, fontSize: value })}
                  min={12}
                  max={20}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Text Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={theme.textColor}
                    onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                    className="w-12 h-8 rounded border"
                  />
                  <span className="text-sm text-gray-600">{theme.textColor}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Layout Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Border Radius: {theme.borderRadius}px</Label>
                <Slider
                  value={[theme.borderRadius]}
                  onValueChange={([value]) => setTheme({ ...theme, borderRadius: value })}
                  min={0}
                  max={20}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Spacing: {theme.spacing}px</Label>
                <Slider
                  value={[theme.spacing]}
                  onValueChange={([value]) => setTheme({ ...theme, spacing: value })}
                  min={8}
                  max={32}
                  step={2}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Shadow Intensity: {theme.shadowIntensity}</Label>
                <Slider
                  value={[theme.shadowIntensity]}
                  onValueChange={([value]) => setTheme({ ...theme, shadowIntensity: value })}
                  min={0}
                  max={8}
                  step={1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: theme.backgroundColor,
              fontFamily: theme.fontFamily,
              fontSize: theme.fontSize,
              color: theme.textColor,
              borderRadius: theme.borderRadius,
            }}
          >
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Sample Field</label>
                <input
                  type="text"
                  placeholder="Enter text here..."
                  className="w-full p-2 border rounded"
                  style={{
                    borderRadius: theme.borderRadius,
                    borderColor: theme.primaryColor,
                    boxShadow: `0 ${theme.shadowIntensity}px ${theme.shadowIntensity * 2}px rgba(0,0,0,0.1)`,
                  }}
                />
              </div>
              <button
                className="px-4 py-2 text-white rounded font-medium"
                style={{
                  background: theme.gradientEnabled
                    ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                    : theme.primaryColor,
                  borderRadius: theme.borderRadius,
                  boxShadow: `0 ${theme.shadowIntensity}px ${theme.shadowIntensity * 2}px rgba(0,0,0,0.1)`,
                }}
              >
                Submit Button
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Theme */}
      <Card>
        <CardContent className="pt-4">
          <Button
            className="w-full"
            onClick={() => {
              const css = generateCSS()
              navigator.clipboard.writeText(css)
              // Show toast notification
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Copy Theme CSS
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
