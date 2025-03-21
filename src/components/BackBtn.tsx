import { Button } from "./ui/button";
import { Link, useLocation } from "react-router";
import { ChevronLeft } from "lucide-react";

export default function BackBtn() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean); // Remove empty parts

  // Determine the previous route
  const prevRoute = paths.length > 1 ? `/${paths.slice(0, -1).join("/")}` : "/";

  return (
    <Link to={prevRoute}>
      <Button variant={"outline"}>
        <ChevronLeft /> Back
      </Button>
    </Link>
  );
}
