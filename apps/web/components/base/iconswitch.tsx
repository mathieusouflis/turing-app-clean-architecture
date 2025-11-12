import * as Icons from "lucide-react";
import { ForwardRefExoticComponent } from "react";
import React from "react";

export interface IconSwitchProps {
  name: keyof typeof Icons;
  size?: number;
  color?: string;
  className?: string;
}

export function IconSwitch({
  name,
  size = 24,
  color = "currentColor",
  className,
}: IconSwitchProps) {
  const LucideIcon = Icons[name];
  if (!LucideIcon || !(LucideIcon as any).$$typeof) return null; // $$typeof vérifie si c'est un composant React valide

  return React.createElement(LucideIcon as ForwardRefExoticComponent<any>, {
    size,
    color,
    className,
  });
}
