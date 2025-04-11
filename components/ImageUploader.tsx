'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploaderProps {
    onImageUpload: (image: string) => void
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            const base64Image = await convertFileToBase64(file)
            onImageUpload(base64Image)
        },
        [onImageUpload],
    )

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        noClick: true,
        noKeyboard: true,
    })

    async function convertFileToBase64(file: File): Promise<string> {
        const blobUrl = URL.createObjectURL(file)
        const response = await fetch(blobUrl)
        const blob = await response.blob()
        const uint8Array = new Uint8Array(await blob.arrayBuffer())
        const binaryString = Array.from(uint8Array)
            .map((byte) => String.fromCharCode(byte))
            .join('')
        return btoa(binaryString)
    }

    return (
        <motion.div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-futuristic p-8 text-center ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-700" />
            <p className="mt-2 text-sm text-gray-700 futuristic-text">
                Drag and drop a your reference image here, or click to select
            </p>
            <Button
                onClick={open}
                variant="outline"
                className="mt-4 futuristic-text rounded-futuristic-sm"
            >
                Browse Gallery
            </Button>
        </motion.div>
    )
}
