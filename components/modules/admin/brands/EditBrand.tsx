"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrandSchema } from "./AddBrand";
import { Dispatch, memo, SetStateAction, useTransition } from "react";
import { editBrand } from "@/actions/Brand";
import { notify } from "@/lib/utils";

function EditBrand({
  item,
  setModalOpen,
  addOptimisticData,
}: {
  item: Brand;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  addOptimisticData: (
    action: Brand[] | ((pendingState: Brand[]) => Brand[])
  ) => void;
}) {
  const form = useForm<z.infer<typeof BrandSchema>>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      name: item.name,
    },
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof BrandSchema>) {
    setModalOpen(false);
    const data = {
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: new Date().toISOString(),
      ...values,
      isPending: !isPending ,
    };

    startTransition(async () => {
      addOptimisticData((prev) => [
        ...prev.filter((item) => item.id !== data.id),
        data,
      ]);
    });

    const res: ActionResponse = await editBrand(data);
    notify(res);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:gap-0">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Update Brand Name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Update</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default memo(EditBrand)
