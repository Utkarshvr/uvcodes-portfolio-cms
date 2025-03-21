import BackBtn from "@/components/BackBtn";
import DeleteBtn from "@/components/DeleteBtn";
import ProjectBrandingForm from "@/components/forms/ProjectBrandingForm";
import ProjectInfoForm from "@/components/forms/ProjectInfoForm";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchProjectByID } from "@/lib/firebase/helpers";
import ProjectType from "@/type/ProjectType";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function ProjectPage() {
  const { projectID } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const TAB = searchParams.get("tab");

  const [project, setProject] = useState<null | ProjectType>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!projectID) return;

    (async () => {
      setIsFetching(true);
      const { error, isSuccess, project } = await fetchProjectByID(projectID);
      if (isSuccess) {
        setProject(project);
      } else toast(error?.message || "Unkown Error");
      setIsFetching(false);
    })();
  }, [projectID]);

  if (!projectID) return;

  if (isFetching) return <LoadingBackdrop />;

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={TAB === "branding" ? "branding" : "info"}
        onValueChange={(selectedTab) => {
          setSearchParams((prev) => {
            prev.set("tab", selectedTab);
            return prev;
          });
        }}
        className="max-w-[2200px] min-h-svh"
      >
        <div className="flex flex-row justify-between items-center mb-4">
          <TabsList className="grid grid-cols-2 w-full max-w-[800px] self-center">
            <TabsTrigger value="info">Project Info</TabsTrigger>
            <TabsTrigger value="branding">Project Branding</TabsTrigger>
          </TabsList>
          <div className="flex flex-row gap-2 items-center">
            <DeleteBtn
              label="Project"
              collection_name="projects"
              id={projectID}
            />
            <BackBtn />
          </div>
        </div>

        <TabsContent className="px-2" value="info">
          {project && <ProjectInfoForm edit project={project} />}
        </TabsContent>
        <TabsContent className="px-2" value="branding">
          {project && <ProjectBrandingForm project={project} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
