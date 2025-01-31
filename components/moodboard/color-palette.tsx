import { Card, CardContent } from "@/components/ui/card"
import type { ColorPalette } from "@/types/moodboard"

interface ColorPaletteDisplayProps {
  palette: ColorPalette
}

export function ColorPaletteDisplay({ palette }: ColorPaletteDisplayProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-2">
          <div className="h-20 w-20 rounded-lg" style={{ backgroundColor: palette.primary }} />
          <div className="h-20 w-20 rounded-lg" style={{ backgroundColor: palette.secondary }} />
          <div className="flex flex-wrap gap-2">
            {palette.accent.map((color, index) => (
              <div key={index} className="h-9 w-9 rounded-lg" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

