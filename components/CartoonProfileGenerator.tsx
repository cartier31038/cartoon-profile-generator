'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { generateCaption, generateImg2Img } from '@/utils/ai'
import { motion } from 'framer-motion'
import { useState } from 'react'
import ImageResultGrid from './ImageResultGrid'
import ImageUploader from './ImageUploader'

export default function CartoonProfileGenerator() {
    const [prompt, setPrompt] = useState('')
    const [uploadedImage, setUploadedImage] = useState<string>('')
    const [results, setResults] = useState<string[]>([])
    const [debug, setDebug] = useState('-')
    const [isLoading, setIsLoading] = useState(false)

    const handleGenerate = () => {
        setIsLoading(true)

        setTimeout(async () => {
            const caption = await generateCaption(prompt, uploadedImage)
            setDebug(caption)

            // await generateImg2Img(caption, uploadedImage)
            // setResults([
            //     '/images/profile-placeholder.svg',
            //     '/images/profile-placeholder.svg',
            //     '/images/profile-placeholder.svg',
            //     '/images/profile-placeholder.svg',
            // ])

            const result = await generateImg2Img(caption, uploadedImage)
            setResults([...results, ...result.images])
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
                <div className="flex flex-row gap-4 mb-4">
                    <div className="w-[35%]">
                        <Card className="p-3 w-full bg-gray-200 bg-opacity-30">
                            <img
                                src={
                                    uploadedImage
                                        ? `data:image/png;base64,${uploadedImage}`
                                        : '/images/profile-placeholder.svg'
                                }
                                alt="Uploaded"
                                className="w-full h-full object-contain rounded p-4"
                            />
                            <Button
                                onClick={handleGenerate}
                                disabled={!uploadedImage || isLoading}
                                className="mt-6 w-full sm:w-auto sm:px-8 mx-auto block futuristic-text rounded-futuristic-sm"
                            >
                                {isLoading ? 'Creating...' : 'Generate'}
                            </Button>
                        </Card>
                    </div>
                    <div className="w-[65%]">
                        <Input
                            placeholder="Enter your style (e.g. cute, cool)"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="mb-4 text-sm futuristic-text rounded-futuristic-sm text-gray-700"
                        />
                        <ImageUploader onImageUpload={setUploadedImage} />
                    </div>
                </div>

                <p className="mt-4 text-sm text-gray-500 text-center">
                    Caption: {debug}
                </p>
            </Card>
            <ImageResultGrid results={results} />
        </motion.div>
    )
}
