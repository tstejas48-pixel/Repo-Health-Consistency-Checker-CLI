import { NextResponse } from 'next/server';
import { db } from '@/db';
import { repositories, analyses, checks } from '@/db/schema';
import { RepositoryAnalyzer } from '@/lib/analyzer';
import { createMockRepository } from '@/lib/repo-parser';
import { eq } from 'drizzle-orm';

export async function POST() {
  try {
    const repoName = 'Demo Sample Project';

    // Create repository record
    const [repository] = await db.insert(repositories).values({
      name: repoName,
      type: 'demo',
    }).returning();

    // Create analysis record
    const [analysis] = await db.insert(analyses).values({
      repositoryId: repository.id,
      healthScore: 0,
      status: 'running',
      config: {},
    }).returning();

    // Get mock repository data
    const repoData = createMockRepository();

    // Run analysis
    const analyzer = new RepositoryAnalyzer();
    const result = await analyzer.analyze(repoData, repoName);

    // Update analysis with results
    const [updatedAnalysis] = await db.update(analyses)
      .set({
        healthScore: result.healthScore,
        status: 'completed',
        results: result as any,
        completedAt: new Date(),
      })
      .where(eq(analyses.id, analysis.id))
      .returning();

    // Store individual checks
    for (const check of result.checks) {
      await db.insert(checks).values({
        analysisId: analysis.id,
        checkType: check.checkType,
        severity: check.severity,
        passed: check.passed,
        message: check.message,
        details: check.details as any,
        filePath: check.filePath,
        lineNumber: check.lineNumber,
      });
    }

    return NextResponse.json({
      success: true,
      analysisId: analysis.id,
      result,
    });
  } catch (error) {
    console.error('Demo analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
