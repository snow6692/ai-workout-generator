"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, UserIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";
import { ModeToggle } from "@/app/components/ModeToggle";

const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-5  right-5 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1 bg-primary/10 rounded">
            <ZapIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="md:text-xl hidden sm:block  font-bold font-mono">
            Snow Workout
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-5">
          {isSignedIn ? (
            <>
              <Link
                href="/generate-program"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                <DumbbellIcon size={16} />
                <span>Generate</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>

              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button
                  variant={"outline"}
                  className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                >
                  Sign In
                </Button>
              </SignInButton>
            </>
          )}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
