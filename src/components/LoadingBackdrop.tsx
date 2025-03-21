import { Loader } from "lucide-react";
export default function LoadingBackdrop() {
  return (
    <div className="flex bg-neutral-950 h-screen justify-center w-screen fixed items-center left-0 opacity-70 top-0">
      <Loader size={36} />
    </div>
  );
}
