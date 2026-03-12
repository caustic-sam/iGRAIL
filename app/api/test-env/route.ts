import { NextResponse } from 'next/server';
import { blockProductionDiagnostics } from '@/lib/route-guards';

export async function GET() {
  // We only expose this lightweight environment check during development.
  const blockedResponse = blockProductionDiagnostics('/api/test-env');
  if (blockedResponse) {
    return blockedResponse;
  }

  return NextResponse.json({
    hasUrl: !!process.env.FRESHRSS_API_URL,
    hasUsername: !!process.env.FRESHRSS_API_USERNAME,
    hasPassword: !!process.env.FRESHRSS_API_PASSWORD,
    url: process.env.FRESHRSS_API_URL?.substring(0, 30) + '...',
  });
}
