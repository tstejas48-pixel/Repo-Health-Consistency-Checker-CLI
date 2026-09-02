import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { analyses, checks, repositories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [analysis] = await db
      .select()
      .from(analyses)
      .where(eq(analyses.id, id))
      .limit(1);

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    const analysisChecks = await db
      .select()
      .from(checks)
      .where(eq(checks.analysisId, id));

    const [repository] = await db
      .select()
      .from(repositories)
      .where(eq(repositories.id, analysis.repositoryId))
      .limit(1);

    return NextResponse.json({
      analysis,
      checks: analysisChecks,
      repository,
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
