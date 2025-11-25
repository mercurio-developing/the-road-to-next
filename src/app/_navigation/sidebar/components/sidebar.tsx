"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { navItems } from "@/app/_navigation/sidebar/constants";
import { SideBarItem } from "@/app/_navigation/sidebar/components/sidebar-item";
import { useAuth } from "@/features/hooks/use-auth";
import { usePathname } from "next/navigation";
import { getActivePath } from "@/utils/get-active-path";
import { signInPath, signUpPath } from "@/app/paths";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";

const SideBar = () => {
  const { user, isFetched } = useAuth();

  const pathName = usePathname();
  const { activeIndex } = getActivePath(
    pathName,
    navItems.map((item) => item.href),
    [signInPath(), signUpPath()],
  );

  const [isTransition, setTransition] = useState(false);
  const { open, setOpen, toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleToogle = async () => {
      setTransition(true);
      setOpen(false);
      setTimeout(() => setTransition(false), 200);
    };
    handleToogle();
  }, [setOpen]);

  if (!user || !isFetched) {
    return null;
  }

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "animate-sidebar-from-left h-screen border-r mt-14",
        isTransition && "duration-150",
      )}
    >
      <SidebarContent
        onMouseEnter={() => !open && toggleSidebar()}
        onMouseLeave={() => open && toggleSidebar()}
      >
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((navItem, index) => (
              <SideBarItem
                key={navItem.title}
                isOpen={open}
                isActive={activeIndex == index}
                navItem={navItem}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
export { SideBar };
