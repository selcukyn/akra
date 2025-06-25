import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// public klasörü kök dizindedir
const wallpapersDir = path.join(process.cwd(), 'public', 'wallpapers');

export async function GET() {
  // Sadece görsel dosyalarını (jpg, png, webp, jpeg) al
  const allowedExts = /\.(jpe?g|png|webp)$/i;
  let files: string[] = [];
  try {
    files = fs.readdirSync(wallpapersDir)
      .filter(file => allowedExts.test(file))
      .map(file => `/wallpapers/${file}`);
  } catch (e) {
    files = [];
  }
  return NextResponse.json(files);
}
