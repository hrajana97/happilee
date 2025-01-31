"use client"

import { useState } from "react"
import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Send } from "lucide-react"

interface AIContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vendor: {
    name: string
    category: string
    contacted?: boolean
    nextStep?: string
  }
  userData: {
    name: string
    weddingDate: string
    location: string
  }
}

export function AIContactDialog({ open, onOpenChange, vendor, userData }: AIContactDialogProps) {
  const [step, setStep] = useState<"confirm" | "draft" | "edit">("confirm")
  const [emailDraft, setEmailDraft] = useState("")
  const dialogId = React.useId()

  const generateEmailDraft = () => {
    return `Dear ${vendor.name},

I hope this email finds you well. I'm following up regarding our previous discussion about photography services for my wedding on ${new Date(userData.weddingDate).toLocaleDateString()} at ${userData.location}.

I'm particularly interested in getting more details about your pricing packages. Could you please provide information about:
- Your package options and detailed pricing
- What each package includes
- Any available add-ons or customization options
- Current booking availability for our date

Thank you for your time. I look forward to your response.

Best regards,
${userData.name}`
  }

  const handleConfirm = () => {
    setEmailDraft(generateEmailDraft())
    setStep("draft")
  }

  const handleSend = () => {
    // In a real app, this would send the email
    console.log("Sending email:", emailDraft)
    onOpenChange(false)
    setStep("confirm")
  }

  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent className="max-w-2xl" aria-describedby={`${dialogId}-desc`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Communication Assistant
          </DialogTitle>
          <DialogDescription id={`${dialogId}-desc`}>
            Let me help you draft a professional email to {vendor.name}
          </DialogDescription>
        </DialogHeader>

        {step === "confirm" && (
          <div className="space-y-4 pt-4">
            <p>
              {vendor.contacted
                ? `Hi ${userData.name}! I notice you're in discussions with ${vendor.name}. I can help you draft a follow-up email about ${vendor.nextStep?.toLowerCase() || "your ongoing conversation"}. Would you like me to help with that?`
                : `Hi ${userData.name}! I can help you draft an initial email to ${vendor.name} to inquire about their package pricing and included services. Would you like me to help with that?`}
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Yes, Draft Email</Button>
            </div>
          </div>
        )}

        {(step === "draft" || step === "edit") && (
          <div className="space-y-4 pt-4">
            <Textarea
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              className="min-h-[300px] font-mono"
            />
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setStep("edit")}>
                Edit Draft
              </Button>
              <Button onClick={handleSend}>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

