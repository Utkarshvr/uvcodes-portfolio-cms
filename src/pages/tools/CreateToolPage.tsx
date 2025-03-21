import BackBtn from "@/components/BackBtn";
import ToolForm from "@/components/forms/ToolForm";

export default function CreateToolPage() {
  return (
    <section className="flex flex-col gap-4 px-2">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl text-slate-700 dark:text-slate-300 font-semibold">
          Add a new Tool
        </h1>
        <BackBtn />
      </div>

      <ToolForm />
    </section>
  );
}
