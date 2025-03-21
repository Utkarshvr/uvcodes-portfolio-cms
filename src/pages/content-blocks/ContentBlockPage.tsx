import BackBtn from "@/components/BackBtn";
import DeleteBtn from "@/components/DeleteBtn";
import ContentBlockForm from "@/components/forms/ContentBlockForm";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import { fetchDocByID } from "@/lib/firebase/helpers";
import ContentBlockType from "@/type/ContentBlockType";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

export default function ContentBlockPage() {
  const { id } = useParams();

  const [contentBlock, setContentBlock] = useState<null | ContentBlockType>(
    null
  );
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setIsFetching(true);
      const { error, isSuccess, data } = await fetchDocByID(
        "content-blocks",
        id
      );
      if (isSuccess) {
        setContentBlock(data as ContentBlockType);
      } else toast(error?.message || "Unkown Error");
      setIsFetching(false);
    })();
  }, [id]);

  if (isFetching) return <LoadingBackdrop />;
  if (!id) return;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center self-end">
        <DeleteBtn collection_name="content-blocks" id={id} />
        <BackBtn />
      </div>
      {contentBlock && <ContentBlockForm edit data={contentBlock} />}
    </div>
  );
}
