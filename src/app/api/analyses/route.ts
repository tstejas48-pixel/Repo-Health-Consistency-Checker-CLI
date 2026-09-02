import { NextResponse } from 'next/server';
import { db } from '@/db';
import { analyses, repositories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allAnalyses = await db
      .select({
        id: analyses.id,
        healthScore: analyses.healthScore,
        status: analyses.status,
        createdAt: analyses.createdAt,
        completedAt: analyses.completedAt,
        repositoryId: analyses.repositoryId,
        repositoryName: repositories.name,
        repositoryType: repositories.type,
      })
      .from(analyses)
      .leftJoin(repositories, eq(analyses.repositoryId, repositories.id))
      .orderBy(desc(analyses.createdAt))
      .limit(50);

    return NextResponse.json({ analyses: allAnalyses });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
