import type { Metadata } from 'next';

import Layout from '@/components/layout';
import InsightsDashboard from '@/features/insights/insights-dashboard';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function InsightsPage() {
  return (
    <Layout>
      <InsightsDashboard />
    </Layout>
  );
}
