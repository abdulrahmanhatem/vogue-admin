"use client";
import Heading from "@/components/custom/Heading";
import Modal from "@/components/custom/Modal";
import Row from "@/components/custom/Row";
import CategoriesList from "@/components/modules/admin/categories/CategoriesList";
import { Button } from "@/components/ui/button";
import { createContext, memo, useCallback, useMemo, useOptimistic, useState } from "react";
import AddCategory from "@/components/modules/admin/categories/AddCategory";
import { ModalProps } from "@/components/custom/Modal";
import NoResults from "@/components/custom/NoResults";
import AdminBreadcrumb from "@/components/custom/AdminBreadcrumb";

const CategoryBreadCrumb = memo(() => <AdminBreadcrumb page="Categories" />);

export const OptimisticContext = createContext<{
  addOptimisticData: (
    action: Category[] | ((pendingState: Category[]) => Category[])
  ) => void;
}>({
  addOptimisticData: () => {},
});

export default function Categories({ data }: { data: Category[] }) {
  const [optimisicData, addOptimisticData] = useOptimistic(data);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<ModalProps>({
    title: "",
    description: "",
    children: <></>,
  });

  const sortedOptimisicData = optimisicData?.length
    ? optimisicData.sort((a: Category, b: Category) =>
        b.updatedAt.localeCompare(a.updatedAt)
      )
    : [];

    const addOptimistic = useMemo(()=> ({addOptimisticData}), [])

  return (
    <OptimisticContext.Provider value={addOptimistic}>
      <div>
        <CategoryBreadCrumb/>
        <Row className="justify-between items-center">
          <Heading title="Categories" />
          <Button
            onClick={() => {
              setOpen(true);
              setModal({
                title: "Add Category",
                description:
                  "Add new Category here. Click Add when you'are done.",
                children: (
                  <AddCategory
                    setOpen={setOpen}
                    // addOptimisticData={addOptimisticData}
                  />
                ),
              });
            }}
          >
            Add New
          </Button>
        </Row>

        {data?.length ? (
          <CategoriesList
            data={sortedOptimisicData}
            setOpen={setOpen}
            setModal={setModal}
          />
        ) : (
          <NoResults />
        )}

        <Modal
          title={modal.title}
          description={modal.description}
          open={open}
          setOpen={setOpen}
        >
          <>{modal.children}</>
        </Modal>
      </div>
    </OptimisticContext.Provider>
  );
}
