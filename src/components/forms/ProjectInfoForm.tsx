import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProject, updateProject } from "@/lib/firebase/helpers";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import ProjectType, { PROJECT_TYPE_INTERFACE } from "@/type/ProjectType";
import { Loader } from "lucide-react";
import MultipleSelector, { Option } from "../ui/multiple-selector";
import useTools from "@/store/ToolsStore";

// Create an array from the type
const PROJECT_TYPES: PROJECT_TYPE_INTERFACE[] = [
  "app",
  "website",
  "landing-page",
  "ai",
] as const;

const formSchema = z.object({
  title: z.string().nonempty("Title is required!"),
  description: z.string().nonempty("Description is required!"),
  isPublished: z.string().nonempty("required!"),
  type: z.enum(
    [...PROJECT_TYPES] as [
      (typeof PROJECT_TYPES)[number],
      ...(typeof PROJECT_TYPES)[number][]
    ],
    {
      required_error: "Type is required!",
    }
  ),
  source_code: z.string().url("Source Code must be a valid URL!"),
  visit_link: z.string().url("Link must be a valid URL!"),

  tools: z.array(z.string()),
});

export default function ProjectInfoForm({
  edit = false,
  project,
}: {
  edit?: boolean;
  project?: ProjectType;
}) {
  const navigate = useNavigate();

  const [isWorking, setIsWorking] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublished: "no",
      type: "website",
      source_code: "",
      visit_link: "",
      tools: [],
    },
  });

  async function createNewProject(values: z.infer<typeof formSchema>) {
    setIsWorking(true);
    const { isSuccess, error, projectID } = await createProject({
      ...values,
      isPublished: false,
    });
    if (isSuccess) {
      toast("Project Created Successfully!");
      navigate(`/projects/${projectID}`);
    } else toast(error?.message || "An error occured!");
    setIsWorking(false);
  }

  async function updateExistingProject(values: z.infer<typeof formSchema>) {
    setIsWorking(true);
    if (!project?.id) return console.log("Project ID is not provided!");
    const { isSuccess, error } = await updateProject(project.id, {
      ...values,
      isPublished: values.isPublished === "yes",
    });
    if (isSuccess) {
      toast("Project Info Updated Successfully!");
    } else toast(error?.message || "An error occured!");
    setIsWorking(false);
  }

  let formArray: {
    name:
      | "title"
      | "description"
      | "source_code"
      | "visit_link"
      | "type"
      | "tools"
      | "isPublished";
    label: string;
    placeholder: string;
  }[] = [
    {
      name: "title",
      label: "Title",
      placeholder: "Instagram Clone",
    },
    {
      name: "description",
      label: "Description",
      placeholder: "It is an app...",
    },
    {
      name: "source_code",
      label: "Source Code",
      placeholder: "https://github.com/owner-name/project",
    },
    {
      name: "visit_link",
      label: "Link to your app/website",
      placeholder: "https://project-name.com",
    },
    {
      name: "type",
      label: "Type of Project",
      placeholder: "website",
    },
    {
      name: "tools",
      label: "Tools",
      placeholder: "",
    },
    {
      name: "isPublished",
      label: "Publish",
      placeholder: "",
    },
  ];

  formArray = edit
    ? formArray
    : formArray.filter((item) => item.name !== "isPublished");

  const { tools } = useTools();
  const OPTIONS: Option[] = tools.map((t) => ({
    value: t.id || "",
    label: t.name || "",
    image: t.image,
  }));

  useEffect(() => {
    if (edit && project) {
      console.log(project.tools);
      formArray.forEach((f) => {
        if (f.name !== "tools" && f.name !== "isPublished")
          form.setValue(f.name, project[f.name] || "");
        if (f.name === "isPublished" && project.isPublished)
          form.setValue("isPublished", project.isPublished ? "yes" : "no");
        if (f.name === "tools" && project.tools)
          form.setValue(
            "tools",
            project.tools.filter((t) => {
              const currentOpt = OPTIONS.find((o) => o.value === t);
              return currentOpt;
            })
          );
      });
    }
  }, [project, edit, tools]);

  return (
    <>
      {/* {isWorking && <LoadingBackdrop />} */}
      <Form {...form}>
        <form
          onSubmit={
            edit
              ? form.handleSubmit(updateExistingProject)
              : form.handleSubmit(createNewProject)
          }
          className="space-y-4"
        >
          {formArray.map((f) => (
            <FormField
              disabled={isWorking}
              key={f.name}
              control={form.control}
              name={f.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{f.label}</FormLabel>
                  <FormControl>
                    {f.name === "description" ? (
                      <Textarea
                        placeholder={f.placeholder}
                        className="resize-none"
                        {...field}
                      />
                    ) : f.name === "type" ? (
                      <Select
                        value={form.getValues().type}
                        onValueChange={(val) =>
                          val &&
                          form.setValue("type", val as PROJECT_TYPE_INTERFACE)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Types</SelectLabel>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="app">App</SelectItem>
                            <SelectItem value="landing-page">
                              Landing Page
                            </SelectItem>
                            <SelectItem value="ai">AI</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    ) : f.name === "isPublished" ? (
                      <div className="flex flex-row gap-2">
                        <Button
                          onClick={() => form.setValue("isPublished", "yes")}
                          variant={
                            form.getValues().isPublished === "yes"
                              ? "secondary"
                              : "outline"
                          }
                          size={"sm"}
                          type="button"
                        >
                          Yes
                        </Button>
                        <Button
                          onClick={() => form.setValue("isPublished", "no")}
                          variant={
                            form.getValues().isPublished !== "yes"
                              ? "secondary"
                              : "outline"
                          }
                          size={"sm"}
                          type="button"
                        >
                          No
                        </Button>
                      </div>
                    ) : f.name === "tools" ? (
                      <MultipleSelector
                        options={OPTIONS}
                        value={form
                          .getValues("tools")
                          .map((t) => {
                            const currentOpt = OPTIONS.find(
                              (op) => op.value === t
                            );
                            return currentOpt;
                          })
                          .filter((e) => e !== undefined)}
                        onChange={(options) =>
                          form.setValue(
                            "tools",
                            options.map((op) => op.value)
                          )
                        }
                        placeholder="Select tools"
                        emptyIndicator={
                          <p className="text-center text-gray-600 text-lg dark:text-gray-400 leading-10">
                            no results found.
                          </p>
                        }
                      />
                    ) : (
                      <Input placeholder={f.placeholder} {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button disabled={isWorking} type="submit">
            {isWorking ? <Loader /> : edit ? "Update" : "Next"}
          </Button>
        </form>
      </Form>
    </>
  );
}
