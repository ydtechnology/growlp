// growlp-web/components/ui/dialog.tsx
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className = "", style, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={[
        "fixed inset-0 bg-black/50",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className,
      ].join(" ")}
      style={{ ...(style || {}), zIndex: 1000 }}
      {...props}
    />
  );
});

type ContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  hideClose?: boolean;
  maxWidth?: string | number;
  maxHeight?: string | number;
  centered?: boolean;
};

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ContentProps
>(function DialogContent(
  {
    className = "",
    children,
    hideClose = false,
    maxWidth = "96vw",
    maxHeight = "90vh",
    centered = true,
    style,
    ...props
  },
  ref
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        role="dialog"
        aria-modal={true}
        className={[
          "fixed bg-white shadow-2xl rounded-xl focus:outline-none",
          centered ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" : "",
          "data-[state=open]:animate-in data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95",
          className,
        ].join(" ")}
        style={{
          width: "calc(100vw - 2rem)",
          maxWidth,
          maxHeight,
          overflow: "auto",
          ...(style || {}),
          zIndex: 1010,
        }}
        {...props}
      >
        {children}

        {!hideClose && (
          <DialogPrimitive.Close
            aria-label="閉じる"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center
                       rounded-full border bg-white/95 text-neutral-700 shadow
                       hover:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-300"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});