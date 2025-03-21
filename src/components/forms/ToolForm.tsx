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
import { Input } from "@/components/ui/input";

import { createFB, updateFB } from "@/lib/firebase/helpers";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Check, Loader, Minus, Upload, X } from "lucide-react";
import ToolType from "@/type/ToolType";
import UploadWidget from "../cloudinary/UploadWidget";

const formSchema = z.object({
  name: z.string().nonempty("Name is required!"),
  image: z.string().nonempty("Image is required!"),
});

export default function ToolForm({
  edit = false,
  data,
}: {
  edit?: boolean;
  data?: ToolType;
}) {
  const navigate = useNavigate();

  const [isWorking, setIsWorking] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  async function createNew(values: z.infer<typeof formSchema>) {
    setIsWorking(true);
    const { isSuccess, error } = await createFB("tools", {
      ...values,
      isPublished: false,
    });
    if (isSuccess) {
      toast(`Tool added`);
      navigate(`/tools`);
    } else toast(error?.message || "An error occured!");
    setIsWorking(false);
  }

  async function updateExisting(values: z.infer<typeof formSchema>) {
    setIsWorking(true);
    if (!data?.id) return console.log("data ID is not provided!");
    const { isSuccess, error } = await updateFB("tools", data.id, {
      ...values,
      isPublished: false,
    });
    if (isSuccess) {
      toast("Updated!");
      navigate(`/tools`);
    } else toast(error?.message || "An error occured!");
    setIsWorking(false);
  }

  const formArray: {
    name: "name" | "image";
    label: string;
    placeholder: string;
  }[] = [
    {
      name: "name",
      label: "Name",
      placeholder: "expo",
    },
    {
      name: "image",
      label: "Image",
      placeholder: "img",
    },
  ];

  useEffect(() => {
    if (edit && data) {
      formArray.forEach((f) => form.setValue(f.name, data[f.name] || ""));
    }
  }, [data, edit]);

  const [imgUrlInput, setImgUrlInput] = useState("");

  function handleImgUpload(error, result, widget) {
    if (error) {
      toast(JSON.stringify(error) || "Unkown error");
      widget.close({
        quiet: true,
      });
      return;
    }
    form.setValue("image", result?.info?.secure_url);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={
          edit
            ? form.handleSubmit(updateExisting)
            : form.handleSubmit(createNew)
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
                  {f.name === "image" ? (
                    <>
                      {form.getValues("image") ? (
                        <div className="w-fit relative">
                          <img
                            src={form.getValues("image")}
                            alt="image"
                            className="border h-[160px] rounded-full w-[160px] object-contain"
                          />
                          <Button
                            onClick={() => form.setValue("image", "")}
                            variant={"destructive"}
                            className="absolute right-2 top-2"
                          >
                            <Minus />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-row justify-between gap-6 items-center">
                          <UploadWidget onUpload={handleImgUpload}>
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
                            {imgUrlInput && (
                              <div className="flex flex-col justify-center p-2 rounded-md bottom-16 dark:bg-slate-900 fixed gap-2 items-center right-4">
                                <img
                                  src={imgUrlInput}
                                  alt="icon"
                                  className="h-[240px] w-[360px] object-contain"
                                />
                                <div className="flex flex-row gap-2">
                                  <Button
                                    onClick={() => {
                                      form.setValue("image", imgUrlInput);
                                      setImgUrlInput("");
                                    }}
                                  >
                                    <Check />
                                  </Button>
                                  <Button
                                    onClick={() => setImgUrlInput("")}
                                    variant={"destructive"}
                                  >
                                    <X />
                                  </Button>
                                </div>
                              </div>
                            )}

                            <Input
                              value={imgUrlInput}
                              onChange={(e) => setImgUrlInput(e.target.value)}
                              type="url"
                              className="max-w-[500px]"
                              placeholder="https:images/img.png"
                            />
                          </div>
                        </div>
                      )}
                    </>
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
          {isWorking ? <Loader /> : edit ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
