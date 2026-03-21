import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

let r2Client: S3Client | null = null

function getR2Client(): S3Client {
  if (!r2Client) {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  }
  return r2Client
}

export function getBucketName(): string {
  return process.env.R2_BUCKET_NAME || 'phonezoo'
}

export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-7cafaf04d6324dc1acc356106790287a.r2.dev'

// AI-generated ringtones go to a distinct path from phonezoo-next's ringtones/ai/
export const AI_GENERATED_PATH = 'ringtones/ai-generated'

export async function uploadGeneratedAudio(
  audioBuffer: Buffer,
  jobId: string
): Promise<{ key: string; url: string; sizeKb: number }> {
  const key = `${AI_GENERATED_PATH}/${jobId}.mp3`

  await getR2Client().send(new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    Body: audioBuffer,
    ContentType: 'audio/mpeg',
    CacheControl: 'public, max-age=31536000',
  }))

  return {
    key,
    url: getPublicUrl(key),
    sizeKb: Math.round(audioBuffer.length / 1024),
  }
}

export function getPublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL || R2_PUBLIC_URL
  return `${base}/${key}`
}
