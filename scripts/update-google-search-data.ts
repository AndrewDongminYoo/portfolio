import { fetchSearchConsoleSnapshot } from '@/lib/insights/gsc';
import { saveSearchConsoleSnapshot } from '@/lib/insights/storage';

async function main() {
  const result = await fetchSearchConsoleSnapshot();
  if (result.ok) {
    await saveSearchConsoleSnapshot(result.data);
  }

  console.log(`✅ Updated`, JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error('❌ Failed to fetch search console data', err);
  process.exit(1);
});
