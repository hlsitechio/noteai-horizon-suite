import React from "react";

type ProviderProps = { children: React.ReactNode };
type ProviderComponent = React.ComponentType<ProviderProps>;

/**
 * Compose multiple providers into a single component
 * This flattens the provider tree and improves performance
 * by reducing deep nesting during React's reconciliation
 */
export function composeProviders(...providers: ProviderComponent[]) {
  return ({ children }: ProviderProps) =>
    providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    );
}