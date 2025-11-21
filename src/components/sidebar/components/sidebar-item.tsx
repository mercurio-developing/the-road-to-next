import { NavItem } from "@/components/sidebar/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cloneElement } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type SideBarItemProps = {
  isOpen: boolean;
  navItem: NavItem;
  isActive: boolean;
};

const SideBarItem = ({ navItem, isActive }: SideBarItemProps) => {
  return (
    <>
      {navItem.separator && <Separator />}
      <SidebarMenuItem key={navItem.title}>
        <SidebarMenuButton asChild>
          <Link
            href={navItem.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "group relative flex h-12  justify-start",
              isActive && "bg-muted font-bold hover:bg-muted",
            )}
          >
            <div className="flex h-full w-12 items-center justify-center">
              {cloneElement(navItem.icon, {
                className: "h-5 w-5",
              })}
            </div>
            <span>{navItem.title}</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuAction />
      </SidebarMenuItem>
    </>
  );
};

export { SideBarItem };
