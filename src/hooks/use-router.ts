import { useTransitionRouter } from "@solvro/next-view-transitions";
import type { Route } from "next";

type TransitionRouter = ReturnType<typeof useTransitionRouter>;
type NavigateOptionsWithTransition = Parameters<TransitionRouter["push"]>[1];

/**
 * This hook types `useRouter` from `useTransitionRouter` from `@solvro/next-view-transitions`
 * using typed routes, ensuring type safety when navigating between pages with transitions.
 */
export const useRouter = () => {
  const transitionRouter = useTransitionRouter();

  const push = <T extends string>(
    href: Route<T>,
    options?: NavigateOptionsWithTransition,
  ) => {
    transitionRouter.push(href, options);
  };

  const replace = <T extends string>(
    href: Route<T>,
    options?: NavigateOptionsWithTransition,
  ) => {
    transitionRouter.replace(href, options);
  };

  return { ...transitionRouter, push, replace };
};
