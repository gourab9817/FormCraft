"use client"

import { FormFiller } from "@/components/form-filler"
import { useParams } from "next/navigation"

export default function FormPreviewPage() {
  const params = useParams()
  const formId = params.id as string

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <FormFiller formId={formId} />
    </div>
  )
}
