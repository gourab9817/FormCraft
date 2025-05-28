"use client"

import { useFormBuilderStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Type, AlignLeft, ChevronDown, CheckSquare, Calendar, Mail, Phone, Hash, Circle } from "lucide-react"

const fieldTypes = [
  {
    type: "text" as const,
    label: "Text Input",
    icon: Type,
    description: "Single line text input",
  },
  {
    type: "textarea" as const,
    label: "Textarea",
    icon: AlignLeft,
    description: "Multi-line text input",
  },
  {
    type: "select" as const,
    label: "Dropdown",
    icon: ChevronDown,
    description: "Select from options",
  },
  {
    type: "checkbox" as const,
    label: "Checkbox",
    icon: CheckSquare,
    description: "Single checkbox",
  },
  {
    type: "radio" as const,
    label: "Radio Group",
    icon: Circle,
    description: "Select one option",
  },
  {
    type: "date" as const,
    label: "Date Picker",
    icon: Calendar,
    description: "Date selection",
  },
  {
    type: "email" as const,
    label: "Email",
    icon: Mail,
    description: "Email input with validation",
  },
  {
    type: "phone" as const,
    label: "Phone",
    icon: Phone,
    description: "Phone number input",
  },
  {
    type: "number" as const,
    label: "Number",
    icon: Hash,
    description: "Numeric input",
  },
]

export function FieldPalette() {
  const { addField, currentForm } = useFormBuilderStore()

  const handleAddField = (type: (typeof fieldTypes)[0]["type"]) => {
    const defaultField = {
      type,
      label: `${fieldTypes.find((f) => f.type === type)?.label} Field`,
      required: false,
      stepId: currentForm?.isMultiStep && currentForm.steps.length > 0 ? currentForm.steps[0].id : undefined,
    }

    if (type === "select" || type === "radio") {
      defaultField.options = ["Option 1", "Option 2", "Option 3"]
    }

    addField(defaultField)
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">Field Types</h3>
        <p className="text-sm text-gray-600 mb-4">Drag and drop or click to add fields to your form</p>
      </div>

      <div className="space-y-2">
        {fieldTypes.map((fieldType) => {
          const Icon = fieldType.icon
          return (
            <Card
              key={fieldType.type}
              className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleAddField(fieldType.type)}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{fieldType.label}</h4>
                  <p className="text-xs text-gray-500 mt-1">{fieldType.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
