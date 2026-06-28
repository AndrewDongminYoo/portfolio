import type Resume from '@/interface/profile';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';
import { getPostData } from '@/lib/posts';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Dongmin Yu — portfolio';

const EYEBROW: Record<Resume['type'], string> = {
  project: 'PROJECT',
  experience: 'EXPERIENCE',
  activity: 'ACTIVITY',
  education: 'EDUCATION',
};

export default async function Image({ params }: { params: Promise<{ post: string }> }) {
  const { post } = await params;

  try {
    const data = getPostData(post);
    const description = Array.isArray(data.description) ? data.description[0] : data.description;

    return await renderOgImage({
      eyebrow: EYEBROW[data.type] ?? 'PORTFOLIO',
      title: data.title || data.name,
      subtitle: description,
    });
  } catch {
    return await renderOgImage({ eyebrow: 'PORTFOLIO', title: 'Dongmin Yu' });
  }
}
