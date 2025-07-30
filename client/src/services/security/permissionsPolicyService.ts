/**
 * Permissions Policy Service
 */

export class PermissionsPolicyService {
  private config: Record<string, string[]>;

  constructor(config: Record<string, string[]>) {
    this.config = config;
  }

  generatePermissionsPolicyHeader(): string {
    const policies = Object.entries(this.config)
      .map(([feature, allowList]) => {
        if (allowList.length === 0) {
          return `${feature}=()`;
        }
        return `${feature}=(${allowList.join(' ')})`;
      })
      .join(', ');

    return policies;
  }

  getPermissionsPolicyScore(): number {
    return Object.keys(this.config).length > 0 ? 15 : 0;
  }
}