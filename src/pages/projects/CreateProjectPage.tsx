import BackBtn from "@/components/BackBtn";
import ProjectInfoForm from "@/components/forms/ProjectInfoForm";

export default function CreateProjectPage() {
  return (
    <section className="flex flex-col gap-4 px-2">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl text-slate-700 dark:text-slate-300 font-semibold">
          Create a new Project
        </h1>
        <BackBtn />
      </div>

      <ProjectInfoForm />
    </section>
  );
}
