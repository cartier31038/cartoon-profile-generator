'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { ImageIcon, Download } from 'lucide-react'

interface ResultGridProps {
  results: string[]
}

export default function ResultGrid({ results }: ResultGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {results.length > 0
        ? results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="aspect-square overflow-hidden">
                <img src={result || "/placeholder.svg"} alt={`Result ${index + 1}`} className="w-full h-full object-cover" />
              </Card>
            </motion.div>
          ))
        : Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="aspect-square flex items-center justify-center bg-gray-100 relative rounded-futuristic-sm">
              <ImageIcon className="h-12 w-12 text-gray-400" />
              <button className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </Card>
          ))}
    </div>
  )
}

