"use client";

import React, { useEffect, useState } from "react";
import { Invoice } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "@/lib/utils";
import Table from "./Table";

const InvoiceTable = () => {
  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [projectSortOrder, setProjectSortOrder] = useState("desc");
  const [amountSortOrder, setAmountSortOrder] = useState("desc");
  const [dueDateSortOrder, setDueDateSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const invoicesPerPage = 8;
  let totalPages = 0;
  let currentInvoices: Invoice[] = [];

  if (filteredInvoices.length > 0) {
    totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

    const indexOfLastInvoice = currentPage * invoicesPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
    currentInvoices = filteredInvoices.slice(
      indexOfFirstInvoice,
      indexOfLastInvoice
    );
  }

  useEffect(() => {
    if (invoices) {
      setFilteredInvoices(invoices);
    }
  }, [invoices]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  function sortByProject() {
    if (projectSortOrder === "desc") {
      const sortedByProject = filteredInvoices.sort((a, b) =>
        a.project.title.localeCompare(b.project.title)
      );
      setFilteredInvoices(sortedByProject);
      setProjectSortOrder("asc");
    } else {
      const sortedByProject = filteredInvoices.sort((a, b) =>
        b.project.title.localeCompare(a.project.title)
      );
      setFilteredInvoices(sortedByProject);
      setProjectSortOrder("desc");
    }
  }

  function sortByAmount() {
    if (amountSortOrder === "desc") {
      const sortedByAmount = filteredInvoices.sort(
        (a, b) => a.amount - b.amount
      );
      setFilteredInvoices(sortedByAmount);
      setAmountSortOrder("asc");
    } else {
      const sortedByAmount = filteredInvoices.sort(
        (a, b) => b.amount - a.amount
      );
      setFilteredInvoices(sortedByAmount);
      setAmountSortOrder("desc");
    }
  }

  function sortByDueDate() {
    if (dueDateSortOrder === "desc") {
      const sortedByDueDate = filteredInvoices.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
      setFilteredInvoices(sortedByDueDate);
      setDueDateSortOrder("asc");
    } else {
      const sortedByDueDate = filteredInvoices.sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      );
      setFilteredInvoices(sortedByDueDate);
      setDueDateSortOrder("desc");
    }
  }

  function filterForInvoice(value: string) {
    if (invoices !== undefined) {
      const invoicesFiltered = invoices.filter((invoice) =>
        invoice.project.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredInvoices(invoicesFiltered);
    }
  }

  const columnDef: Array<{
    columnName: string;
    key: string[] | keyof Invoice;
    isSortable?: boolean;
    sortFn?: () => void;
  }> = [
    {
      columnName: "Client",
      key: ["project", "client", "name"],
    },
    {
      columnName: "Project",
      key: ["project", "title"],
      isSortable: true,
      sortFn: sortByProject,
    },
    {
      columnName: "Due Date",
      key: "dueDate",
      isSortable: true,
      sortFn: sortByDueDate,
    },
    {
      columnName: "Amount",
      key: "amount",
      isSortable: true,
      sortFn: sortByAmount,
    },
    {
      columnName: "Status",
      key: "status",
    },
  ];

  return (
    <Table
      type="invoice"
      filterData={filterForInvoice}
      isLoading={isLoading}
      columnDef={columnDef}
      currentItems={currentInvoices}
      filteredItems={filteredInvoices}
      prevPage={prevPage}
      nextPage={nextPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
    />
  );
};

export default InvoiceTable;
