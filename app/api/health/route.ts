import { NextResponse } from 'next/server';

/**
 * Health check endpoint for Docker and monitoring systems
 *
 * Returns 200 OK with basic service status information
 * Used by docker-compose.yml health checks
 *
 * @route GET /api/health
 */
export async function GET() {
  try {
    // Basic health check - can be expanded to check:
    // - Database connectivity
    // - External API availability
    // - Redis/cache status
    // - Disk space
    // - Memory usage

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'igrail',
      version: process.env.npm_package_version || '0.2.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    // If anything fails, return 503 Service Unavailable
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
