import { CheckResult, CheckSeverity, RepositoryData } from '../types';

export abstract class BaseChecker {
  protected name: string;
  protected category: string;

  constructor(name: string, category: string) {
    this.name = name;
    this.category = category;
  }

  abstract check(repo: RepositoryData): Promise<CheckResult[]>;

  protected createResult(
    checkType: string,
    passed: boolean,
    message: string,
    severity: CheckSeverity,
    options?: {
      details?: any;
      filePath?: string;
      lineNumber?: number;
      suggestion?: string;
    }
  ): CheckResult {
    return {
      checkType,
      category: this.category,
      severity,
      passed,
      message,
      ...options,
    };
  }

  protected findFile(repo: RepositoryData, pattern: string | RegExp): FileContent | undefined {
    if (typeof pattern === 'string') {
      return repo.files.find(f => f.path.toLowerCase() === pattern.toLowerCase());
    }
    return repo.files.find(f => pattern.test(f.path));
  }

  protected findFiles(repo: RepositoryData, pattern: string | RegExp): FileContent[] {
    if (typeof pattern === 'string') {
      return repo.files.filter(f => f.path.toLowerCase().includes(pattern.toLowerCase()));
    }
    return repo.files.filter(f => pattern.test(f.path));
  }
}

interface FileContent {
  path: string;
  content: string;
}
