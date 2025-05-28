"use client"

import { useFormBuilderStore } from "@/lib/store"
import { FieldRenderer } from "./field-renderer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Trash2 } from "lucide-react"

export function FormCanvas() {
  const { currentForm, selectedFieldId, selectField, removeField, reorderFields } = useFormBuilderStore()

  if (!currentForm) return null

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    reorderFields(result.source.index, result.destination.index)
  }

  const getFieldsByStep = () => {
    if (!currentForm.isMultiStep) {
      return [{ step: null, fields: currentForm.fields }]
    }

    const stepGroups = currentForm.steps.map((step) => ({
      step,
      fields: currentForm.fields.filter((field) => field.stepId === step.id),
    }))

    const unassignedFields = currentForm.fields.filter((field) => !field.stepId)
    if (unassignedFields.length > 0) {
      stepGroups.push({
        step: { id: "unassigned", title: "Unassigned Fields", description: "" },
        fields: unassignedFields,
      })
    }

    return stepGroups
  }

  const fieldGroups = getFieldsByStep()

  if (currentForm.fields.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h3 className="text-lg font-semibold mb-2">Start Building Your Form</h3>
          <p className="text-gray-600 mb-4">Add fields from the palette on the left to get started.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{currentForm.title}</h2>
          {currentForm.description && <p className="text-gray-600 mt-2">{currentForm.description}</p>}
        </div>

        {fieldGroups.map((group, groupIndex) => (
          <div key={group.step?.id || "main"} className="mb-8">
            {currentForm.isMultiStep && group.step && (
              <div className="mb-4 pb-2 border-b">
                <h3 className="text-lg font-semibold">{group.step.title}</h3>
                {group.step.description && <p className="text-sm text-gray-600">{group.step.description}</p>}
              </div>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId={`step-${group.step?.id || "main"}`}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {group.fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`group relative ${
                              selectedFieldId === field.id ? "ring-2 ring-blue-500 rounded-lg" : ""
                            } ${snapshot.isDragging ? "shadow-lg" : ""}`}
                            onClick={() => selectField(field.id)}
                          >
                            <div className="flex items-start gap-2">
                              <div
                                {...provided.dragHandleProps}
                                className="mt-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                              >
                                <GripVertical className="w-4 h-4 text-gray-400" />
                              </div>

                              <div className="flex-1">
                                <FieldRenderer field={field} />
                              </div>

                              <Button
                                size="sm"
                                variant="ghost"
                                className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeField(field.id)
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        ))}
      </div>
    </div>
  )
}
