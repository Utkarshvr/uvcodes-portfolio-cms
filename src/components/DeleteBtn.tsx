import { deleteFB } from "@/lib/firebase/helpers";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function DeleteBtn({
  label,
  collection_name,
  id,
}: {
  collection_name: string;
  id: string;
  label?: string;
}) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={async () => {
        const { isSuccess, error } = await deleteFB(collection_name, id);
        if (isSuccess) navigate("/" + collection_name);
        else toast(error?.message || "Unkown Error");
      }}
      variant={"destructive"}
    >
      Delete {label || ""}
    </Button>
  );
}
