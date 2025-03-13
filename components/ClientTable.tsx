"use client";

import React, { useEffect, useState } from "react";
import { Client } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/lib/utils";
import Table from "./Table";

const ClientTable = () => {
  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClients,
  });
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [clientSortOrder, setClientSortOrder] = useState("desc");
  const [emailSortOrder, setEmailSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const clientsPerPage = 8;
  let totalPages = 0;
  let currentClients: Client[] = [];

  if (filteredClients.length > 0) {
    totalPages = Math.ceil(filteredClients.length / clientsPerPage);

    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    currentClients = filteredClients.slice(
      indexOfFirstClient,
      indexOfLastClient
    );
  }

  useEffect(() => {
    if (clients) {
      setFilteredClients(clients);
    }
  }, [clients]);

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

  function sortByClient() {
    if (clientSortOrder === "desc") {
      const sortedByClient = filteredClients.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setFilteredClients(sortedByClient);
      setClientSortOrder("asc");
    } else {
      const sortedByClient = filteredClients.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
      setFilteredClients(sortedByClient);
      setClientSortOrder("desc");
    }
  }

  function sortByEmail() {
    if (emailSortOrder === "desc") {
      const sortedByEmail = filteredClients.sort((a, b) =>
        a.email.localeCompare(b.email)
      );
      setFilteredClients(sortedByEmail);
      setEmailSortOrder("asc");
    } else {
      const sortedByEmail = filteredClients.sort((a, b) =>
        b.email.localeCompare(a.email)
      );
      setFilteredClients(sortedByEmail);
      setEmailSortOrder("desc");
    }
  }

  function filterForClients(value: string) {
    if (clients !== undefined) {
      const clientsFiltered = clients.filter((client) =>
        client.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredClients(clientsFiltered);
    }
  }

  const columnDef: Array<{
    columnName: string;
    key: keyof Client;
    isSortable?: boolean;
    sortFn?: () => void;
  }> = [
    {
      columnName: "Client",
      key: "name",
      isSortable: true,
      sortFn: sortByClient,
    },
    {
      columnName: "Email",
      key: "email",
      isSortable: true,
      sortFn: sortByEmail,
    },
    {
      columnName: "Address",
      key: "address",
    },
    {
      columnName: "Company",
      key: "name",
    },
  ];

  return (
    <Table
      type="client"
      filterData={filterForClients}
      isLoading={isLoading}
      columnDef={columnDef}
      currentItems={currentClients}
      filteredItems={filteredClients}
      prevPage={prevPage}
      nextPage={nextPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
    />
  );
};

export default ClientTable;
