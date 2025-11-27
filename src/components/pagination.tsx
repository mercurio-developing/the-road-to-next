import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginateData } from "@/types/pagination";

type PageAndSize = {
  page: number;
  size: number;
};


type PaginationProps = {
  pagination: PageAndSize;
  onPagination: (pagination: PageAndSize) => void;
  paginatedMetadata: PaginateData<unknown>["metadata"];
};

const Pagination = ({
  pagination,
  onPagination,
  paginatedMetadata,
}: PaginationProps) => {
  const { count, hasNextPage } = paginatedMetadata;
  const startOffset = pagination.page * pagination.size + 1;
  const endOffset = startOffset - 1 + pagination.size;
  const actualEndOffset = Math.min(endOffset, count);

  const handleNextPage = () => {
    onPagination({ ...pagination, page: pagination.page + 1 });
  };
  const handlePreviousPage = () => {
    onPagination({ ...pagination, page: pagination.page - 1 });
  };

  const nextButton = (
    <Button
      variant="outline"
      size="sm"
      disabled={!hasNextPage}
      onClick={handleNextPage}
    >
      Next
    </Button>
  );

  const previousButton = (
    <Button
      variant="outline"
      size="sm"
      disabled={pagination.page < 1}
      onClick={handlePreviousPage}
    >
      Previous
    </Button>
  );

  const handleChangeSize = (value: string) => {
    onPagination({ page:0, size: parseInt(value) });
  };

  const sizeButton = (
    <Select
      defaultValue={pagination.size.toString()}
      onValueChange={handleChangeSize}
    >
      <SelectTrigger size="sm" className="h-[36px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent >
        <SelectItem  value="5">5</SelectItem>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="25">25</SelectItem>
        <SelectItem value="50">50</SelectItem>
        <SelectItem value="100">100</SelectItem>
      </SelectContent>
    </Select>
  );

  const label = `${startOffset} - ${actualEndOffset} of ${count}`;
  return (
    <div className="flex justify-between items-center ">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex gap-x-2">
        {sizeButton}
        {previousButton}
        {nextButton}
      </div>
    </div>
  );
};
export { Pagination };
