"use client";

import React, { useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Client } from "@/types";
interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; message?: string }>;
  type:
    | "ADD_CLIENT"
    | "EDIT_CLIENT"
    | "ADD_PROJECT"
    | "EDIT_PROJECT"
    | "ADD_INVOICE"
    | "EDIT_INVOICE";
  isOpen: boolean;
  onClose: () => void;
  clients?: Client[];
}

const FormModal = <T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  type,
  isOpen,
  onClose,
  clients,
}: Props<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });
  const [date, setDate] = React.useState<Date>();

  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen]);

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const projectData = { ...data, dueDate: date };
    const result = await onSubmit(projectData);
    if (result.success) {
      form.reset(); // Reset form after successful submission
      onClose(); // Close modal
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>{type.replace("_", " ")}</DialogTitle>
          <DialogDescription>
            {type.includes("ADD")
              ? "Fill the details to add a new entry"
              : "Edit the details"}
          </DialogDescription>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {Object.keys(defaultValues).map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {field.name === "clientId" ? "Select Client" : field.name}
                    </FormLabel>
                    <FormControl>
                      {field.name === "dueDate" ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[280px] justify-start text-left font-normal"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      ) : field.name === "clientId" &&
                        type === "ADD_PROJECT" ? (
                        <select
                          name="client"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        >
                          {clients?.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          required
                          placeholder={`Enter ${field.name}`}
                          {...field}
                        />
                      )}
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset(defaultValues); // Reset when cancel is clicked
                    onClose();
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
