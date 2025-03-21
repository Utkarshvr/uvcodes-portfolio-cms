import { Button } from "@/components/ui/button";
import { createFB } from "@/lib/firebase/helpers";
import { toast } from "sonner";

const allTools: {
  name: string;
  image: string;
}[] = [];

export default function MiscellaneousPage() {
  async function handleAddTools() {
    allTools.map(async (t, index) => {
      const { isSuccess } = await createFB("tools", {
        name: t.name,
        image: t.image,
      });
      toast(isSuccess ? `${index + 1} uploaded` : `${index + 1} error`);
    });
  }

  return (
    <section className="flex flex-col m-auto w-full gap-4 max-w-[2400px] mt-4 px-2">
      <div className="flex flex-row justify-between">
        <h1 className="text-slate-700 dark:text-slate-300 font-semibold">
          Miscellaneous
        </h1>
      </div>

      <main className="flex flex-row flex-wrap gap-4">
        <Button onClick={handleAddTools}>Add All Tools</Button>
      </main>
    </section>
  );
}
