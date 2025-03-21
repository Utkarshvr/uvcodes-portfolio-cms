import LoadingBackdrop from "@/components/LoadingBackdrop";
import { Button } from "@/components/ui/button";
import useTools from "@/store/ToolsStore";
import { Plus } from "lucide-react";
import { Link } from "react-router";

export default function ToolsPage() {
  const { tools, isFetching } = useTools();

  if (isFetching) return <LoadingBackdrop />;
  return (
    <section className="flex flex-col m-auto w-full gap-4 max-w-[2400px] mt-4 px-2">
      <div className="flex flex-row justify-between">
        <h1 className="text-slate-700 dark:text-slate-300 font-semibold">
          All Tools
        </h1>
        <Link to={"create"}>
          <Button>
            <Plus /> Create
          </Button>
        </Link>
      </div>

      <main className="flex flex-row flex-wrap gap-4">
        {tools.map((d) => (
          <view
            key={d.id}
            className="flex flex-col bg-slate-200 border p-4 rounded-md dark:bg-slate-900 gap-4"
          >
            <div className="flex flex-col gap-1">
              <p className="text-slate-700 text-xs dark:text-slate-400">
                {d.name}
              </p>
              <img
                src={d.image}
                className="border h-28 rounded-full w-28 object-contain"
                alt="tool-img"
              />
            </div>

            <Link className="w-full" to={d.id || ""}>
              <Button className="w-full">View</Button>
            </Link>
          </view>
        ))}
      </main>
    </section>
  );
}
