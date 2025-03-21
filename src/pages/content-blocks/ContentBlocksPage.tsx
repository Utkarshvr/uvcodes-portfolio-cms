import LoadingBackdrop from "@/components/LoadingBackdrop";
import { Button } from "@/components/ui/button";
import { fetchAllContentBlocks } from "@/lib/firebase/helpers";
import ContentBlockType from "@/type/ContentBlockType";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function ContentBlocksPage() {
  const [isFetching, setIsFetching] = useState(false);

  const [allLinks, setAllLinks] = useState<ContentBlockType[]>([]);
  const [allTexts, setAllTexts] = useState<ContentBlockType[]>([]);

  useEffect(() => {
    (async () => {
      setIsFetching(true);
      const { contentBlocks, isSuccess } = await fetchAllContentBlocks();
      if (!isSuccess) return toast("Error while fetching content blocks");

      setIsFetching(false);
      setAllTexts(contentBlocks.filter((e) => e.type === "text"));
      setAllLinks(contentBlocks.filter((e) => e.type === "link"));
    })();
  }, []);

  if (isFetching) return <LoadingBackdrop />;

  return (
    <section className="flex flex-col m-auto w-full gap-4 max-w-[2400px] mt-4 px-2">
      <div className="flex flex-row justify-between">
        <h1 className="text-slate-700 dark:text-slate-300 font-semibold">
          All Texts & Links
        </h1>
        <Link to={"create"}>
          <Button>
            <Plus /> Create
          </Button>
        </Link>
      </div>

      <div className="flex flex-row gap-4">
        <div className="flex flex-[0.5] flex-col gap-4">
          <h4 className="text-slate-700 text-sm dark:text-slate-300 font-semibold">
            Texts
          </h4>
          {allTexts.map((p) => (
            <div className="flex flex-col bg-slate-200 rounded-md dark:bg-slate-900 gap-1 px-4 py-2">
              <p className="text-slate-700 text-xs dark:text-slate-400">
                {p.title}
              </p>
              <p className="text-sm">{p.text}</p>

              <Link to={p.id || ""} className="w-fit">
                <Button variant={"secondary"} size={"sm"}>
                  View
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <div className="flex flex-[0.5] flex-col gap-4">
          <h4 className="text-slate-700 text-sm dark:text-slate-300 font-semibold">
            Links
          </h4>
          {allLinks.map((p) => (
            <div className="flex flex-col bg-slate-200 rounded-md dark:bg-slate-900 gap-1 px-4 py-2">
              <p className="text-slate-700 text-xs dark:text-slate-400">
                {p.title}
              </p>
              <Link className="w-fit" to={p.text || ""}>
                <p className="text-sky-500 text-sm">{p.text}</p>
              </Link>

              <Link className="w-fit" to={p.id || ""}>
                <Button variant={"secondary"} size={"sm"}>
                  View
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
