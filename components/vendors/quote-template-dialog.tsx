"use client"

import * as React from "react"
import { Copy, Mail, Send, ThumbsDown, ThumbsUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { storage } from "@/lib/storage"

interface QuoteTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vendor: {
    name: string
    category: string
    email?: string
  }
  onShowAIContact?: () => void
  onSaveTemplate?: (template: string) => void
}

// Updated templates with placeholder for photographer name
const templateTypes = {
  musician: [
    {
      id: "full-service",
      name: "Full Service Package",
      template: (userData: any, vendor: any) => `Dear ${vendor.name},

I hope this email finds you well. My name is ${userData.name}, and I'm reaching out regarding entertainment services for our upcoming wedding.

We're getting married on ${new Date(userData.weddingDate).toLocaleDateString()} in ${
        userData.location
      }, and we're interested in booking entertainment for our ceremony and reception. We're looking for:

- Ceremony music
- Cocktail hour entertainment
- Reception/dance music
- Professional sound system and lighting
- MC services if available

Could you please provide information about:
1. Your package options and pricing
2. Your availability for our date
3. What's included in each package (equipment, setup, etc.)
4. Your song list/repertoire
5. Any additional services you offer (lighting, etc.)

We'd love to schedule a consultation to discuss our vision and musical preferences in detail.

Thank you for your time. I look forward to hearing from you.

Best regards,
${userData.name}`,
    },
  ],
  caterer: [
    {
      id: "full-service",
      name: "Full Service Package",
      template: (userData: any, vendor: any) => `Dear ${vendor.name},

I hope this email finds you well. My name is ${userData.name}, and I'm reaching out regarding catering services for our upcoming wedding.

We're getting married on ${new Date(userData.weddingDate).toLocaleDateString()} in ${
        userData.location
      }, and we're interested in learning more about your catering services. We're looking for:

- Full-service catering for approximately ${userData.guestCount || "[guest count]"} guests
- Appetizers/cocktail hour
- Main course options
- Bar service if available
- Staff and equipment

Could you please provide information about:
1. Your package options and pricing per person
2. Your availability for our date
3. Sample menus and customization options
4. Dietary accommodation options
- Minimum guest count requirements
5. What's included (staff, rentals, setup, etc.)

We'd love to schedule a tasting and consultation to discuss our preferences in detail.

Thank you for your time. I look forward to hearing from you.

Best regards,
${userData.name}`,
    },
  ],
  venue: [
    // Venue templates
    {
      id: "ceremony-venue",
      name: "Ceremony Venue",
      template: (userData: any, vendor: any) => `Dear ${vendor.name},

I'm writing to inquire about your venue for our wedding ceremony.  We're planning to get married on ${new Date(
        userData.weddingDate,
      ).toLocaleDateString()} and are expecting approximately ${
        userData.guestCount || "[Number]"
      } guests.  We're interested in learning more about:

* Availability on ${new Date(userData.weddingDate).toLocaleDateString()}
* Capacity for our guest count
* Ceremony space options and pricing
* Any available add-ons (e.g., chairs, decor)

Thank you for your time and consideration.

Sincerely,
${userData.name}`,
    },
    {
      id: "reception-venue",
      name: "Reception Venue",
      template: (userData: any, vendor: any) => `Dear ${vendor.name},

I'm writing to inquire about your venue for our wedding reception.  We're planning our reception on ${new Date(
        userData.weddingDate,
      ).toLocaleDateString()} and are expecting approximately ${
        userData.guestCount || "[Number]"
      } guests.  We're interested in learning more about:

* Availability on ${new Date(userData.weddingDate).toLocaleDateString()}
* Capacity for our guest count
* Reception space options and pricing (including catering options if available)
* Rental fees and what's included
* Available time slots

Thank you for your time and consideration.

Sincerely,
${userData.name}`,
    },
  ],
  photographer: [
    {
      id: "full-service",
      name: "Full Service Package",
      template: (userData: any, vendor: any) => `Dear ${vendor.name},

I hope this email finds you well. My name is ${userData.name}, and I'm reaching out regarding photography services for our upcoming wedding.

We're getting married on ${new Date(userData.weddingDate).toLocaleDateString()} in ${userData.location}, and we're interested in learning more about your photography services. We're looking for:

- Full day wedding coverage
- Engagement session (if available)
- Digital files with printing rights
- Second photographer options
- Album options

Could you please provide information about:
1. Your package options and pricing
2. Your availability for our date
3. Typical turnaround time for photos
4. Your photography style and approach
5. Sample galleries from recent weddings

We'd love to schedule a consultation to discuss our vision and see more of your work.

Thank you for your time. I look forward to hearing from you.

Best regards,
${userData.name}`,
    },
  ],
  videographer: [
    {
      id: "full-service",
      name: "Full Service Package",
      template: (userData: any, vendor: any) => `Dear ${vendor.name},

I hope this email finds you well. My name is ${userData.name}, and I'm reaching out regarding videography services for our upcoming wedding.

We're getting married on ${new Date(userData.weddingDate).toLocaleDateString()} in ${userData.location}, and we're interested in learning more about your videography services. We're looking for:

- Full day wedding coverage
- Highlight film
- Full ceremony coverage
- Raw footage options
- Drone coverage (if available)

Could you please provide information about:
1. Your package options and pricing
2. Your availability for our date
3. Typical turnaround time for videos
4. Your filming and editing style
5. Sample wedding films from recent events

We'd love to schedule a consultation to discuss our vision and see more of your work.

Thank you for your time. I look forward to hearing from you.

Best regards,
${userData.name}`,
    },
  ],
}

