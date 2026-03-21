"use client";

import { ShieldCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { VerifiedStatus } from "@/types/database";

interface VerifiedBadgeProps {
  verifiedStatus: VerifiedStatus;
  supplementLabel?: string | null;
  size?: "sm" | "md";
}

export default function VerifiedBadge({
  verifiedStatus,
  supplementLabel,
  size = "md",
}: VerifiedBadgeProps) {
  if (verifiedStatus !== "verified") return null;

  const iconPx = size === "sm" ? 14 : 18;
  const tooltip = supplementLabel ? `${supplementLabel} Verified` : "ID Verified";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help">
            <ShieldCheck
              size={iconPx}
              className="text-green-600 fill-green-100"
            />
            {size === "md" && (
              <span className="font-inter text-xs font-semibold text-green-700">
                Verified
              </span>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="font-inter text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
