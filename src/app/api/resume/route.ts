import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const RESUME_DIR = path.join(process.cwd(), 'public', 'resume');

type ResumeFileMeta = {
  filepath: string;
  filename: string;
  mtimeMs: number;
};

async function getLatestResume(): Promise<ResumeFileMeta | null> {
  const files = await readdir(RESUME_DIR).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  });

  const pdfFiles = files.filter((file) => file.toLowerCase().endsWith('.pdf'));
  if (!pdfFiles.length) {
    return null;
  }

  const stats = await Promise.all(
    pdfFiles.map(async (filename) => {
      const filepath = path.join(RESUME_DIR, filename);
      const fileStat = await stat(filepath);
      return {
        filepath,
        filename,
        mtimeMs: fileStat.mtimeMs,
      };
    }),
  );

  stats.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return stats[0];
}

export async function GET() {
  try {
    const latestResume = await getLatestResume();
    if (!latestResume) {
      return NextResponse.json(
        { message: 'Resume is not available yet. Upload an A4 PDF to public/resume.' },
        { status: 404 },
      );
    }

    const fileBuffer = await readFile(latestResume.filepath);
    const safeFileName = latestResume.filename.replace(/[^\w.-]/g, '_') || 'resume.pdf';
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'no-store, max-age=0',
        'Content-Disposition': `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodeURIComponent(latestResume.filename)}`,
      },
    });
  } catch (error) {
    console.error('Failed to serve resume pdf', error);
    return NextResponse.json(
      { message: 'Failed to retrieve resume PDF. Please try again later.' },
      { status: 500 },
    );
  }
}
