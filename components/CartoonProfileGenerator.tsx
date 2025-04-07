'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { generateCaption, generateImg2Img } from '@/utils/ai'
import { motion } from 'framer-motion'
import { useState } from 'react'
import ImageUploader from './ImageUploader'
import ResultGrid from './ResultGrid'

export default function CartoonProfileGenerator() {
    const [prompt, setPrompt] = useState('')
    const [uploadedImage, setUploadedImage] = useState<string>('')
    const [results, setResults] = useState<string[]>([])
    const [debug, setDebug] = useState('-')
    const [isLoading, setIsLoading] = useState(false)

    const handleGenerate = () => {
        setIsLoading(true)

        setTimeout(async () => {
            const caption = await generateCaption('', uploadedImage)
            setDebug(caption)

            // await generateImg2Img(caption, uploadedImage)
            // setResults([
            //     '/placeholder.svg',
            //     '/placeholder.svg',
            //     '/placeholder.svg',
            //     '/placeholder.svg',
            // ])

            const result = await generateImg2Img(caption, uploadedImage)
            setResults(result.images)
            setIsLoading(false)
        }, 250)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <Card className="p-6 backdrop-blur-lg bg-white/10 shadow-xl rounded-futuristic border border-white/20">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-600 futuristic-text">
                    Cartoon Profile Generator
                </h1>
                <Input
                    placeholder="Enter your style (e.g. cute, cool)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="mb-4 text-sm futuristic-text rounded-futuristic-sm text-gray-700"
                />
                <ImageUploader onImageUpload={setUploadedImage} />
                {uploadedImage && (
                    <Card className="mt-4 p-4 w-48 h-48 mx-auto">
                        <img
                            src={uploadedImage || '/placeholder.svg'}
                            alt="Uploaded"
                            className="w-full h-full object-contain rounded"
                        />
                    </Card>
                )}
                <Button
                    onClick={handleGenerate}
                    disabled={!uploadedImage || isLoading}
                    className="mt-6 w-full sm:w-auto sm:px-8 mx-auto block futuristic-text rounded-futuristic-sm"
                >
                    {isLoading ? 'Generating...' : 'Generate'}
                </Button>
                <p className="mt-4 text-sm text-gray-500 text-center">
                    Caption: {debug}
                </p>
            </Card>
            <ResultGrid results={results} />
        </motion.div>
    )
}
