"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React, { Suspense } from "react";

function UserIcon() {
  return (
    <div>
      <SignedIn>
        <Suspense
          fallback={<div className=" size-10 bg-black rounded-full " />}
        >
          <UserButton
            fallback={<div className=" size-10 bg-black rounded-full " />}
          />
        </Suspense>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
    </div>
  );
}

export default UserIcon;
