"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoMdBusiness } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "lucide-react";
import { memo } from "react";

import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const Logout = dynamic(() => import("@/components/modules/admin/auth/Logout"), {
  loading: Loading,
});
const Logo = dynamic(() => import("@/components/custom/Logo"), {
  loading: Loading,
});
import { CgSize } from "react-icons/cg";
import { IoIosColorPalette } from "react-icons/io";
import { AiOutlineProduct } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";

export const SidebarLinks = [
  {
    title: "Dashboard",
    link: "/admin",
    icon: MdSpaceDashboard,
  },
  {
    title: "Admins",
    link: "/admin/admins",
    icon: MdAdminPanelSettings,
  },
  // {
  //   title: "Users",
  //   link: "/admin/users",
  //   icon: FaUsers,
  // },
  {
    title: "Categories",
    link: "/admin/categories",
    icon: BiSolidCategoryAlt,
  },
  {
    title: "Brands",
    link: "/admin/brands",
    icon: IoMdBusiness,
  },
  {
    title: "Sizes",
    link: "/admin/sizes",
    icon: CgSize,
  },
  {
    title: "Colors",
    link: "/admin/colors",
    icon: IoIosColorPalette,
  },
  {
    title: "Products",
    link: "/admin/products",
    icon: AiOutlineProduct,
  },
];

function AdminSidebar() {
  const { data: session } = useSession();
  const user = session?.user;

  const { state } = useSidebar();

  const currentPath = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="
      absolute 
      h-[calc(100%-5vh)] top-[2.5vh]
      start-[1rem] 
      rounded-lg 
      border-transparent"
    >
      <SidebarHeader className="hidden md:block py-8 px-4">
        {state === "expanded" ? (
          <Logo />
        ) : (
          <Logo className="w-5 h-5 mx-auto" small={true} />
        )}
      </SidebarHeader>
      <SidebarContent className="scrollbar-hide overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground">
            Vogue Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarLinks.map((link) => {
                const isActive =
                  link.link === "/admin"
                    ? currentPath === "/admin"
                    : currentPath.startsWith(link.link);

                return (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={`${link.link}`}
                        className="w-6 h-6 text-foreground"
                      >
                        <link.icon />
                        <span
                          className={isActive ? "font-bold" : "font-medium"}
                        >
                          {link.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="focus:ring-0 focus:bg-transparent data-[state=open]:bg-transparent
            "
            >
              <Link
                href="/admin/account"
                aria-label={`Sidebar Account Dropdown`}
                className="w-full flex gap-2"
              >
                <div
                  className={cn(
                    "bg-main-700 flex items-center justify-center rounded-md p-2 transition-all",
                    state === "expanded" ? "w-10 h-10" : "w-8 h-8"
                  )}
                >
                  <User className="text-main-50" size={25} />
                </div>
                {state === "expanded" ? (
                  <div className="flex flex-col items-start">
                    <div className="text-sm font-bold truncate">
                      {user.name}
                    </div>
                    <div className="text-sm text-main-700 capitalize truncate">
                      {user.email}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </Link>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex gap-2 cursor-pointer">
                  <IoSettingsOutline />
                  <span>Setting</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex gap-2 cursor-pointer">
                  <CiLogout />
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={`/admin/login`}>Login</Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
export default memo(AdminSidebar);
