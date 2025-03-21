import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <header className="bg-sidebar border rounded-md mb-4 px-4 py-2">
      <div className="flex flex-row gap-4 items-center">
        <SidebarTrigger
          onClick={() =>
            localStorage.setItem(
              "sidebar_state",
              localStorage.getItem("sidebar_state") === "true"
                ? "false"
                : "true"
            )
          }
        />

        <div className="flex flex-row gap-2 items-center">
          <img
            src="/logo.png"
            alt="logo"
            className="h-8 w-8"
          />
          <h1 className="text-lg text-slate-700 dark:text-slate-200 font-semibold">
            Portfolio CMS
          </h1>
        </div>
      </div>
    </header>
  );
}
