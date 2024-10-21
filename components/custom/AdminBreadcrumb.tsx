
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { ReactNode } from "react";
import Link from "next/link";

export default function AdminBreadcrumb({
  children,
  className,
  page
}: Readonly<{
  children: ReactNode;
  className?: string;
  page: string;
}>) {
  return  <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink asChild> 
      <Link href="/admin">Dashboard</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator/>
    {children && children}
    <BreadcrumbItem>
      <BreadcrumbPage>{page}</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>;
}
