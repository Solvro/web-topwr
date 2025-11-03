import { useState } from "react";
import type { ComponentProps } from "react";

import { AbstractResourceFormSheet } from "@/components/abstract/resource-form/sheet";
import type { Resource } from "@/config/enums";
import { ArfSheetContext } from "@/hooks/use-arf-sheet";
import type { ArfSheetContextType } from "@/hooks/use-arf-sheet";
import { renderAbstractResourceForm } from "@/lib/actions";
import type { ResourceFormSheetData } from "@/types/components";

export function ArfSheetProvider({
  resource,
  children,
  ...props
}: {
  resource: Resource;
} & ComponentProps<"div">) {
  const [sheet, setSheet] = useState<ResourceFormSheetData<Resource>>({
    visible: false,
  });

  const context: ArfSheetContextType<Resource> = {
    resource,
    sheet,
    setSheet,
    showSheet: (options, ...formProps) => {
      const formPromise = renderAbstractResourceForm(...formProps);
      const sheetData: ResourceFormSheetData<Resource> = {
        visible: true,
        content: { ...options, form: formPromise },
      };
      setSheet(sheetData);
    },
  };

  return (
    <ArfSheetContext.Provider value={context}>
      <div {...props}>
        {children}
        <AbstractResourceFormSheet
          resource={resource}
          sheet={sheet}
          setSheet={setSheet}
        />
      </div>
    </ArfSheetContext.Provider>
  );
}
