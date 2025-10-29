import { CheckCircle2, CircleAlert, Info } from "lucide-react";
import React from "react";
import clsx from "clsx";

interface AlertProps {
  type?: "error" | "success" | "info";
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ type = "info", message }) => {
  const styles = {
    error: {
      icon: <CircleAlert className="h-5 w-5 text-red-500" />,
      bg: "bg-[#FEEBEF]",
      text: "text-red-700 text-xs",
    },
    success: {
      icon: (
        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
      ),
      bg: "bg-green-50",
      border: "border-green-300",
      text: "text-green-700",
    },
    info: {
      icon: <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />,
      bg: "bg-blue-50",
      border: "border-blue-300",
      text: "text-blue-700",
    },
  };

  const current = styles[type];

  return (
    <div
      className={clsx(
        "flex items-start gap-2 rounded-md border p-3 text-left transition-all duration-200",
        current.bg,
        type === "error" ? "shadow-none border-none outline-none" : ""
      )}
    >
      {current.icon}
      <p className={clsx("text-sm leading-snug", current.text)}>{message}</p>
    </div>
  );
};
