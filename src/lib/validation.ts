import { ALLOWED_COMPONENTS } from './componentSchema';

export function validateGeneratedCode(code: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!code || code.trim().length === 0) {
    errors.push('Generated code is empty');
    return { isValid: false, errors };
  }

  if (!code.includes('export default')) {
    errors.push('Code must have a default export');
  }

  if (!code.includes('GeneratedUI')) {
    errors.push('Component must be named GeneratedUI');
  }

  const importMatch = code.match(/import\s+{([^}]+)}\s+from/);
  if (importMatch) {
    const imports = importMatch[1].split(',').map(i => i.trim());
    const invalidImports = imports.filter(imp => !ALLOWED_COMPONENTS.includes(imp));

    if (invalidImports.length > 0) {
      errors.push(`Invalid components used: ${invalidImports.join(', ')}`);
    }
  }

  const dangerousPatterns = [
    { pattern: /eval\s*\(/, message: 'eval() is not allowed' },
    { pattern: /Function\s*\(/, message: 'Function constructor is not allowed' },
    { pattern: /dangerouslySetInnerHTML/, message: 'dangerouslySetInnerHTML is not allowed' },
    { pattern: /<script/i, message: 'Script tags are not allowed' },
    { pattern: /style\s*=\s*{{/, message: 'Inline styles are not allowed' }
  ];

  for (const { pattern, message } of dangerousPatterns) {
    if (pattern.test(code)) {
      errors.push(message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function sanitizeUserInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}
