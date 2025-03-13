"use client";

import React, { useEffect, useState } from "react";
import { Project } from "@/types";
import { getProjects } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Table from "./Table";

const ProjectTable = () => {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  const [filteredProject, setFilteredProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (projects) {
      setFilteredProjects(projects);
    }
  }, [projects]);

  const projectsPerPage = 8;
  let currentProjects: Project[] = [];
  const [titleSortOrder, setTitleSortOrder] = useState("desc");
  const [ClientSortOrder, setClientSortOrder] = useState("desc");
  const [dueDateSortOrder, setDueDateSortOrder] = useState("desc");
  let totalPages = 0;

  if (filteredProject.length > 0) {
    totalPages = Math.ceil(filteredProject.length / projectsPerPage);

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    currentProjects = filteredProject.slice(
      indexOfFirstProject,
      indexOfLastProject
    );
  }

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

  function filterForProjects(value: string) {
    if (projects !== undefined) {
      const projectsFiltered = projects.filter((project) =>
        project.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProjects(projectsFiltered);
    }
  }

  function sortByTitle() {
    if (titleSortOrder === "desc") {
      const sortedByTitle = filteredProject.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setFilteredProjects(sortedByTitle);
      setTitleSortOrder("asc");
    } else {
      const sortedByTitle = filteredProject.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      setFilteredProjects(sortedByTitle);
      setTitleSortOrder("desc");
    }
  }

  function sortByClient() {
    if (ClientSortOrder === "desc") {
      const sortedByClient = filteredProject.sort((a, b) =>
        a.client.name.localeCompare(b.client.name)
      );
      setFilteredProjects(sortedByClient);
      setClientSortOrder("asc");
    } else {
      const sortedByClient = filteredProject.sort((a, b) =>
        b.client.name.localeCompare(a.client.name)
      );
      setFilteredProjects(sortedByClient);
      setClientSortOrder("desc");
    }
  }

  function sortByDueDate() {
    if (dueDateSortOrder === "desc") {
      const sortedByDueDate = filteredProject.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
      setFilteredProjects(sortedByDueDate);
      setDueDateSortOrder("asc");
    } else {
      const sortedByDueDate = filteredProject.sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      );
      setFilteredProjects(sortedByDueDate);
      setDueDateSortOrder("desc");
    }
  }

  const columnDef: Array<{
    columnName: string;
    key: keyof Project;
    isSortable?: boolean;
    sortFn?: () => void;
  }> = [
    {
      columnName: "Title",
      key: "title",
      isSortable: true,
      sortFn: sortByTitle,
    },
    {
      columnName: "Status",
      key: "status",
    },
    {
      columnName: "Client",
      key: "client",
      isSortable: true,
      sortFn: sortByClient,
    },
    {
      columnName: "Due Date",
      key: "dueDate",
      isSortable: true,
      sortFn: sortByDueDate,
    },
  ];

  return (
    <Table
      type="project"
      filterData={filterForProjects}
      isLoading={isLoading}
      columnDef={columnDef}
      currentItems={currentProjects}
      filteredItems={filteredProject}
      prevPage={prevPage}
      nextPage={nextPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
    />
  );

  // return (
  //   <div className="p-6 bg-white border border-slate-400 rounded-lg mt-8">
  //     {/* Search & Filter Section */}
  //     <div className="flex justify-between items-center mb-4">
  //       <div className="relative w-full max-w-sm">
  //         <input
  //           placeholder="Filter emails..."
  //           className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           onChange={(e) => filterForProjects(e.target.value)}
  //         />
  //         <IconSearch className="absolute text-gray-400 size-5 right-3 top-1/2 transform -translate-y-1/2" />
  //       </div>
  //       <Button variant="outline" className="flex gap-2">
  //         <ListFilter /> <span>Filter</span>
  //       </Button>
  //     </div>

  //     {/* Table */}
  //     {isLoading ? (
  //       <div className="w-full flex justify-center">
  //         <MainLoader />
  //       </div>
  //     ) : (
  //       <div className="overflow-x-auto">
  //         <table className="w-full border-collapse border border-gray-300 rounded-lg">
  //           <thead>
  //             <tr className="bg-slate-200 text-gray-700">
  //               <th className="p-3 text-left border border-gray-300">Title</th>
  //               <th className="p-3 text-left border border-gray-300">Status</th>
  //               <th className="p-3 text-left border border-gray-300">Client</th>
  //               <th className="p-3 text-left border border-gray-300">
  //                 DueDate
  //               </th>
  //               <th className="p-3 text-center border border-gray-300">
  //                 Actions
  //               </th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {currentProjects.length > 0 ? (
  //               currentProjects.map((project, idx) => (
  //                 <tr
  //                   key={idx}
  //                   className="border border-gray-300 even:bg-slate-100 hover:bg-slate-50 transition-all"
  //                 >
  //                   <td className="p-3 border border-gray-300">
  //                     {project.title}
  //                   </td>
  //                   <td className="p-3 border border-gray-300">
  //                     {project.status}
  //                   </td>
  //                   <td className="p-3 border border-gray-300">
  //                     {project.client.name}
  //                   </td>
  //                   <td className="p-3 border border-gray-300">
  //                     {new Date(project.dueDate).toLocaleDateString()}
  //                   </td>
  //                   <td className="p-3 border border-gray-300 text-center flex items-center justify-center">
  //                     <Button variant="outline" className="mr-2">
  //                       <Pencil /> <span>Edit</span>
  //                     </Button>
  //                     <Button className="bg-red-500">
  //                       <span>Delete</span> <Trash2 />
  //                     </Button>
  //                   </td>
  //                 </tr>
  //               ))
  //             ) : (
  //               <tr>
  //                 <td colSpan={5} className="p-4 text-center text-gray-500">
  //                   No clients found.
  //                 </td>
  //               </tr>
  //             )}
  //           </tbody>
  //         </table>
  //       </div>
  //     )}
  //     {filteredProject.length > 8 && (
  //       <div className="pt-6 pb-3 border border-slate-300">
  //         <Pagination>
  //           <PaginationContent className="flex justify-center mt-4">
  //             <PaginationItem>
  //               <Button
  //                 variant={"outline"}
  //                 onClick={prevPage}
  //                 disabled={currentPage === 1}
  //                 className={
  //                   currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
  //                 }
  //               >
  //                 Previous
  //               </Button>
  //             </PaginationItem>

  //             {Array.from({ length: totalPages }, (_, i) => i + 1).map(
  //               (page) => (
  //                 <PaginationItem key={page}>
  //                   <PaginationLink
  //                     onClick={() => setCurrentPage(page)}
  //                     className={
  //                       currentPage === page
  //                         ? "border border-slate-200 text-gray-600"
  //                         : ""
  //                     }
  //                   >
  //                     {page}
  //                   </PaginationLink>
  //                 </PaginationItem>
  //               )
  //             )}

  //             <PaginationItem>
  //               <Button
  //                 variant={"outline"}
  //                 onClick={nextPage}
  //                 disabled={currentPage === totalPages}
  //                 className={
  //                   currentPage === totalPages
  //                     ? "opacity-50 cursor-not-allowed"
  //                     : ""
  //                 }
  //               >
  //                 Next
  //               </Button>
  //             </PaginationItem>
  //           </PaginationContent>
  //         </Pagination>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default ProjectTable;
