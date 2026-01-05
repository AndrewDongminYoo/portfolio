import { NextRequest, NextResponse } from 'next/server';

import { downloadJSON, fetchRepositories, fetchRepository } from '@/lib/repos';
import { readData, readRepositories } from '@/lib/repos/fs-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const isDevelopment = process.env.NODE_ENV !== 'production';

export async function GET(request: NextRequest) {
  const fullName = request.nextUrl.searchParams.get('full_name');
  if (fullName) {
    const [owner, repo] = fullName.split('/');
    const repository = isDevelopment ? await fetchRepository(owner, repo) : readData(repo);
    return NextResponse.json({ repository });
  }

  const repositories = isDevelopment ? await fetchRepositories() : readRepositories();
  return NextResponse.json({ repositories });
}

export async function POST() {
  if (!isDevelopment) {
    return NextResponse.json({ message: 'POST is only allowed in development.' }, { status: 405 });
  }

  const length = await downloadJSON();
  return NextResponse.json({ length });
}
