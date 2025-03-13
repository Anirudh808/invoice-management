import { IconSearch } from "@tabler/icons-react";
import React from "react";
import MainLoader from "./ui/MainLoader";
import { Button } from "./ui/button";
import { ArrowDownUp, Pencil, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "./ui/pagination";
import { Client, Project, Invoice, ColumnDef } from "@/types";

interface Props<T> {
  type: "client" | "project" | "invoice";
  filterData: (value: string) => void;
  isLoading: boolean;
  columnDef: ColumnDef<T>[];
  currentItems: T[];
  filteredItems: T[];
  prevPage: () => void;
  nextPage: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

const Table = <T extends Client | Project | Invoice>({
  type,
  filterData,
  isLoading,
  columnDef,
  currentItems,
  filteredItems,
  prevPage,
  nextPage,
  currentPage,
  setCurrentPage,
  totalPages,
}: Props<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNestedValue = (item: any, keys: string[] | keyof any): any => {
    if (Array.isArray(keys)) {
      return keys.reduce((obj, key) => obj?.[key], item);
    }
    return item[keys];
  };

  return (
    <div className="p-6 bg-white border border-slate-400 rounded-lg mt-8">
      {/* Search & Filter Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <input
            placeholder="Search Clients..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => filterData(e.target.value)}
          />
          <IconSearch className="absolute text-gray-400 size-5 right-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="w-full flex justify-center">
          <MainLoader />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-slate-200 text-gray-700">
                {columnDef.map((col) => (
                  <th
                    key={col.columnName}
                    className="p-3 text-left border border-gray-300"
                  >
                    {col.isSortable ? (
                      <Button
                        variant={"ghost"}
                        className="text-md font-semibold cursor-pointer hover:bg-transparent"
                        onClick={col.sortFn}
                      >
                        {col.columnName} <ArrowDownUp />
                      </Button>
                    ) : (
                      col.columnName
                    )}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={
                      type === "client"
                        ? (item as Client).id
                        : type === "project"
                        ? (item as Project).id
                        : (item as Invoice).id
                    }
                    className="border border-gray-300 even:bg-slate-100 hover:bg-slate-50 transition-all"
                  >
                    {columnDef.map((col, idx) => {
                      const cellValue = getNestedValue(item, col.key);

                      return (
                        <td key={idx} className="p-3 border border-gray-300">
                          {cellValue != null
                            ? col.key === "dueDate"
                              ? new Date(
                                  cellValue as unknown as string | number
                                ).toLocaleDateString()
                              : String(cellValue)
                            : ""}
                        </td>
                      );
                    })}
                    <td className="p-3 border border-gray-300 text-center flex items-center justify-center">
                      <Button variant="outline" className="mr-2">
                        <Pencil /> <span>Edit</span>
                      </Button>
                      <Button className="bg-red-500">
                        <span>Delete</span> <Trash2 />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columnDef.length + 1}
                    className="p-4 text-center text-gray-500"
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {filteredItems.length > 8 && (
        <div className="pt-6 pb-3 border border-slate-300">
          <Pagination>
            <PaginationContent className="flex justify-center mt-4">
              <PaginationItem>
                <Button
                  variant={"outline"}
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }
                >
                  Previous
                </Button>
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "border border-slate-200 text-gray-600"
                          : ""
                      }
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <Button
                  variant={"outline"}
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Table;
