"use client"

import { useState, useEffect } from "react"
import { useFormBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"

export function FieldConfigPanel() {
  const { currentForm, selectedFieldId, updateField, selectField } = useFormBuilderStore()

  const selectedField = currentForm?.fields.find((f) => f.id === selectedFieldId)

  const [config, setConfig] = useState({
    label: "",
    placeholder: "",
    required: false,
    helpText: "",
    options: [] as string[],
    stepId: "",
    validation: {
      minLength: "",
      maxLength: "",
      pattern: "",
    },
  })

  useEffect(() => {
    if (selectedField) {
      setConfig({
        label: selectedField.label,
        placeholder: selectedField.placeholder || "",
        required: selectedField.required,
        helpText: selectedField.helpText || "",
        options: selectedField.options || [],
        stepId: selectedField.stepId || "",
        validation: {
          minLength: selectedField.validation?.minLength?.toString() || "",
          maxLength: selectedField.validation?.maxLength?.toString() || "",
          pattern: selectedField.validation?.pattern || "",
        },
      })
    }
  }, [selectedField])

  const handleUpdate = (updates: any) => {
    if (!selectedField) return

    const newConfig = { ...config, ...updates }
    setConfig(newConfig)

    const fieldUpdates: any = {
      label: newConfig.label,
      placeholder: newConfig.placeholder || undefined,
      required: newConfig.required,
      helpText: newConfig.helpText || undefined,
      stepId: newConfig.stepId || undefined,
    }

    if (selectedField.type === "select" || selectedField.type === "radio") {
      fieldUpdates.options = newConfig.options
    }

    // Handle validation
    const validation: any = {}
    if (newConfig.validation.minLength) {
      validation.minLength = Number.parseInt(newConfig.validation.minLength)
    }
    if (newConfig.validation.maxLength) {
      validation.maxLength = Number.parseInt(newConfig.validation.maxLength)
    }
    if (newConfig.validation.pattern) {
      validation.pattern = newConfig.validation.pattern
    }

    if (Object.keys(validation).length > 0) {
      fieldUpdates.validation = validation
    }

    updateField(selectedField.id, fieldUpdates)
  }

  const addOption = () => {
    const newOptions = [...config.options, `Option ${config.options.length + 1}`]
    handleUpdate({ options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...config.options]
    newOptions[index] = value
    handleUpdate({ options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = config.options.filter((_, i) => i !== index)
    handleUpdate({ options: newOptions })
  }

  if (!selectedField) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Select a field to configure its properties</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasOptions = selectedField.type === "select" || selectedField.type === "radio"
  const supportsValidation = ["text", "textarea", "email", "phone", "number"].includes(selectedField.type)

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Field Configuration</CardTitle>
          <p className="text-sm text-gray-600">Configure properties for {selectedField.type} field</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Properties */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={config.label}
                onChange={(e) => handleUpdate({ label: e.target.value })}
                placeholder="Field label"
              />
            </div>

            {selectedField.type !== "checkbox" && (
              <div>
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={config.placeholder}
                  onChange={(e) => handleUpdate({ placeholder: e.target.value })}
                  placeholder="Placeholder text"
                />
              </div>
            )}

            <div>
              <Label htmlFor="helpText">Help Text</Label>
              <Textarea
                id="helpText"
                value={config.helpText}
                onChange={(e) => handleUpdate({ helpText: e.target.value })}
                placeholder="Additional help text"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={config.required}
                onCheckedChange={(checked) => handleUpdate({ required: checked })}
              />
              <Label htmlFor="required">Required field</Label>
            </div>
          </div>

          {/* Step Assignment for Multi-step Forms */}
          {currentForm?.isMultiStep && currentForm.steps.length > 0 && (
            <>
              <Separator />
              <div>
                <Label htmlFor="step">Assign to Step</Label>
                <Select value={config.stepId} onValueChange={(value) => handleUpdate({ stepId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a step" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No step (unassigned)</SelectItem>
                    {currentForm.steps.map((step) => (
                      <SelectItem key={step.id} value={step.id}>
                        {step.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Options for Select/Radio */}
          {hasOptions && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Options</Label>
                  <Button size="sm" onClick={addOption}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {config.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeOption(index)}
                        disabled={config.options.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Validation Rules */}
          {supportsValidation && (
            <>
              <Separator />
              <div>
                <Label className="text-base font-medium">Validation Rules</Label>
                <div className="space-y-3 mt-3">
                  <div>
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={config.validation.minLength}
                      onChange={(e) =>
                        handleUpdate({
                          validation: { ...config.validation, minLength: e.target.value },
                        })
                      }
                      placeholder="Min characters"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLength">Maximum Length</Label>
                    <Input
                      id="maxLength"
                      type="number"
                      value={config.validation.maxLength}
                      onChange={(e) =>
                        handleUpdate({
                          validation: { ...config.validation, maxLength: e.target.value },
                        })
                      }
                      placeholder="Max characters"
                    />
                  </div>
                  {selectedField.type === "text" && (
                    <div>
                      <Label htmlFor="pattern">Pattern (Regex)</Label>
                      <Input
                        id="pattern"
                        value={config.validation.pattern}
                        onChange={(e) =>
                          handleUpdate({
                            validation: { ...config.validation, pattern: e.target.value },
                          })
                        }
                        placeholder="Regular expression"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full" onClick={() => selectField(null)}>
        Deselect Field
      </Button>
    </div>
  )
}
