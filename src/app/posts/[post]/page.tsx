import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';

import Layout from '@/components/layout';
import PostContent from '@/features/posts';
import type Resume from '@/interface/profile';
import { getAllPostIds, getPostData } from '@/lib/posts';

export default function PostDetailPage({ data }: { data: Resume }) {
  return (
    <Layout>
      <PostContent data={data} />
      <Link href='/' className='leading-8 font-extrabold'>
        🔙 {'홈으로가기'}
      </Link>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  const paths = getAllPostIds();
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = ({ params }) => {
  const data = getPostData(params?.post as string);
  return { props: { data } };
};
