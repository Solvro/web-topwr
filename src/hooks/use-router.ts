import { useTransitionRouter } from "@solvro/next-view-transitions";
import type { Route } from "next";
import { useTopLoader } from "nextjs-toploader";
import { useRouter as useTopLoaderRouter } from "nextjs-toploader/app";

type TransitionRouter = ReturnType<typeof useTransitionRouter>;
type NavigateOptionsWithTransition = Parameters<TransitionRouter["push"]>[1];

/**
 * This hook combines `useRouter` from `nextjs-toploader` and `useTransitionRouter` from `@solvro/next-view-transitions`
 * into one router, which both starts the top loader and performs view transitions on navigation.
 */
export const useRouter = () => {
  const topLoader = useTopLoader();
  const topLoaderRouter = useTopLoaderRouter();
  const transitionRouter = useTransitionRouter();

  const push = <T extends string>(
    href: Route<T>,
    options?: NavigateOptionsWithTransition,
  ) => {
    topLoader.start();
    transitionRouter.push(href, options);
  };

  const replace = <T extends string>(
    href: Route<T>,
    options?: NavigateOptionsWithTransition,
  ) => {
    topLoader.start();
    transitionRouter.replace(href, options);
  };

  return { ...topLoaderRouter, push, replace };
};
