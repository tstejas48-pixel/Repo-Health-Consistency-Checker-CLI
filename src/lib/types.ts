export type CheckSeverity = 'error' | 'warning' | 'info' | 'success';

export interface CheckResult {
  checkType: string;
  category: string;
  severity: CheckSeverity;
  passed: boolean;
  message: string;
  details?: any;
  filePath?: string;
  lineNumber?: number;
  suggestion?: string;
}

export interface HealthCheckConfig {
  enabled?: boolean;
  checks?: {
    readme?: boolean;
    license?: boolean;
    tests?: boolean;
    commits?: boolean;
    dependencies?: boolean;
    gitignore?: boolean;
    ci?: boolean;
    linting?: boolean;
  };
  thresholds?: {
    minReadmeLength?: number;
    maxDependencyAge?: number;
    minTestCoverage?: number;
  };
  severity?: ('error' | 'warning' | 'info')[];
}

export interface AnalysisResult {
  healthScore: number;
  checks: CheckResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    errors: number;
    warnings: number;
    info: number;
  };
  metadata: {
    analyzedAt: string;
    duration: number;
    repositoryName: string;
  };
}

export interface FileContent {
  path: string;
  content: string;
}

export interface RepositoryData {
  files: FileContent[];
  commits?: any[];
  packageJson?: any;
  hasGit: boolean;
}
