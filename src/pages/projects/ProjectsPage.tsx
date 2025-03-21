import LoadingBackdrop from "@/components/LoadingBackdrop";
import ProjectCard from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { fetchAllProjects, updateProjectOrder } from "@/lib/firebase/helpers";
import ProjectType from "@/type/ProjectType";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    (async () => {
      setIsFetching(true);
      const { projects, isSuccess } = await fetchAllProjects();
      setIsFetching(false);
      if (!isSuccess) return toast("Error while fetching projects");

      // Sort projects by position before setting state
      const sortedProjects = projects.sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      );

      setProjects(sortedProjects);
    })();
  }, []);

  // Handle drag end event
  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const reorderedProjects = Array.from(projects);
    const [movedProject] = reorderedProjects.splice(result.source.index, 1);
    reorderedProjects.splice(result.destination.index, 0, movedProject);

    const prevOrder = projects;
    setProjects(reorderedProjects); // Update UI instantly

    // Update Firestore
    const isSuccess = await updateProjectOrder(reorderedProjects);
    if (isSuccess) toast("Reordered");
    else {
      setProjects(prevOrder);
      toast("Error occured while reordering");
    }
  };

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

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => (
            <main
              className="flex flex-row flex-wrap justify-center gap-4 items-center"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {projects.map(
                (p, index) =>
                  p.id && (
                    <Draggable key={p.id} draggableId={p.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ProjectCard project={p} />
                        </div>
                      )}
                    </Draggable>
                  )
              )}
              {provided.placeholder}
            </main>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
}
