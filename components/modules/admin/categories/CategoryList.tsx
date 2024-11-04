"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  PaginationState,
  SortingState,
  VisibilityState,
  useReactTable,
  ColumnFiltersState,
  Column,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  useState,
  Dispatch,
  SetStateAction,
  useTransition,
  useCallback,
  memo,
} from "react";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/actions/Category";
import { notify } from "@/lib/utils";
import { ModalState } from "@/components/custom/Modal";
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from "react-icons/io";

import { DialogFooter } from "@/components/ui/dialog";
import TablePagination from "@/components/custom/TablePagination";
import AddCategory from "./AddCategory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CiSliderHorizontal } from "react-icons/ci";
import { IoCheckmark } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { TiArrowUnsorted } from "react-icons/ti";
import deleteMultiple from "@/lib/deleteMultiples";
import ToggleColumnView from "@/components/custom/ToggleColumnView";

interface CategoryListProps<TData> {
  data: TData[];
  columns: ColumnDef<Category>[];
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<ModalState>>;
  addOptimisticData: (
    action: Category[] | ((pendingState: Category[]) => Category[])
  ) => void;
}

interface RowSelectionType {
  [key: string]: boolean;
}

function CategoryList({
  data,
  columns,
  setModal,
  setModalOpen,
  addOptimisticData,
}: CategoryListProps<Category>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionType>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    select: true,
    name: true,
    actions: true,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  const selectedRows = Object.keys(rowSelection);

  const totalRows = data?.length ? data.length : 0;
  const [showDeleteAll, setShowDeleteAll] = useState(true);
  const [isPending, startTransition] = useTransition();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
      sorting,
      pagination,
      columnVisibility,
      columnFilters,
    },
    onRowSelectionChange: (value) => {
      setRowSelection(value);
      setShowDeleteAll(true);
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    defaultColumn: {
      size: 50,
      minSize: 5,
      maxSize: 500,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getRowId: (row) => row.id,
  });

  const currentPage = pagination.pageIndex + 1;
  const totalPages =
    data.length > 0 ? Math.ceil(data.length / pagination.pageSize) : 1;

  const deleteMultipleCallback = useCallback(
    () =>
      deleteMultiple({
        setModalOpen,
        setShowDeleteAll,
        setModal,
        selectedRows,
        addOptimisticData,
        isPending,
        startTransition,
      }),
    [
      setModalOpen,
      setShowDeleteAll,
      setModal,
      selectedRows,
      addOptimisticData,
      isPending,
      startTransition,
    ]
  );

  const tableHeader = table.getHeaderGroups().map((hgroup) => (
    <TableRow key={hgroup.id}>
      {hgroup.headers.map((header) => {
        return (
          <TableHead
            key={header.id}
            className={header.column.getCanSort() ? "cursor-pointer" : ""}
          >
            {header.column.getCanSort() ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex gap-2 items-center hover:bg-main-200 hover:*:text-main-900 rounded-lg p-2">
                    <span className="text-main-800">
                      {" "}
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </span>
                    <TiArrowUnsorted style={{ fill: "var(--main-800)" }} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background p-2 rounded-lg *:cursor-pointer">
                  <DropdownMenuItem
                    onClick={() =>
                      setSorting([
                        { desc: false, id: `${header.column.columnDef.id}` },
                      ])
                    }
                  >
                    <div className="flex items-center gap-2 justify-between">
                      <span>Asc</span>
                      <IoIosArrowRoundUp size={20} />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setSorting([
                        { desc: true, id: `${header.column.columnDef.id}` },
                      ])
                    }
                  >
                    <div className="flex items-center gap-2 justify-between">
                      <span>Desc</span>
                      <IoIosArrowRoundDown size={20} />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSorting([])}>
                    <div className="flex items-center gap-2 justify-between">
                      <span>Reset</span>
                      <IoIosArrowRoundUp size={20} />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div>
                <span className="text-main-800">
                  {" "}
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </span>
              </div>
            )}
          </TableHead>
        );
      })}
    </TableRow>
  ));

  const tableBody = table.getRowModel().rows?.length ? (
    table.getRowModel().rows.map((row) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell
        colSpan={columns.length}
        className="w-full flex items-center justify-center"
      >
        No results.
      </TableCell>
    </TableRow>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4 flex-col lg:flex-row flex-wrap">
        <div>
          <Input
            className="bg-background"
            type="text"
            placeholder="Filter Categories..."
            onChange={(e) =>
              setColumnFilters([{ id: "name", value: e.target.value }])
            }
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          {selectedRows.length > 0 && showDeleteAll && (
            <Button
              variant="destructive"
              onClick={deleteMultipleCallback}
              size="sm"
            >
              Delete Selected
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => {
              setModalOpen(true);
              setModal({
                title: "Add Category",
                description:
                  "Add new Category here. Click Add when you'are done.",
                children: (
                  <AddCategory
                    setModalOpen={setModalOpen}
                    addOptimisticData={addOptimisticData}
                  />
                ),
              });
            }}
          >
            Add New
          </Button>

          <ToggleColumnView<Category>
            columns={table.getAllColumns()}
            setColumnVisibility={setColumnVisibility}
            columnVisibility={columnVisibility}
          />
        </div>
      </div>

      <Table className="border rounded-xl">
        <TableHeader>{tableHeader}</TableHeader>
        <TableBody>{tableBody}</TableBody>
      </Table>
      <div className="flex flex-col lg:flex-row lg:items-center items-start lg:justify-between px-2 gap-4">
        <div className="text-neutral-600">
          {selectedRows.length} of {totalRows} row(s) selected.
        </div>
        <TablePagination
          canPrevious={table.getCanPreviousPage()}
          canNext={table.getCanNextPage()}
          firstPage={() => table.firstPage()}
          lastPage={() => table.lastPage()}
          previousPage={() => table.previousPage()}
          nextPage={() => table.nextPage()}
          currentPage={currentPage}
          totalPages={totalPages}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
}

export default memo(CategoryList) as typeof CategoryList