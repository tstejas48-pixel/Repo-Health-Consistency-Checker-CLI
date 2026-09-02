import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { repositories, analyses, checks } from '@/db/schema';
import { RepositoryAnalyzer } from '@/lib/analyzer';
import { parseUploadedFiles } from '@/lib/repo-parser';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const repoName = formData.get('repoName') as string || 'Uploaded Repository';
    const configStr = formData.get('config') as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Parse configuration
    let config = {};
    if (configStr) {
      try {
        config = JSON.parse(configStr);
      } catch (e) {
        console.error('Failed to parse config:', e);
      }
    }

    // Create repository record
    const [repository] = await db.insert(repositories).values({
      name: repoName,
      type: 'upload',
    }).returning();

    // Create analysis record
    const [analysis] = await db.insert(analyses).values({
      repositoryId: repository.id,
      healthScore: 0,
      status: 'running',
      config: config as any,
    }).returning();

    // Parse uploaded files
    const repoData = await parseUploadedFiles(files);

    // Run analysis
    const analyzer = new RepositoryAnalyzer(config as any);
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
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
