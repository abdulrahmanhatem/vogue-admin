import { ReactNode } from "react";

export default function layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <aside></aside>
      <main>{children}</main>
    </>
  );
}
