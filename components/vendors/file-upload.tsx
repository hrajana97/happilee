'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileText, ImageIcon } from 'lucide-react'

interface FileUploadProps {
  onUpload: (files: File[]) => void
}

interface UploadingFile {
  file: File
  progress: number
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0
    }))
    setUploadingFiles(prev => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach(uploadingFile => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadingFiles(prev =>
          prev.map(f =>
            f.file === uploadingFile.file
              ? { ...f, progress }
              : f
          )
        )
        if (progress >= 100) {
          clearInterval(interval)
          onUpload([uploadingFile.file])
        }
      }, 300)
    })
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'image/*': ['.jpg', '.jpeg', '.png']
    }
  })

  const removeFile = (fileToRemove: File) => {
    setUploadingFiles(prev => prev.filter(f => f.file !== fileToRemove))
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive
            ? 'border-sage-400 bg-sage-50'
            : 'border-sage-200 hover:border-sage-300'
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-sage-400" />
        <p className="mt-2 text-sm text-sage-600">
          Drag and drop files here, or click to select files
        </p>
        <Button
          variant="link"
          className="mt-2 text-sage-600"
          onClick={e => e.stopPropagation()}
        >
          Learn more about supported file types
        </Button>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map(({ file, progress }) => (
            <div
              key={file.name}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              {file.type.includes('image')
                ? <ImageIcon className="h-8 w-8 text-sage-400" />
                : <FileText className="h-8 w-8 text-sage-400" />
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

