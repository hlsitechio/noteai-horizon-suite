import React from "react";

type ProviderProps = { children: React.ReactNode };
type ProviderComponent = React.ComponentType<ProviderProps>;

/**
 * @deprecated This utility is deprecated. Use direct provider nesting instead.
 * Direct nesting provides better React context reliability and debugging experience.
 * 
 * Example migration:
 * Before: composeProviders(ProviderA, ProviderB, ProviderC)
 * After: <ProviderA><ProviderB><ProviderC>children</ProviderC></ProviderB></ProviderA>
 */
export function composeProviders(...providers: ProviderComponent[]) {
  console.warn('composeProviders is deprecated. Use direct provider nesting for better context reliability.');
  
  return ({ children }: ProviderProps) =>
    providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    );
}