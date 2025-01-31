import { Button } from "@/components/ui/button"
import { Instagram, PinIcon as Pinterest, Upload } from 'lucide-react'

export function AuthButtons() {
  const handlePinterestAuth = () => {
    // In a real app, this would initiate OAuth flow
    console.log("Authenticating with Pinterest...")
  }

  const handleInstagramAuth = () => {
    // In a real app, this would initiate OAuth flow
    console.log("Authenticating with Instagram...")
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Button 
        variant="outline" 
        className="bg-white"
        onClick={handlePinterestAuth}
      >
        <Pinterest className="mr-2 h-4 w-4 text-red-600" />
        Connect Pinterest
      </Button>
      <Button 
        variant="outline" 
        className="bg-white"
        onClick={handleInstagramAuth}
      >
        <Instagram className="mr-2 h-4 w-4 text-pink-600" />
        Connect Instagram
      </Button>
      <Button variant="outline" className="bg-white">
        <Upload className="mr-2 h-4 w-4" />
        Upload Images
      </Button>
    </div>
  )
}

