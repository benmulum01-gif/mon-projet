"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui";

/** Submit button that asks for confirmation (destructive actions). */
export function ConfirmSubmit({ message, ...props }: ComponentProps<typeof Button> & { message: string }) {
  return (
    <Button
      type="submit"
      {...props}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    />
  );
}
