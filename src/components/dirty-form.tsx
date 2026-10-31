"use client";

import { startTransition, type ComponentProps } from "react";

/**
 * Form used across the app:
 * - flags itself as dirty once edited, so switching language can warn
 *   before unsaved input is lost;
 * - keeps what the user typed when the server returns validation errors
 *   (React resets `<form action={fn}>` after each submission, which would
 *   wipe the fields). Without JavaScript it still submits normally.
 */
export function DirtyForm({ onSubmit, action, ...props }: ComponentProps<"form">) {
  return (
    <form
      {...props}
      action={action}
      onInput={(event) => {
        event.currentTarget.dataset.dirty = "true";
        props.onInput?.(event);
      }}
      onSubmit={(event) => {
        onSubmit?.(event);
        if (event.defaultPrevented) return;
        event.currentTarget.dataset.dirty = "false";
        if (typeof action === "function") {
          event.preventDefault();
          const formData = new FormData(event.currentTarget, (event.nativeEvent as SubmitEvent).submitter);
          startTransition(() => action(formData));
        }
      }}
    />
  );
}
