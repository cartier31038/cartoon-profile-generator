'use client'

import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Download, ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ResultGridProps {
    results: string[]
}

export default function ResultGrid({ results }: ResultGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {results.map((result, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <Card className="overflow-hidden">
                        <Image
                            src={
                                `data:image/png;base64,${result}` ||
                                '/placeholder.svg'
                            }
                            alt={`Result ${index + 1}`}
                            className="w-full h-full object-cover"
                            width={512}
                            height={768}
                        />
                    </Card>
                </motion.div>
            ))}
            {Array.from({ length: Math.max(0, 4 - results.length) }).map(
                (_, index) => (
                    <Card
                        key={`placeholder-${index}`}
                        className="aspect-[2/3] flex items-center justify-center bg-gray-100 relative rounded-futuristic-sm"
                    >
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                        <button className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                            <Download className="h-4 w-4 text-gray-600" />
                        </button>
                    </Card>
                ),
            )}
        </div>
    )
}
