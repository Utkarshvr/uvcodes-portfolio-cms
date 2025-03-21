import ProjectType from "@/type/ProjectType";
import { Button } from "../ui/button";
import { Check, Minus, Upload, X } from "lucide-react";
import { useState } from "react";
import UploadWidget from "../cloudinary/UploadWidget";
import { toast } from "sonner";
import { updateProject } from "@/lib/firebase/helpers";
import { useNavigate } from "react-router";
import { Input } from "../ui/input";

export default function ProjectBrandingForm({
  project,
}: {
  project: ProjectType;
}) {
  const [form, setForm] = useState({
    icon: project?.icon || "",
    images: project?.images || [],
  });
  const navigate = useNavigate();

  function handleIconUpload(error, result, widget) {
    if (error) {
      toast(JSON.stringify(error) || "Unkown error");
      widget.close({
        quiet: true,
      });
      return;
    }
    setForm((prev) => ({ ...prev, icon: result?.info?.secure_url }));
  }

  function handleImageUpload(error, result, widget) {
    if (error) {
      toast(JSON.stringify(error) || "Unkown error");
      widget.close({
        quiet: true,
      });
      return;
    }
    setForm((prev) => ({
      icon: prev.icon,
      images: [...prev.images, result?.info?.secure_url as string],
    }));
  }

  async function handleOnSubmit() {
    if (!project?.id) return;
    const { isSuccess, error } = await updateProject(project.id, {
      icon: form.icon,
      images: form.images,
    });

    if (isSuccess) {
      toast("Project Info Updated Successfully!");
      navigate("/");
    } else toast(error?.message || "An error occured!");
  }

  const [iconURLInput, setIconURLInput] = useState("");
  const [imageURLInput, setImageURLInput] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h4 className="text-lg text-slate-500 font-semibold">Icon</h4>

        {form.icon ? (
          <div className="w-fit relative">
            <img
              src={form.icon}
              alt="icon"
              className="border h-[160px] rounded-full w-[160px] object-contain"
            />
            <Button
              onClick={() => setForm((prev) => ({ ...prev, icon: "" }))}
              variant={"destructive"}
              className="absolute right-2 top-2"
            >
              <Minus />
            </Button>
          </div>
        ) : (
          <div className="flex flex-row justify-between gap-6 items-center">
            <UploadWidget onUpload={handleIconUpload}>
              {({ open }) => {
                function handleOnClick(e) {
                  e.preventDefault();
                  open();
                }
                return (
                  <Button
                    onClick={handleOnClick}
                    variant={"outline"}
                    className="h-[160px] rounded-full w-[160px]"
                  >
                    <Upload /> Upload
                  </Button>
                );
              }}
            </UploadWidget>
            <p className="m-auto font-bold">OR</p>
            <div className="flex flex-col w-full gap-1">
              {iconURLInput && (
                <div className="flex flex-col justify-center p-2 rounded-md bottom-16 dark:bg-slate-900 fixed gap-2 items-center right-4">
                  <img
                    src={iconURLInput}
                    alt="icon"
                    className="h-[240px] w-[360px] object-contain"
                  />
                  <div className="flex flex-row gap-2">
                    <Button
                      onClick={() => {
                        setForm((prev) => ({ ...prev, icon: iconURLInput }));
                        setIconURLInput("");
                      }}
                    >
                      <Check />
                    </Button>
                    <Button
                      onClick={() => setIconURLInput("")}
                      variant={"destructive"}
                    >
                      <X />
                    </Button>
                  </div>
                </div>
              )}

              <Input
                value={iconURLInput}
                onChange={(e) => setIconURLInput(e.target.value)}
                type="url"
                className="max-w-[500px]"
                placeholder="https:images/img.png"
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-lg text-slate-500 font-semibold">Images</h4>

        <div className="flex flex-row flex-wrap gap-4">
          {form.images.map((img) => (
            <div key={img} className="w-fit relative">
              <img
                src={img}
                alt="image"
                className="border h-[240px] rounded-md w-[360px] object-contain"
              />
              <Button
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    images: prev.images.filter((i) => i !== img),
                  }))
                }
                variant={"destructive"}
                className="absolute right-2 top-2"
              >
                <Minus />
              </Button>
            </div>
          ))}
          <div className="flex flex-col justify-between w-fit gap-3 items-center">
            <UploadWidget onUpload={handleImageUpload}>
              {({ open }) => {
                function handleOnClick(e) {
                  e.preventDefault();
                  open();
                }
                return (
                  <Button
                    onClick={handleOnClick}
                    variant={"outline"}
                    className="h-[240px] rounded-md w-[360px]"
                  >
                    <Upload /> Upload
                  </Button>
                );
              }}
            </UploadWidget>

            <p className="m-auto font-bold">OR</p>
            <div className="flex flex-col w-full gap-1">
              {imageURLInput && (
                <div className="flex flex-col justify-center p-2 rounded-md bottom-16 dark:bg-slate-900 fixed gap-2 items-center right-4">
                  <img
                    src={imageURLInput}
                    alt="icon"
                    className="h-[240px] w-[360px] object-contain"
                  />
                  <div className="flex flex-row gap-2">
                    <Button
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          images: [...prev.images, imageURLInput],
                        }));
                        setImageURLInput("");
                      }}
                    >
                      <Check />
                    </Button>
                    <Button
                      onClick={() => setImageURLInput("")}
                      variant={"destructive"}
                    >
                      <X />
                    </Button>
                  </div>
                </div>
              )}

              <Input
                value={imageURLInput}
                onChange={(e) => setImageURLInput(e.target.value)}
                type="url"
                placeholder="https:images/img.png"
              />
            </div>
          </div>
        </div>
      </div>

      <Button className="w-fit" onClick={handleOnSubmit}>
        Done
      </Button>
    </div>
  );
}
