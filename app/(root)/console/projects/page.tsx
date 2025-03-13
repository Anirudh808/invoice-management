import AddProject from "@/components/AddProject";
import FileDownload from "@/components/icons/FileDownload";
import ProjectTable from "@/components/ProjectTable";
import { Button } from "@/components/ui/button";

export default async function page() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl text-purple-950">Projects</h1>
          <p>View all of your Project information</p>
        </div>
        <div className="flex gap-4 items-center">
          <Button
            variant={"outline"}
            className="cursor-pointer px-6 py-3 text-lg rounded-md"
          >
            <FileDownload className="" /> Export
          </Button>
          <AddProject />
        </div>
      </div>
      <div className="w-full h-0.5 bg-slate-300 my-4"></div>
      <ProjectTable />
    </div>
  );
}
