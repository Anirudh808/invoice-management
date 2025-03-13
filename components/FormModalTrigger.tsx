"use client";

import { addClient } from "@/lib/validations";
import { IconPlus } from "@tabler/icons-react";
import React, { useState } from "react";
import FormModal from "./FormModal";
import { Button } from "./ui/button";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DataProp = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const FormModalTrigger = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const addClientMutation = useMutation({
    mutationFn: async (newClient: DataProp) => {
      await axios.post("/api/clients", newClient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

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
        schema={addClient}
        defaultValues={{ name: "", email: "", phone: "", address: "" }}
        onSubmit={async (data: DataProp) => {
          console.log("Submitted Data:", data);
          addClientMutation.mutate(data);
          return { success: true }; // Simulate success
        }}
        type="ADD_CLIENT"
      />
    </div>
  );
};

export default FormModalTrigger;
