<<<<<<< HEAD
<<<<<<< HEAD
"use client";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CookRegistrationForm } from "@/components/cook/registration-form";
import {Loader_cook} from "@/components/ui/join_us";
=======
=======
>>>>>>> origin/main
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { CookRegistrationForm } from "@/components/cook/registration-form"

export const metadata: Metadata = {
  title: "Cook Registration",
  description: "Register as a home cook and start selling your meals",
}
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main

export default function CookRegistrationPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="relative z-20 flex justify-center items-center">
        <div className="flex items-center text-5xl font-medium tracking-tight text-center">
          <Loader_cook />
        </div>
        </div>
        <div className="flex-grow relative z-20 flex justify-center items-center my-8">
          <Image
            src="https://ejtjwejiulepzcglswis.supabase.co/storage/v1/object/public/webpage-images//cook.jpg"
            alt="Register Banner"
            width={500}
            height={700}
            className=" object-cover shadow-xl"
          />
=======
=======
>>>>>>> origin/main
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} className="mr-2" />
<<<<<<< HEAD
          FoodConnect
=======
          CampusDabba
>>>>>>> a6396a4 (Version lOLZ)
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
<<<<<<< HEAD
<<<<<<< HEAD
              "Joining CampusDabba as a home cook has been incredible. I can now
              share my passion for cooking with students while earning from
              home."
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
              "Joining FoodConnect as a home cook has been incredible. I can now share my passion for cooking with
=======
              "Joining CampusDabba as a home cook has been incredible. I can now share my passion for cooking with
>>>>>>> a6396a4 (Version lOLZ)
              students while earning from home."
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
<<<<<<< HEAD
<<<<<<< HEAD
            <h1 className="text-2xl font-semibold tracking-tight">
              Create a cook account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
=======
            <h1 className="text-2xl font-semibold tracking-tight">Create a cook account</h1>
            <p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
            <h1 className="text-2xl font-semibold tracking-tight">Create a cook account</h1>
            <p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
>>>>>>> origin/main
          </div>
          <CookRegistrationForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
<<<<<<< HEAD
<<<<<<< HEAD
            <Link
              href="/cook/login"
              className="underline underline-offset-4 hover:text-primary"
            >
=======
            <Link href="/cook/login" className="underline underline-offset-4 hover:text-primary">
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
            <Link href="/cook/login" className="underline underline-offset-4 hover:text-primary">
>>>>>>> origin/main
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
<<<<<<< HEAD
<<<<<<< HEAD
  );
}
=======
  )
}

>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
  )
}

>>>>>>> origin/main
