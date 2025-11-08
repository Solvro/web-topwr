import { useTransitionRouter } from "@solvro/next-view-transitions";
import { useTopLoader } from "nextjs-toploader";
import { useRouter as useTopLoaderRouter } from "nextjs-toploader/app";

/**
 * This hook combines `useRouter` from `nextjs-toploader` and `useTransitionRouter` from `@solvro/next-view-transitions`
 * into one router, which both starts the top loader and performs view transitions on navigation.
 */
export const useRouter = () => {
  const topLoader = useTopLoader();
  const topLoaderRouter = useTopLoaderRouter();
  const transitionRouter = useTransitionRouter();

  const push = (...arguments_: Parameters<typeof transitionRouter.push>) => {
    topLoader.start();
    transitionRouter.push(...arguments_);
  };

  const replace = (
    ...arguments_: Parameters<typeof transitionRouter.replace>
  ) => {
    topLoader.start();
    transitionRouter.replace(...arguments_);
  };

  return { ...topLoaderRouter, push, replace };
};
