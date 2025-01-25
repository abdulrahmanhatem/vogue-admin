import useData from "@/hooks/useData";
import { arrayFromString } from "@/lib/format";
import { memo } from "react";

const ColorsAndSizes = ({
  item_colors,
  item_sizes,
}: {
  item_colors: string;
  item_sizes: string;
}) => {
  const { data: colors } = useData("colors");
  const { data: sizes } = useData("sizes");

  const itemColors: string[] = Array.from(
    new Set(arrayFromString(item_colors as string))
  );
  const itemSizes: string[] = Array.from(
    new Set(arrayFromString(item_sizes as string))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[calc(50%-.5rem)_calc(50%-.5rem)] gap-4">
      <div className="dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg flex flex-col gap-3 shadow-md">
        <span className="text-neutral-700 dark:text-neutral-300">Colors</span>
        <span className="flex gap-2 flex-wrap">
          {colors.length > 0 ? (
            itemColors.map((color: string) => {
              const itemColor = colors.find((c) => c.uuid === color);
              return itemColor ? (
                <span
                  className={`h-5 w-5 rounded-sm block ring-ring ring-1 shadow-md`}
                  style={{
                    backgroundColor: itemColor?.hex,
                  }}
                  title={`${itemColor?.name}`}
                  key={itemColor.uuid}
                ></span>
              ) : (
                <></>
              );
            })
          ) : (
            <></>
          )}
        </span>
      </div>
      <div className="dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg flex flex-col gap-3 shadow-md">
        <span className="text-neutral-700 dark:text-neutral-300">Sizes</span>

        <span className="flex gap-2">
          {sizes.length > 0 ? (
            itemSizes.map((size: string) => {
              const itemSize = sizes.find((s) => s.uuid === size);

              return itemSize ? (
                <span
                  className={`h-5 w-5 rounded-sm flex justify-center items-center ring-ring ring-1 text-xs font-thin`}
                  key={itemSize.uuid}
                  title={`${itemSize.name}`}
                >
                  {itemSize.symbol}
                </span>
              ) : (
                <></>
              );
            })
          ) : (
            <></>
          )}
        </span>
      </div>
    </div>
  );
};
export default memo(ColorsAndSizes);
