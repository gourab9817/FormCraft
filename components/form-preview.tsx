"use client"

import type React from "react"

import { useState } from "react"
import { useFormBuilderStore } from "@/lib/store"
import { FieldRenderer } from "./field-renderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Monitor, Tablet, Smartphone, ChevronLeft, ChevronRight } from "lucide-react"

export function FormPreview() {
  const { currentForm, previewMode, setPreviewMode } = useFormBuilderStore()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(0)

  if (!currentForm) return null

  const validateField = (field: any, value: any) => {
    const errors: string[] = []

    if (field.required && (!value || (typeof value === "string" && !value.trim()))) {
      errors.push("This field is required")
    }

    if (value && field.validation) {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        errors.push(`Minimum length is ${field.validation.minLength} characters`)
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        errors.push(`Maximum length is ${field.validation.maxLength} characters`)
      }
      if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
        errors.push("Invalid format")
      }
    }

    if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push("Invalid email format")
    }

    if (field.type === "phone" && value && !/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ""))) {
      errors.push("Invalid phone number")
    }

    return errors[0] || ""
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))

    const field = currentForm.fields.find((f) => f.id === fieldId)
    if (field) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [fieldId]: error }))
    }
  }

  const getDeviceClass = () => {
    switch (previewMode) {
      case "tablet":
        return "max-w-md"
      case "mobile":
        return "max-w-sm"
      default:
        return "max-w-2xl"
    }
  }

  const getFieldsForStep = (stepIndex: number) => {
    if (!currentForm.isMultiStep) {
      return currentForm.fields
    }

    const step = currentForm.steps[stepIndex]
    return currentForm.fields.filter((field) => field.stepId === step?.id)
  }

  const validateCurrentStep = () => {
    const stepFields = getFieldsForStep(currentStep)
    const stepErrors: Record<string, string> = {}

    stepFields.forEach((field) => {
      const error = validateField(field, formData[field.id])
      if (error) {
        stepErrors[field.id] = error
      }
    })

    setErrors((prev) => ({ ...prev, ...stepErrors }))
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, currentForm.steps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (currentForm.isMultiStep) {
      if (currentStep < currentForm.steps.length - 1) {
        handleNext()
        return
      }
    }

    // Validate all fields
    const allErrors: Record<string, string> = {}
    currentForm.fields.forEach((field) => {
      const error = validateField(field, formData[field.id])
      if (error) {
        allErrors[field.id] = error
      }
    })

    setErrors(allErrors)

    if (Object.keys(allErrors).length === 0) {
      alert("Form submitted successfully!")
      console.log("Form data:", formData)
    }
  }

  const currentStepFields = getFieldsForStep(currentStep)

  return (
    <div className="h-full flex flex-col">
      {/* Preview Controls */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Form Preview</h3>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={previewMode === "desktop" ? "default" : "ghost"}
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={previewMode === "tablet" ? "default" : "ghost"}
              onClick={() => setPreviewMode("tablet")}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={previewMode === "mobile" ? "default" : "ghost"}
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Multi-step Progress */}
        {currentForm.isMultiStep && currentForm.steps.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                Step {currentStep + 1} of {currentForm.steps.length}
              </span>
              <span>{Math.round(((currentStep + 1) / currentForm.steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / currentForm.steps.length) * 100}%` }}
              />
            </div>
            <div className="flex gap-1">
              {currentForm.steps.map((step, index) => (
                <Badge
                  key={step.id}
                  variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {step.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className={`mx-auto ${getDeviceClass()}`}>
          <Card>
            <CardHeader>
              <CardTitle>{currentForm.title}</CardTitle>
              {currentForm.description && <p className="text-gray-600">{currentForm.description}</p>}
              {currentForm.isMultiStep && currentForm.steps[currentStep] && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">{currentForm.steps[currentStep].title}</h4>
                  {currentForm.steps[currentStep].description && (
                    <p className="text-sm text-blue-700 mt-1">{currentForm.steps[currentStep].description}</p>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {currentStepFields.map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    value={formData[field.id]}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={errors[field.id]}
                  />
                ))}

                <div className="flex items-center justify-between pt-4">
                  {currentForm.isMultiStep && currentStep > 0 ? (
                    <Button type="button" variant="outline" onClick={handlePrevious}>
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentForm.isMultiStep && currentStep < currentForm.steps.length - 1 ? (
                    <Button type="submit">
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button type="submit">Submit Form</Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
