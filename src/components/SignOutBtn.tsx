import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/setup";

export default function SignOutBtn() {
  return (
    <Button onClick={() => signOut(auth)} variant={"secondary"}>
      <LogOut /> Sign Out
    </Button>
  );
}
