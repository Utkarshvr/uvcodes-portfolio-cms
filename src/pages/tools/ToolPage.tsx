import BackBtn from "@/components/BackBtn";
import DeleteBtn from "@/components/DeleteBtn";
import ToolForm from "@/components/forms/ToolForm";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import { fetchDocByID } from "@/lib/firebase/helpers";
import ToolType from "@/type/ToolType";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

export default function ToolPage() {
  const { id } = useParams();

  const [tool, setTool] = useState<null | ToolType>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setIsFetching(true);
      const { error, isSuccess, data } = await fetchDocByID<ToolType>(
        "tools",
        id
      );
      if (isSuccess) {
        setTool(data);
      } else toast(error?.message || "Unkown Error");
      setIsFetching(false);
    })();
  }, [id]);

  if (isFetching) return <LoadingBackdrop />;
  if (!id) return;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center self-end">
        <DeleteBtn label="Tool" collection_name="tools" id={id} />
        <BackBtn />
      </div>
      {tool && <ToolForm edit data={tool} />}
    </div>
  );
}
