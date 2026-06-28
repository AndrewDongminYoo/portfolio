import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';
import { readData } from '@/lib/repos/fs-store';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Repository — Dongmin Yu';

export default async function Image({ params }: { params: Promise<{ repo: string }> }) {
  const { repo } = await params;

  try {
    const repository = readData(repo);

    return await renderOgImage({
      eyebrow: repository.language ? repository.language.toUpperCase() : 'REPOSITORY',
      title: repository.name,
      subtitle: repository.description ?? undefined,
    });
  } catch {
    return await renderOgImage({ eyebrow: 'REPOSITORY', title: repo });
  }
}
