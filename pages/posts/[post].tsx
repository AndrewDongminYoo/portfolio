import type { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPostIds, getPostData } from 'lib/posts';
import Layout from 'components/layout';
import PostContent from 'components/posts';
import type Resume from 'types/profile';

export default function PostDetailPage({ data }: { data: Resume }) {
  return (
    <Layout title={data.title}>
      <PostContent data={data} />
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
