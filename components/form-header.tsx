"use client"

import { useState } from "react"
import { useFormBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Edit2, Check, X } from "lucide-react"

export function FormHeader() {
  const { currentForm, updateForm, toggleMultiStep } = useFormBuilderStore()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(currentForm?.title || "")
  const [description, setDescription] = useState(currentForm?.description || "")

  if (!currentForm) return null

  const handleSave = () => {
    updateForm({ title, description })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTitle(currentForm.title)
    setDescription(currentForm.description || "")
    setIsEditing(false)
  }

  return (
    <Card className="m-4 p-4 border-b">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Form Title"
                className="text-lg font-semibold"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Form Description (optional)"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSave}>
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{currentForm.title}</h1>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
              {currentForm.description && <p className="text-gray-600">{currentForm.description}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Switch id="multi-step" checked={currentForm.isMultiStep} onCheckedChange={toggleMultiStep} />
          <Label htmlFor="multi-step">Multi-step Form</Label>
        </div>
      </div>
    </Card>
  )
}
