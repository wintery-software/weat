import type { RowData } from "@tanstack/table-core/src/types";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    sticky?: "left" | "right";
  }
}
