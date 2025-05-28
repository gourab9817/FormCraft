"use client"

import type { FormField } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface FieldRendererProps {
  field: FormField
  value?: any
  onChange?: (value: any) => void
  error?: string
}

export function FieldRenderer({ field, value, onChange, error }: FieldRendererProps) {
  const isPreview = !!onChange

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <Input
            type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className={error ? "border-red-500" : ""}
            disabled={!isPreview}
          />
        )

      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className={error ? "border-red-500" : ""}
            disabled={!isPreview}
          />
        )

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className={error ? "border-red-500" : ""}
            disabled={!isPreview}
            rows={3}
          />
        )

      case "select":
        return (
          <Select value={value} onValueChange={onChange} disabled={!isPreview}>
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={field.id} checked={value || false} onCheckedChange={onChange} disabled={!isPreview} />
            <Label htmlFor={field.id} className="text-sm">
              {field.label}
            </Label>
          </div>
        )

      case "radio":
        return (
          <RadioGroup value={value} onValueChange={onChange} disabled={!isPreview}>
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className={error ? "border-red-500" : ""}
            disabled={!isPreview}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <Label className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {renderField()}

      {field.helpText && <p className="text-xs text-gray-500">{field.helpText}</p>}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
