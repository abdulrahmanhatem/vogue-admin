import { NextResponse } from "next/server";
import { getSubproducts } from "@/actions/Subproduct";
import { collectionRef } from "@/app/api/subproducts/route";
import { getDocs, query, where } from "firebase/firestore";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ sku: string }> }
) {
  try {
    const params = await props.params;

    const { sku } = await params;

    const q = query(collectionRef, where("sku", "==", sku));
    const snapShot = (await getDocs(q)).docs;

    const items =
      snapShot.length > 0
        ? (
            snapShot.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Subproduct[]
          ).filter((doc) => !doc.deletedAt)
        : [];

    if (items.length > 0) {
      const Subproduct = items[0];

      if (Subproduct.uuid) {
        const data = Subproduct;

        return NextResponse.json({ data }, { status: 200 });
      }
    }

    throw new Error("No Data Found!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function generateStaticParams() {
  const list: Subproduct[] = await getSubproducts();

  return list.map(({ sku }: { sku: string }) => ({ sku }));
}
