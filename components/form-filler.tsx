"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useFormBuilderStore } from "@/lib/store"
import { FieldRenderer } from "./field-renderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"

interface FormFillerProps {
  formId: string
}

export function FormFiller({ formId }: FormFillerProps) {
  const { savedForms } = useFormBuilderStore()
  const [form, setForm] = useState<any>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const foundForm = savedForms.find((f) => f.id === formId)
    if (foundForm) {
      setForm(foundForm)
    }
  }, [formId, savedForms])

  if (!form) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
              <p className="text-gray-600">The form you're looking for doesn't exist or has been removed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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

    const field = form.fields.find((f: any) => f.id === fieldId)
    if (field) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [fieldId]: error }))
    }
  }

  const getFieldsForStep = (stepIndex: number) => {
    if (!form.isMultiStep) {
      return form.fields
    }

    const step = form.steps[stepIndex]
    return form.fields.filter((field: any) => field.stepId === step?.id)
  }

  const validateCurrentStep = () => {
    const stepFields = getFieldsForStep(currentStep)
    const stepErrors: Record<string, string> = {}

    stepFields.forEach((field: any) => {
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
      setCurrentStep((prev) => Math.min(prev + 1, form.steps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (form.isMultiStep) {
      if (currentStep < form.steps.length - 1) {
        handleNext()
        return
      }
    }

    // Validate all fields
    const allErrors: Record<string, string> = {}
    form.fields.forEach((field: any) => {
      const error = validateField(field, formData[field.id])
      if (error) {
        allErrors[field.id] = error
      }
    })

    setErrors(allErrors)

    if (Object.keys(allErrors).length === 0) {
      setIsSubmitted(true)
      // Here you would typically send the data to your backend
      console.log("Form submitted:", formData)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
              <p className="text-gray-600">Your form has been submitted successfully. We'll get back to you soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentStepFields = getFieldsForStep(currentStep)
  const progress = form.isMultiStep ? ((currentStep + 1) / form.steps.length) * 100 : 100

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{form.title}</CardTitle>
          {form.description && <p className="text-gray-600">{form.description}</p>}

          {/* Multi-step Progress */}
          {form.isMultiStep && form.steps.length > 0 && (
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span>
                  Step {currentStep + 1} of {form.steps.length}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="flex gap-1 flex-wrap">
                {form.steps.map((step: any, index: number) => (
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

          {/* Current Step Info */}
          {form.isMultiStep && form.steps[currentStep] && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">{form.steps[currentStep].title}</h4>
              {form.steps[currentStep].description && (
                <p className="text-sm text-blue-700 mt-1">{form.steps[currentStep].description}</p>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentStepFields.map((field: any) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={formData[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
                error={errors[field.id]}
              />
            ))}

            <div className="flex items-center justify-between pt-4">
              {form.isMultiStep && currentStep > 0 ? (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {form.isMultiStep && currentStep < form.steps.length - 1 ? (
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
  )
}
