import ClientTable from "@/components/ClientTable";
import FormModalTrigger from "@/components/FormModalTrigger";
import FileDownload from "@/components/icons/FileDownload";
import { Button } from "@/components/ui/button";

export default async function page() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl text-purple-950">Clients</h1>
          <p>View all of your Client information</p>
        </div>
        <div className="flex gap-4 items-center">
          <Button
            variant={"outline"}
            className="cursor-pointer px-6 py-3 text-lg rounded-md"
          >
            <FileDownload className="" /> Export
          </Button>
          <FormModalTrigger />
        </div>
      </div>
      <div className="w-full h-0.5 bg-slate-300 my-4"></div>
      <ClientTable />
    </div>
  );
}
