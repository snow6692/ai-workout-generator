import { ModeToggle } from "@/app/components/ModeToggle";

import React from "react";
import UserIcon from "./UserIcon";

function Navbar() {
  return (
    <div className=" flex gap-4 items-center justify-end m-8">
      <ModeToggle />
      <UserIcon />
    </div>
  );
}

export default Navbar;
