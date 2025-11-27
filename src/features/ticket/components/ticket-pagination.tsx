"use client";

import { useQueryState, useQueryStates } from "nuqs";
import {
  paginationOptions,
  paginationParser,
  searchParser,
} from "@/features/ticket/search-params";
import { Pagination } from "@/components/pagination";
import { useEffect, useRef } from "react";
import { PaginateData } from "@/types/pagination";
import { TicketWithMetadata } from "@/features/ticket/type";

type TicketPaginationProps = {
  paginatedTicketMetadata:PaginateData<TicketWithMetadata>["metadata"];
};

const TicketPagination = ({ paginatedTicketMetadata }: TicketPaginationProps) => {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    paginationOptions,
  );
  const [search] = useQueryState("search", searchParser);
  const prevSearch = useRef(search);
  useEffect(()=>{
    if (search === prevSearch.current) return;
    prevSearch.current = search
    setPagination({...pagination,page:0})
  },[pagination,search,setPagination])


  return <Pagination pagination={pagination} onPagination={setPagination} paginatedMetadata={paginatedTicketMetadata} />;
};

export { TicketPagination };
