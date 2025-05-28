import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface FormField {
  id: string
  type: "text" | "textarea" | "select" | "checkbox" | "radio" | "date" | "email" | "phone" | "number"
  label: string
  placeholder?: string
  required: boolean
  helpText?: string
  options?: string[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
  stepId?: string
}

export interface FormStep {
  id: string
  title: string
  description?: string
}

export interface Form {
  id: string
  title: string
  description?: string
  fields: FormField[]
  steps: FormStep[]
  isMultiStep: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  form: Omit<Form, "id" | "createdAt" | "updatedAt">
}

interface FormBuilderState {
  currentForm: Form | null
  selectedFieldId: string | null
  previewMode: "desktop" | "tablet" | "mobile"
  isPreviewOpen: boolean
  templates: FormTemplate[]
  savedForms: Form[]

  // Actions
  createNewForm: () => void
  updateForm: (updates: Partial<Form>) => void
  addField: (field: Omit<FormField, "id">) => void
  updateField: (fieldId: string, updates: Partial<FormField>) => void
  removeField: (fieldId: string) => void
  reorderFields: (startIndex: number, endIndex: number) => void
  selectField: (fieldId: string | null) => void
  setPreviewMode: (mode: "desktop" | "tablet" | "mobile") => void
  togglePreview: () => void
  saveForm: () => void
  loadForm: (formId: string) => void
  addStep: (step: Omit<FormStep, "id">) => void
  updateStep: (stepId: string, updates: Partial<FormStep>) => void
  removeStep: (stepId: string) => void
  toggleMultiStep: () => void
  saveAsTemplate: (name: string, description: string) => void
  loadTemplate: (templateId: string) => void
  generateShareableLink: () => string
}

const defaultTemplates: FormTemplate[] = [
  {
    id: "contact-us",
    name: "Contact Us",
    description: "Basic contact form with name, email, and message",
    form: {
      title: "Contact Us",
      description: "Get in touch with us",
      fields: [
        {
          id: "name",
          type: "text",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
          validation: { minLength: 2 },
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          required: true,
        },
        {
          id: "message",
          type: "textarea",
          label: "Message",
          placeholder: "Enter your message",
          required: true,
          validation: { minLength: 10 },
        },
      ],
      steps: [],
      isMultiStep: false,
    },
  },
  {
    id: "survey",
    name: "Customer Survey",
    description: "Multi-step customer feedback survey",
    form: {
      title: "Customer Survey",
      description: "Help us improve our services",
      fields: [
        {
          id: "satisfaction",
          type: "radio",
          label: "How satisfied are you with our service?",
          required: true,
          options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
          stepId: "step1",
        },
        {
          id: "recommend",
          type: "select",
          label: "Would you recommend us to others?",
          required: true,
          options: ["Definitely", "Probably", "Not Sure", "Probably Not", "Definitely Not"],
          stepId: "step1",
        },
        {
          id: "improvements",
          type: "textarea",
          label: "What can we improve?",
          placeholder: "Share your suggestions",
          stepId: "step2",
        },
        {
          id: "contact-back",
          type: "checkbox",
          label: "May we contact you for follow-up?",
          stepId: "step2",
        },
      ],
      steps: [
        { id: "step1", title: "Feedback", description: "Tell us about your experience" },
        { id: "step2", title: "Suggestions", description: "Help us improve" },
      ],
      isMultiStep: true,
    },
  },
]

export const useFormBuilderStore = create<FormBuilderState>()(
  persist(
    (set, get) => ({
      currentForm: null,
      selectedFieldId: null,
      previewMode: "desktop",
      isPreviewOpen: false,
      templates: defaultTemplates,
      savedForms: [],

      createNewForm: () => {
        const newForm: Form = {
          id: `form_${Date.now()}`,
          title: "Untitled Form",
          description: "",
          fields: [],
          steps: [],
          isMultiStep: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set({ currentForm: newForm, selectedFieldId: null })
      },

      updateForm: (updates) => {
        const { currentForm } = get()
        if (!currentForm) return

        set({
          currentForm: {
            ...currentForm,
            ...updates,
            updatedAt: new Date(),
          },
        })
      },

      addField: (field) => {
        const { currentForm } = get()
        if (!currentForm) return

        const newField: FormField = {
          ...field,
          id: `field_${Date.now()}`,
        }

        set({
          currentForm: {
            ...currentForm,
            fields: [...currentForm.fields, newField],
            updatedAt: new Date(),
          },
        })
      },

      updateField: (fieldId, updates) => {
        const { currentForm } = get()
        if (!currentForm) return

        set({
          currentForm: {
            ...currentForm,
            fields: currentForm.fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)),
            updatedAt: new Date(),
          },
        })
      },

      removeField: (fieldId) => {
        const { currentForm } = get()
        if (!currentForm) return

        set({
          currentForm: {
            ...currentForm,
            fields: currentForm.fields.filter((field) => field.id !== fieldId),
            updatedAt: new Date(),
          },
          selectedFieldId: null,
        })
      },

      reorderFields: (startIndex, endIndex) => {
        const { currentForm } = get()
        if (!currentForm) return

        const fields = [...currentForm.fields]
        const [removed] = fields.splice(startIndex, 1)
        fields.splice(endIndex, 0, removed)

        set({
          currentForm: {
            ...currentForm,
            fields,
            updatedAt: new Date(),
          },
        })
      },

      selectField: (fieldId) => {
        set({ selectedFieldId: fieldId })
      },

      setPreviewMode: (mode) => {
        set({ previewMode: mode })
      },

      togglePreview: () => {
        set((state) => ({ isPreviewOpen: !state.isPreviewOpen }))
      },

      saveForm: () => {
        const { currentForm, savedForms } = get()
        if (!currentForm) return

        const existingIndex = savedForms.findIndex((form) => form.id === currentForm.id)
        const updatedForms =
          existingIndex >= 0
            ? savedForms.map((form, index) => (index === existingIndex ? currentForm : form))
            : [...savedForms, currentForm]

        set({ savedForms: updatedForms })
      },

      loadForm: (formId) => {
        const { savedForms } = get()
        const form = savedForms.find((f) => f.id === formId)
        if (form) {
          set({ currentForm: form, selectedFieldId: null })
        }
      },

      addStep: (step) => {
        const { currentForm } = get()
        if (!currentForm) return

        const newStep: FormStep = {
          ...step,
          id: `step_${Date.now()}`,
        }

        set({
          currentForm: {
            ...currentForm,
            steps: [...currentForm.steps, newStep],
            updatedAt: new Date(),
          },
        })
      },

      updateStep: (stepId, updates) => {
        const { currentForm } = get()
        if (!currentForm) return

        set({
          currentForm: {
            ...currentForm,
            steps: currentForm.steps.map((step) => (step.id === stepId ? { ...step, ...updates } : step)),
            updatedAt: new Date(),
          },
        })
      },

      removeStep: (stepId) => {
        const { currentForm } = get()
        if (!currentForm) return

        set({
          currentForm: {
            ...currentForm,
            steps: currentForm.steps.filter((step) => step.id !== stepId),
            fields: currentForm.fields.map((field) =>
              field.stepId === stepId ? { ...field, stepId: undefined } : field,
            ),
            updatedAt: new Date(),
          },
        })
      },

      toggleMultiStep: () => {
        const { currentForm } = get()
        if (!currentForm) return

        set({
          currentForm: {
            ...currentForm,
            isMultiStep: !currentForm.isMultiStep,
            steps: !currentForm.isMultiStep ? [] : currentForm.steps,
            fields: !currentForm.isMultiStep
              ? currentForm.fields.map((field) => ({ ...field, stepId: undefined }))
              : currentForm.fields,
            updatedAt: new Date(),
          },
        })
      },

      saveAsTemplate: (name, description) => {
        const { currentForm, templates } = get()
        if (!currentForm) return

        const template: FormTemplate = {
          id: `template_${Date.now()}`,
          name,
          description,
          form: {
            title: currentForm.title,
            description: currentForm.description,
            fields: currentForm.fields,
            steps: currentForm.steps,
            isMultiStep: currentForm.isMultiStep,
          },
        }

        set({ templates: [...templates, template] })
      },

      loadTemplate: (templateId) => {
        const { templates } = get()
        const template = templates.find((t) => t.id === templateId)
        if (!template) return

        const newForm: Form = {
          id: `form_${Date.now()}`,
          ...template.form,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set({ currentForm: newForm, selectedFieldId: null })
      },

      generateShareableLink: () => {
        const { currentForm } = get()
        if (!currentForm) return ""

        // Save the form first
        get().saveForm()

        return `${window.location.origin}/preview/${currentForm.id}`
      },
    }),
    {
      name: "form-builder-storage",
      partialize: (state) => ({
        savedForms: state.savedForms,
        templates: state.templates,
      }),
    },
  ),
)
