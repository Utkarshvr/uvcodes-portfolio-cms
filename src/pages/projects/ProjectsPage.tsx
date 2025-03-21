import LoadingBackdrop from "@/components/LoadingBackdrop";
import ProjectCard from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { fetchAllProjects } from "@/lib/firebase/helpers";
import ProjectType from "@/type/ProjectType";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    (async () => {
      setIsFetching(true);
      const { projects, isSuccess } = await fetchAllProjects();
      setIsFetching(false);
      if (!isSuccess) return toast("Error while fetching projects");

      setProjects(projects);
    })();
  }, []);

  if (isFetching) return <LoadingBackdrop />;

  return (
    <section className="flex flex-col m-auto w-full gap-4 max-w-[2400px] mt-4 px-2">
      <div className="flex flex-row justify-between">
        <h1 className="text-slate-700 dark:text-slate-300 font-semibold">
          All Projects
        </h1>
        <Link to={"create"}>
          <Button>
            <Plus /> Create
          </Button>
        </Link>
      </div>

      <main className="flex flex-row flex-wrap gap-4">
        {projects.map((p) => (
          <ProjectCard project={p} />
        ))}{" "}
      </main>
    </section>
  );
}
