import { GoogleGenerativeAI, Part } from '@google/generative-ai'
import axios from 'axios'

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ?? ''
const SD_API_URL = process.env.SD_API_URL ?? ''

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY)

interface GenerateImageOptions {
    prompt: string
    negative_prompt?: string
    batch_size?: number
    n_iter?: number
    steps?: number
    cfg_scale?: number
    width?: number
    height?: number
    restore_faces?: boolean
    tiling?: boolean
    seed?: number
    subseed?: number
    subseed_strength?: number
    sampler_index?: string
    save_images?: boolean
    send_images?: boolean
    denoising_strength?: number
}

interface Img2ImgOptions extends GenerateImageOptions {
    init_images: string[]
    include_init_images?: boolean
}

interface GenerateImageResponse {
    images: string[]
}

export async function generateCaption(
    userPrompt: string,
    image: string | Uint8Array,
): Promise<string> {
    try {
        // Create a model instance
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

        const systemPrompt = `
  You are tool for image captioning and generate prompt for Stable Diffusion AnyLoRA.

  Example prompt: (young Asian woman:1.5), (25 years old:1.3), (oval face:1.3), (clear skin:1.3), (warm complexion:1.2), (bright almond-shaped eyes:1.4), (natural makeup:1.2), (defined eyebrows:1.2), (friendly smile:1.3), (straight white teeth:1.2), (small nose:1.2), (black hair pulled back:1.4), (neat bun hairstyle:1.3), (slender neck:1.2), (light beige hooded t-shirt:1.3), (small yellow pin on shirt:1.2), (good posture:1.3), (small tattoo on left arm:1.1), (professional appearance:1.3)

  Please suggest a prompt for Stable Diffusion from the attached image and describe only the person's appearance in as much detail as you can, without including the background.
  `

        // Prepare the content parts
        const parts: Part[] = [{ text: userPrompt }, { text: systemPrompt }]

        if (typeof image === 'string') {
            console.log('promptWithLLM.image.string')
            parts.push({
                inlineData: extractCleanBase64(image),
            })
        } else {
            console.log('promptWithLLM.image.binary')
            parts.push({
                inlineData: {
                    data: Buffer.from(image).toString('base64'),
                    mimeType: 'image/jpeg',
                },
            })
        }
        const contents = [{ role: 'user', parts }]
        console.log('promptWithLLM.contents', contents)

        // Generate content
        const result = await model.generateContent({ contents })

        const responseText = result.response.text()

        return `
(best quality:1.5), (white background:1.5), (solo:1.4), (upper body:1.4), (looking at viewer:1.4),
${responseText}
<lora:last:0.9>
`
    } catch (error) {
        console.error('promptWithLLM.error:', error)
        throw error
    }
}

function extractCleanBase64(uri: string) {
    const matches = uri.match(/^data:.+\/(.+);base64,(.*)$/)
    if (!matches || matches.length < 3) {
        throw new Error('Invalid data URI format')
    }
    return {
        mimeType: `image/${matches[1]}`,
        data: matches[2],
    }
}

export async function generateImage(
    prompt: string,
    options?: Partial<GenerateImageOptions>,
): Promise<GenerateImageResponse> {
    const url = `${SD_API_URL}/sdapi/v1/txt2img`
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    console.log(`generate_image.prompt: ${prompt}`)

    const defaultOptions: GenerateImageOptions = {
        prompt,
        negative_prompt:
            'lowres, blurry, worst quality, low quality, normal quality, many people, bad anatomy, bad hands, missing fingers, error, text, username, extra digit, fewer digits, signature, watermark, cropped, jpeg artifacts, detailed background, glitch rim',
        batch_size: 1,
        n_iter: 1,
        steps: 30,
        cfg_scale: 7,
        width: 512,
        height: 512,
        restore_faces: false,
        tiling: false,
        seed: -1,
        subseed: -1,
        subseed_strength: 0,
        sampler_index: 'Euler a',
        save_images: false,
        send_images: true,
        denoising_strength: 0.75,
    }

    const data = { ...defaultOptions, ...options }

    try {
        const response = await axios.post(url, data, { headers })
        console.log(`generate_image.response.code: ${response.status}`)
        return response.data
    } catch (error) {
        console.error('generate_image.error:', error)
        throw error
    }
}

export async function generateImg2Img(
    prompt: string,
    encodedImage: string,
    options?: Partial<Omit<Img2ImgOptions, 'init_images'>>,
): Promise<GenerateImageResponse> {
    const url = `${SD_API_URL}/sdapi/v1/img2img`
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    console.log(`generate_img2img.prompt: ${prompt}`)

    const defaultOptions: Img2ImgOptions = {
        prompt,
        negative_prompt:
            'lowres, blurry, worst quality, low quality, normal quality, many people, bad anatomy, bad hands, missing fingers, error, text, username, extra digit, fewer digits, signature, watermark, cropped, jpeg artifacts, detailed background, glitch rim',
        batch_size: 1,
        n_iter: 1,
        steps: 80,
        cfg_scale: 15,
        width: 512,
        height: 768,
        restore_faces: false,
        tiling: false,
        seed: -1,
        subseed: -1,
        subseed_strength: 0,
        sampler_index: 'Euler a',
        save_images: false,
        send_images: true,
        denoising_strength: 0.8,
        include_init_images: true,
        init_images: [encodedImage],
    }

    const data = { ...defaultOptions, ...options }

    try {
        const response = await axios.post(url, data, { headers })
        console.log(`generate_img2img.response.code: ${response.status}`)
        return response.data
    } catch (error) {
        console.error('generate_img2img.error:', error)
        throw error
    }
}
