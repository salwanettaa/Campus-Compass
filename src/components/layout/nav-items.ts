import {
  BookOpen,
  House,
  Route,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /**
   * Matches the pathname for the active state. Omit for items that point to an
   * anchor inside another page (they are never marked as the current page).
   */
  match?: string;
};

/**
 * Main navigation, in the order shown in the design reference.
 * NOTE: per AGENTS.md "My Journey" lives inside the Home module, so it links to
 * the journey section of /home instead of owning a separate route.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/home", icon: House, match: "/home" },
  { label: "Community", href: "/community", icon: Users, match: "/community" },
  {
    label: "Knowledge Hub",
    href: "/knowledge",
    icon: BookOpen,
    match: "/knowledge",
  },
  { label: "My Journey", href: "/home#my-journey", icon: Route },
  {
    label: "AI Navigator",
    href: "/ai-navigator",
    icon: Sparkles,
    match: "/ai-navigator",
  },
];

export function isActive(item: NavItem, pathname: string) {
  if (!item.match) return false;
  return pathname === item.match || pathname.startsWith(`${item.match}/`);
}
