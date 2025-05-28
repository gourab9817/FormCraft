"use client"

import { useState } from "react"
import { useFormBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Save, Download, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function TemplateManager() {
  const { currentForm, templates, loadTemplate, saveAsTemplate } = useFormBuilderStore()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [templateData, setTemplateData] = useState({
    name: "",
    description: "",
  })

  const handleSaveTemplate = () => {
    if (!currentForm || !templateData.name.trim()) return

    saveAsTemplate(templateData.name, templateData.description)
    setTemplateData({ name: "", description: "" })
    setIsDialogOpen(false)

    toast({
      title: "Template Saved",
      description: "Your form has been saved as a template.",
    })
  }

  const handleLoadTemplate = (templateId: string) => {
    loadTemplate(templateId)
    toast({
      title: "Template Loaded",
      description: "Template has been loaded into the form builder.",
    })
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg mb-1">Templates</h3>
          <p className="text-sm text-gray-600">Save and load form templates</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={!currentForm}>
              <Save className="w-4 h-4 mr-2" />
              Save as Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save as Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateData.name}
                  onChange={(e) => setTemplateData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={templateData.description}
                  onChange={(e) => setTemplateData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter template description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate} disabled={!templateData.name.trim()}>
                  Save Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium">{template.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {template.form.fields.length} fields
                    </Badge>
                    {template.form.isMultiStep && (
                      <Badge variant="secondary" className="text-xs">
                        {template.form.steps.length} steps
                      </Badge>
                    )}
                  </div>
                </div>

                <Button size="sm" onClick={() => handleLoadTemplate(template.id)}>
                  <Download className="w-4 h-4 mr-1" />
                  Load
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No templates saved yet. Create a form and save it as a template.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
