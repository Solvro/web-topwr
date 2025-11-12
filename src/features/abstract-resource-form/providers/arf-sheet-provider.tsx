import { useState } from "react";
import type { ComponentProps } from "react";

import type { Resource } from "@/config/enums";

import { renderAbstractResourceForm } from "../actions/render-abstract-resource-form";
import { AbstractResourceFormSheet } from "../components/arf-sheet";
import { ArfSheetContext } from "../context/arf-sheet-context";
import type { ArfSheetContextType, ArfSheetData } from "../types/internal";

export function ArfSheetProvider({
  resource,
  children,
  ...props
}: {
  resource: Resource;
} & ComponentProps<"div">) {
  const [sheet, setSheet] = useState<ArfSheetData<Resource>>({
    visible: false,
  });

  const context: ArfSheetContextType<Resource> = {
    resource,
    sheet,
    setSheet,
    showSheet: (options, ...formProps) => {
      const formPromise = renderAbstractResourceForm(...formProps);
      const sheetData: ArfSheetData<Resource> = {
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
