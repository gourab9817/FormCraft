"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useFormBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Zap, Eye, EyeOff } from "lucide-react"

interface ConditionalRule {
  id: string
  fieldId: string
  condition: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
  value: string
  action: "show" | "hide" | "require" | "optional"
  targetFieldIds: string[]
}

export function ConditionalLogicManager() {
  const { currentForm, updateForm } = useFormBuilderStore()
  const [rules, setRules] = useState<ConditionalRule[]>([])
  const [newRule, setNewRule] = useState<Partial<ConditionalRule>>({
    condition: "equals",
    action: "show",
    targetFieldIds: [],
  })

  if (!currentForm) return null

  const addRule = () => {
    if (!newRule.fieldId || !newRule.value || !newRule.targetFieldIds?.length) return

    const rule: ConditionalRule = {
      id: `rule_${Date.now()}`,
      fieldId: newRule.fieldId,
      condition: newRule.condition || "equals",
      value: newRule.value,
      action: newRule.action || "show",
      targetFieldIds: newRule.targetFieldIds,
    }

    setRules([...rules, rule])
    setNewRule({
      condition: "equals",
      action: "show",
      targetFieldIds: [],
    })
  }

  const removeRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId))
  }

  const getFieldName = (fieldId: string) => {
    return currentForm.fields.find((f) => f.id === fieldId)?.label || "Unknown Field"
  }

  const conditionLabels = {
    equals: "equals",
    not_equals: "does not equal",
    contains: "contains",
    greater_than: "is greater than",
    less_than: "is less than",
  }

  const actionLabels = {
    show: "Show",
    hide: "Hide",
    require: "Make Required",
    optional: "Make Optional",
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Conditional Logic
        </h3>
        <p className="text-sm text-gray-600 mb-4">Show, hide, or modify fields based on user responses</p>
      </div>

      {/* Add New Rule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add New Rule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>When field</Label>
            <Select value={newRule.fieldId} onValueChange={(value) => setNewRule({ ...newRule, fieldId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                {currentForm.fields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Condition</Label>
            <Select
              value={newRule.condition}
              onValueChange={(value: any) => setNewRule({ ...newRule, condition: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">equals</SelectItem>
                <SelectItem value="not_equals">does not equal</SelectItem>
                <SelectItem value="contains">contains</SelectItem>
                <SelectItem value="greater_than">is greater than</SelectItem>
                <SelectItem value="less_than">is less than</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Value</Label>
            <Input
              value={newRule.value || ""}
              onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
              placeholder="Enter value"
            />
          </div>

          <div>
            <Label>Action</Label>
            <Select value={newRule.action} onValueChange={(value: any) => setNewRule({ ...newRule, action: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="show">Show fields</SelectItem>
                <SelectItem value="hide">Hide fields</SelectItem>
                <SelectItem value="require">Make fields required</SelectItem>
                <SelectItem value="optional">Make fields optional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Target Fields</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {currentForm.fields
                .filter((field) => field.id !== newRule.fieldId)
                .map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={field.id}
                      checked={newRule.targetFieldIds?.includes(field.id) || false}
                      onChange={(e) => {
                        const targetIds = newRule.targetFieldIds || []
                        if (e.target.checked) {
                          setNewRule({ ...newRule, targetFieldIds: [...targetIds, field.id] })
                        } else {
                          setNewRule({ ...newRule, targetFieldIds: targetIds.filter((id) => id !== field.id) })
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={field.id} className="text-sm">
                      {field.label}
                    </Label>
                  </div>
                ))}
            </div>
          </div>

          <Button onClick={addRule} disabled={!newRule.fieldId || !newRule.value || !newRule.targetFieldIds?.length}>
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </CardContent>
      </Card>

      {/* Existing Rules */}
      <div className="space-y-3">
        {rules.map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {rule.action === "show" ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : rule.action === "hide" ? (
                        <EyeOff className="w-4 h-4 text-red-500" />
                      ) : (
                        <Zap className="w-4 h-4 text-yellow-500" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        Rule {index + 1}
                      </Badge>
                    </div>

                    <div className="text-sm space-y-1">
                      <div>
                        <span className="font-medium">When </span>
                        <Badge variant="secondary">{getFieldName(rule.fieldId)}</Badge>
                        <span className="mx-1">{conditionLabels[rule.condition]}</span>
                        <Badge variant="outline">"{rule.value}"</Badge>
                      </div>

                      <div>
                        <span className="font-medium">{actionLabels[rule.action]} </span>
                        {rule.targetFieldIds.map((fieldId, i) => (
                          <span key={fieldId}>
                            <Badge variant="secondary" className="mr-1">
                              {getFieldName(fieldId)}
                            </Badge>
                            {i < rule.targetFieldIds.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeRule(rule.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {rules.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No conditional rules created yet.</p>
              <p className="text-sm">Add rules to create dynamic form behavior.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
