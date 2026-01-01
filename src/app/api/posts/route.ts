import { NextRequest, NextResponse } from 'next/server';

import { getPostData, getSortedPostsData } from '@/lib/posts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (id) {
    const data = getPostData(id);
    return NextResponse.json(data);
  }

  const postData = getSortedPostsData();
  return NextResponse.json({ postData });
}
