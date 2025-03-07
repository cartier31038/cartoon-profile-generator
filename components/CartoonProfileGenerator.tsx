'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ImageUploader from './ImageUploader'
import ResultGrid from './ResultGrid'

export default function CartoonProfileGenerator() {
  const [prompt, setPrompt] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)
    // TODO: Implement API call to generate images
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
    setResults(['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'])
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <Card className="p-6 backdrop-blur-lg bg-white/10 shadow-xl rounded-futuristic border border-white/20">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-600 futuristic-text">Cartoon Profile Generator</h1>
        <Input
          placeholder="Enter your style (e.g. cute, cool)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-4 text-sm futuristic-text rounded-futuristic-sm text-gray-700"
        />
        <ImageUploader onImageUpload={setUploadedImage} />
        {uploadedImage && (
          <Card className="mt-4 p-4 w-48 h-48 mx-auto">
            <img src={uploadedImage || "/placeholder.svg"} alt="Uploaded" className="w-full h-full object-cover rounded" />
          </Card>
        )}
        <Button
          onClick={handleGenerate}
          disabled={!uploadedImage || isLoading}
          className="mt-6 w-full sm:w-auto sm:px-8 mx-auto block futuristic-text rounded-futuristic-sm"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
      </Card>
      <ResultGrid results={results} />
    </motion.div>
  )
}

