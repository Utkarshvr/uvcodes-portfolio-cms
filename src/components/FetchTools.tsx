import LoadingBackdrop from "@/components/LoadingBackdrop";
import { fetchAllDocs } from "@/lib/firebase/helpers";
import useTools from "@/store/ToolsStore";
import ToolType from "@/type/ToolType";
import { useEffect } from "react";
import { toast } from "sonner";

export default function FetchTools() {
  const { setTools, setIsFetching, isFetching } = useTools();

  useEffect(() => {
    (async () => {
      setIsFetching(true);
      const { data, isSuccess } = await fetchAllDocs<ToolType>("tools");
      if (!isSuccess) return toast("Error while fetching content blocks");

      setIsFetching(false);
      if (data) setTools(data);
    })();
  }, []);

  if (isFetching) return <LoadingBackdrop />;

  return null;
}
