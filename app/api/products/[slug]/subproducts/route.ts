import { NextResponse } from "next/server";
import { getProducts } from "@/actions/Product";
import { collectionRef } from "@/app/api/products/route";
import { collectionRef as subproductCollection } from "@/app/api/subproducts/route";
import { getDocs, query, where } from "firebase/firestore";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;

    const { slug } = await params;

    const q = query(collectionRef, where("slug", "==", slug));
    const snapShot = (await getDocs(q)).docs;

    const items =
      snapShot.length > 0
        ? (
            snapShot.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Product[]
          ).filter((doc) => !doc.deletedAt)
        : [];

    if (items.length > 0) {
      const product = items[0];

      if (product.uuid) {
        const q = query(
          subproductCollection,
          where("productId", "==", product.uuid)
        );
        const subproductsSnapShot = (await getDocs(q)).docs;

        const items =
          subproductsSnapShot.length > 0
            ? (
                subproductsSnapShot.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                })) as Subproduct[]
              ).filter((doc) => !doc.deletedAt)
            : [];
        const subproducts: Subproduct[] = items;

        const data = subproducts;

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
  const list: Product[] = await getProducts();

  return list.map(({ slug }: { slug: string }) => ({ slug }));
}
