"use client";

import { addProject } from "@/lib/validations";
import { IconPlus } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import FormModal from "./FormModal";
import { Button } from "./ui/button";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types";

type DataProp = {
  title: string;
  description: string;
  dueDate: string;
  clientId: number;
};

const AddProject = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [clients, setclients] = useState<Client[]>([]);
  const queryClient = useQueryClient();

  const addProjectMutation = useMutation({
    mutationFn: async (newProject: DataProp) => {
      newProject.dueDate = new Date(newProject.dueDate).toISOString();
      console.log("from mutation", newProject);
      await axios.post("/api/projects", newProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  useEffect(() => {
    async function getClients() {
      try {
        const response = await axios.get("/api/clients");
        setclients(response.data.clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    }

    getClients();
  }, []);

  return (
    <div>
      <Button
        className="bg-purple-500 px-6 py-3 text-lg rounded-md hover:bg-purple-700 cursor-pointer"
        onClick={() => setIsFormModalOpen(true)}
      >
        <IconPlus /> Add New
      </Button>

      <FormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        schema={addProject}
        defaultValues={{ title: "", description: "", dueDate: "", clientId: 1 }}
        onSubmit={async (data: DataProp) => {
          data.dueDate = new Date(data.dueDate).toISOString();
          console.log(data.dueDate);
          try {
            console.log(`from onSubmit ${data}`);
            await addProjectMutation.mutateAsync(data); // Use mutateAsync instead of mutate
            return { success: true };
          } catch (error) {
            console.error("Mutation error:", error);
            return { success: false, message: "Failed to add project" };
          }
        }}
        type="ADD_PROJECT"
        clients={clients}
      />
    </div>
  );
};

export default AddProject;
