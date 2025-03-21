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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createFB, updateFB } from "@/lib/firebase/helpers";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import ContentBlockType from "@/type/ContentBlockType";

const formSchema = z.object({
  title: z.string().nonempty("Title is required!"),
  text: z.string().nonempty("Text is required!"),
  type: z.string().nonempty("Type is required!"),
});

export default function ContentBlockForm({
  edit = false,
  data,
}: {
  edit?: boolean;
  data?: ContentBlockType;
}) {
  const navigate = useNavigate();

  const [isWorking, setIsWorking] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      text: "",
      type: "text",
    },
  });

  async function createNew(values: z.infer<typeof formSchema>) {
    setIsWorking(true);
    const { isSuccess, error } = await createFB("content-blocks", {
      ...values,
      isPublished: false,
    });
    if (isSuccess) {
      toast(`${form.getValues().type === "link" ? "Link" : "Text"} added`);
      navigate(`/content-blocks`);
    } else toast(error?.message || "An error occured!");
    setIsWorking(false);
  }

  async function updateExisting(values: z.infer<typeof formSchema>) {
    setIsWorking(true);
    if (!data?.id) return console.log("data ID is not provided!");
    const { isSuccess, error } = await updateFB("content-blocks", data.id, {
      ...values,
      isPublished: false,
    });
    if (isSuccess) {
      toast("Updated!");
      navigate(`/content-blocks`);
    } else toast(error?.message || "An error occured!");
    setIsWorking(false);
  }

  const formArray: {
    name: "title" | "text" | "type";
    label: string;
    placeholder: string;
  }[] = [
    {
      name: "title",
      label: "Title",
      placeholder: "title",
    },
    {
      name: "text",
      label: "Text",
      placeholder: "text",
    },
    {
      name: "type",
      label: "Type",
      placeholder: "link",
    },
  ];

  useEffect(() => {
    if (edit && data) {
      formArray.forEach((f) => form.setValue(f.name, data[f.name] || ""));
    }
  }, [data, edit]);

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
                  {f.name === "type" ? (
                    <Select
                      value={form.getValues().type}
                      onValueChange={(val) => val && form.setValue("type", val)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Types</SelectLabel>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
