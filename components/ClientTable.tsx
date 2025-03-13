"use client";

import { IconSearch } from "@tabler/icons-react";
import { ArrowDownUp, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { Client } from "@/types";
import MainLoader from "./ui/MainLoader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";

async function getClients() {
  try {
    const response = await axios.get("/api/clients");
    const data = response.data.clients;
    return data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return null;
  }
}

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

  // useEffect(() => {
  //   async function getClients() {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get("/api/clients");
  //       const data = response.data;
  //       setClients(data.clients);
  //       setFilteredClients(data.clients);
  //     } catch (error) {
  //       console.error("Error fetching clients:", error);
  //       setClients([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   getClients();
  // }, []);

  function sortByClient() {
    console.log("Clicked");
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

  return (
    <div className="p-6 bg-white border border-slate-400 rounded-lg mt-8">
      {/* Search & Filter Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <input
            placeholder="Search Clients..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => filterForClients(e.target.value)}
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
                <th className="p-3 text-left border border-gray-300">
                  <Button
                    variant={"ghost"}
                    className="text-md font-semibold cursor-pointer hover:bg-transparent"
                    onClick={sortByClient}
                  >
                    Client <ArrowDownUp />
                  </Button>
                </th>
                <th className="p-3 text-left border border-gray-300">
                  <Button
                    variant={"ghost"}
                    className="text-md font-semibold cursor-pointer hover:bg-transparent"
                    onClick={sortByEmail}
                  >
                    Email <ArrowDownUp />
                  </Button>
                </th>
                <th className="p-3 text-left border border-gray-300">
                  Address
                </th>
                <th className="p-3 text-left border border-gray-300">
                  Company
                </th>
                <th className="p-3 text-center border border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentClients.length > 0 ? (
                currentClients.map((client, idx) => (
                  <tr
                    key={idx}
                    className="border border-gray-300 even:bg-slate-100 hover:bg-slate-50 transition-all"
                  >
                    <td className="p-3 border border-gray-300">
                      {client.name}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {client.email}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {client.address}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {client.name}
                    </td>
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
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {filteredClients.length > 8 && (
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

export default ClientTable;
