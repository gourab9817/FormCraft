"use client"

import { useState } from "react"
import { useFormBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, Check, X } from "lucide-react"

export function MultiStepManager() {
  const { currentForm, addStep, updateStep, removeStep } = useFormBuilderStore()

  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [newStep, setNewStep] = useState({ title: "", description: "" })
  const [editData, setEditData] = useState({ title: "", description: "" })

  if (!currentForm) return null

  const handleAddStep = () => {
    if (!newStep.title.trim()) return

    addStep(newStep)
    setNewStep({ title: "", description: "" })
  }

  const handleEditStep = (stepId: string) => {
    const step = currentForm.steps.find((s) => s.id === stepId)
    if (step) {
      setEditData({ title: step.title, description: step.description || "" })
      setEditingStep(stepId)
    }
  }

  const handleSaveEdit = () => {
    if (!editingStep || !editData.title.trim()) return

    updateStep(editingStep, editData)
    setEditingStep(null)
    setEditData({ title: "", description: "" })
  }

  const handleCancelEdit = () => {
    setEditingStep(null)
    setEditData({ title: "", description: "" })
  }

  const getFieldCountForStep = (stepId: string) => {
    return currentForm.fields.filter((field) => field.stepId === stepId).length
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">Multi-Step Configuration</h3>
        <p className="text-sm text-gray-600 mb-4">
          {currentForm.isMultiStep ? "Manage steps for your multi-step form" : "Enable multi-step mode to create steps"}
        </p>
      </div>

      {!currentForm.isMultiStep ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Multi-step mode is disabled. Enable it in the form header to create steps.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Add New Step */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add New Step</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="step-title">Step Title</Label>
                <Input
                  id="step-title"
                  value={newStep.title}
                  onChange={(e) => setNewStep((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter step title"
                />
              </div>
              <div>
                <Label htmlFor="step-description">Description (optional)</Label>
                <Textarea
                  id="step-description"
                  value={newStep.description}
                  onChange={(e) => setNewStep((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter step description"
                  rows={2}
                />
              </div>
              <Button onClick={handleAddStep} disabled={!newStep.title.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </CardContent>
          </Card>

          {/* Existing Steps */}
          <div className="space-y-3">
            {currentForm.steps.map((step, index) => (
              <Card key={step.id}>
                <CardContent className="pt-4">
                  {editingStep === step.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editData.title}
                        onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Step title"
                      />
                      <Textarea
                        value={editData.description}
                        onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Step description"
                        rows={2}
                      />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Step {index + 1}</span>
                          <span className="text-xs text-gray-500">{getFieldCountForStep(step.id)} fields</span>
                        </div>
                        <h4 className="font-medium">{step.title}</h4>
                        {step.description && <p className="text-sm text-gray-600 mt-1">{step.description}</p>}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEditStep(step.id)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeStep(step.id)}
                          disabled={currentForm.steps.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {currentForm.steps.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">No steps created yet. Add your first step above.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