export function QuoteTemplateDialog({
  open,
  onOpenChange,
  vendor,
  onShowAIContact,
  onSaveTemplate,
}: QuoteTemplateDialogProps) {
  const [templateType, setTemplateType] = React.useState("")
  const [customTemplateType, setCustomTemplateType] = React.useState("")
  const [emailContent, setEmailContent] = React.useState("")
  const [vendorEmail, setVendorEmail] = React.useState(vendor.email || "")
  const [showFeedback, setShowFeedback] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [showAddTemplate, setShowAddTemplate] = React.useState(false)

  const userData = React.useMemo(() => storage.getUserData(), [])
  const dialogId = React.useId()

  React.useEffect(() => {
    if (open && templateType) {
      const normalizedCategory = vendor.category.toLowerCase().replace(/s$/, "")
      const template = templateTypes[normalizedCategory]?.find((t) => t.id === templateType)
      if (template) {
        setEmailContent(template.template(userData, vendor))
      }
    }
  }, [open, templateType, userData, vendor])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailContent)
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "The email template has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSend = async () => {
    try {
      // In a real app, this would send the email through a backend service
      console.log("Sending email to:", vendorEmail)
      console.log("Content:", emailContent)

      toast({
        title: "Email sent",
        description: "Your quote request has been sent successfully.",
      })
      setShowFeedback(true)
      // After feedback, show AI contact dialog
      if (onShowAIContact) {
        onShowAIContact()
      }
      onOpenChange(false)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFeedback = (helpful: boolean) => {
    // In a real app, this would send feedback to the backend
    toast({
      title: "Thank you for your feedback!",
      description: "We'll use this to improve our templates.",
    })
    setShowFeedback(false)
    onOpenChange(false)
  }

  const handleSaveTemplate = () => {
    if (onSaveTemplate) {
      onSaveTemplate(emailContent)
    }
    toast({
      title: "Template saved!",
      description: "Your custom template has been saved.",
    })
  }

  const handleAddTemplateType = () => {
    if (!customTemplateType) return

    const newTemplate = {
      id: customTemplateType.toLowerCase().replace(/\s+/g, "-"),
      name: customTemplateType,
      template: (userData: any, vendor: any) =>
        `Dear ${vendor.name || "[Vendor Name]"},

      [Your custom template content here]

      Sincerely,
      ${userData.name}`,
    }

    templateTypes[vendor.category.toLowerCase()] = [
      ...(templateTypes[vendor.category.toLowerCase()] || []),
      newTemplate,
    ]

    setTemplateType(newTemplate.id)
    setCustomTemplateType("")
    setShowAddTemplate(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" aria-describedby={`${dialogId}-description`}>
        <DialogHeader>
          {/* Removed DialogTitle */}
          <DialogDescription id={`${dialogId}-description`}>
            Customize your quote request email below. Choose a template to start, or create your own from scratch.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2 w-full">
            <Label>Template Type</Label>
            <div className="flex items-center gap-2">
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a template type" />
                </SelectTrigger>
                <SelectContent>
                  {templateTypes[vendor.category.toLowerCase().replace(/s$/, "")]?.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" onSelect={() => setShowAddTemplate(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Template
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setShowAddTemplate(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {templateType && (
              <p className="text-sm text-muted-foreground">
                {templateTypes[vendor.category.toLowerCase()]?.find((t) => t.id === templateType)?.description ||
                  "Customize this template with your specific requirements."}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Email Content</Label>
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </div>

          <div className="grid gap-2">
            <Label>Vendor Email</Label>
            <Input
              type="email"
              value={vendorEmail}
              onChange={(e) => setVendorEmail(e.target.value)}
              placeholder="Enter vendor's email address"
            />
          </div>

          {showFeedback ? (
            <div className="flex flex-col items-center gap-4 pt-4">
              <p className="text-center text-sage-600">Was this template helpful?</p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => handleFeedback(true)}>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Yes
                </Button>
                <Button variant="outline" onClick={() => handleFeedback(false)}>
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  No
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button onClick={handleSend} disabled={!vendorEmail || !emailContent}>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" onClick={handleSaveTemplate}>
                Save Template
              </Button>
            </div>
          )}
        </div>

        <Dialog open={showAddTemplate} onOpenChange={setShowAddTemplate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Template Type</DialogTitle>
              <DialogDescription>Create a new template type for {vendor.category} vendors.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="customTemplateType">Template Name</Label>
                <Input
                  id="customTemplateType"
                  placeholder="e.g., Destination Wedding Package"
                  value={customTemplateType}
                  onChange={(e) => setCustomTemplateType(e.target.value)}
                />
              </div>
              <Button onClick={handleAddTemplateType}>Add Template Type</Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}

