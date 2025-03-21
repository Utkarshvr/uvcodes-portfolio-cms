import LoadingBackdrop from "@/components/LoadingBackdrop";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function HomePage() {
  const nav = useNavigate();
  useEffect(() => {
    nav("/projects");
  }, []);

  return <LoadingBackdrop />;
}
