import Link from 'next/link';
import { notFound } from 'next/navigation';

import Layout from '@/components/layout';
import PostContent from '@/features/posts';
import { getPostData } from '@/lib/posts';

interface PostProps {
  params: Promise<{
    post: string;
  }>;
}

export default async function PostDetailPage(props: PostProps) {
  const { post } = await props.params;
  const data = getPostData(post);

  if (!data) {
    return notFound();
  }

  return (
    <Layout>
      <PostContent data={data} />
      <Link href='/' className='leading-8 font-extrabold'>
        🔙 {'홈으로가기'}
      </Link>
    </Layout>
  );
}
