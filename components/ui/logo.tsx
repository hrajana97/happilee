import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ 
  className = "w-8 h-8",
  showText = true 
}: { 
  className?: string
  showText?: boolean 
}) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <Image src="/logo.png" alt="Happilee Logo" width={32} height={32} className={className} />
      {showText && (
        <span className="text-xl font-medium text-sage-900">happilee</span>
      )}
    </Link>
  )
}

