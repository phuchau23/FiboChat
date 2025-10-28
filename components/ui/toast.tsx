"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

// --- VARIANTS ---
const toastVariants = cva(
  "group relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 pr-6 pl-5 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right-full",
  {
    variants: {
      variant: {
        default: "", // success
        destructive: "", // error
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, children, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      duration={3000}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {/* Thanh màu (dày, có khoảng cách bên trái) */}
      <div
        className={cn(
          "absolute left-[10px] top-3 bottom-3 w-[6px] rounded-full",
          variant === "destructive" ? "bg-yellow-400" : "bg-green-500"
        )}
      />

      {/* Icon */}
      <div className="ml-5 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center">
        {variant === "destructive" ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Check className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div className="flex flex-1 flex-col pl-1">{children}</div>

      {/* Nút đóng */}
      <ToastPrimitives.Close className="absolute right-3 top-3 rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none">
        <X className="h-4 w-4" />
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  );
});

Toast.displayName = ToastPrimitives.Root.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold text-gray-900", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription };

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
