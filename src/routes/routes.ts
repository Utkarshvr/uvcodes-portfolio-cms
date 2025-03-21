import App from "@/App";
import ContentBlockPage from "@/pages/content-blocks/ContentBlockPage";
import ContentBlocksPage from "@/pages/content-blocks/ContentBlocksPage";
import CreateContentBlockPage from "@/pages/content-blocks/CreateContentBlockPage";
import HomePage from "@/pages/HomePage";
import MiscellaneousPage from "@/pages/miscellaneous/MiscellaneousPage";
import CreateProjectPage from "@/pages/projects/CreateProjectPage";
import ProjectPage from "@/pages/projects/ProjectPage";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import SignInPage from "@/pages/sign-in/SignInPage";
import CreateToolPage from "@/pages/tools/CreateToolPage";
import ToolPage from "@/pages/tools/ToolPage";
import ToolsPage from "@/pages/tools/ToolsPage";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { path: "", Component: HomePage },
      { path: "/miscellaneous", Component: MiscellaneousPage },
      {
        path: "projects",
        Component: ProjectsPage,
      },
      {
        path: "content-blocks",
        Component: ContentBlocksPage,
      },
      {
        path: "content-blocks/:id",
        Component: ContentBlockPage,
      },
      {
        path: "content-blocks/create",
        Component: CreateContentBlockPage,
      },
      {
        path: "tools",
        Component: ToolsPage,
      },
      {
        path: "tools/create",
        Component: CreateToolPage,
      },
      {
        path: "tools/:id",
        Component: ToolPage,
      },
      {
        path: "projects/:projectID",
        Component: ProjectPage,
      },
      {
        path: "projects/create",
        Component: CreateProjectPage,
      },
    ],
  },
  { path: "/sign-in", Component: SignInPage },
]);

export default router;
