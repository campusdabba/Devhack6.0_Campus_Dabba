<<<<<<< HEAD
<<<<<<< HEAD
"use client";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/ui/join_us";
import { RegisterForm } from "@/components/auth/register-form";
=======
=======
>>>>>>> origin/main
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Register",
  description: "Create your account",
}
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main

export default function RegisterPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="relative z-20 flex justify-center items-center">
          <div className="flex items-center text-5xl font-medium tracking-tight text-center">
            <Loader />
          </div>
        </div>
        <div className="flex-grow relative z-20 flex justify-center items-center my-8">
          <Image
            src="https://ejtjwejiulepzcglswis.supabase.co/storage/v1/object/public/webpage-images//register.webp"
            alt="Register Banner"
            width={500}
            height={700}
            className=" object-cover shadow-xl"
          />
=======
=======
>>>>>>> origin/main
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="https://source.unsplash.com/random/40x40?food"
<<<<<<< HEAD
            alt="FoodConnect Logo"
=======
            alt="CampusDabba Logo"
>>>>>>> a6396a4 (Version lOLZ)
            width={40}
            height={40}
            className="mr-2 rounded-lg"
          />
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
              "Join our community of food lovers and home chefs. Start your
              culinary journey today!"
            </p>
            <footer className="text-sm">The CampusDabba Team</footer>
=======
=======
>>>>>>> origin/main
              "Join our community of food lovers and home chefs. Start your culinary journey today!"
            </p>
<<<<<<< HEAD
            <footer className="text-sm">The FoodConnect Team</footer>
=======
            <footer className="text-sm">The CampusDabba Team</footer>
>>>>>>> a6396a4 (Version lOLZ)
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
<<<<<<< HEAD
<<<<<<< HEAD
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
=======
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
>>>>>>> origin/main
          </div>
          <RegisterForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
<<<<<<< HEAD
<<<<<<< HEAD
            <Link
              href="/auth/login"
              className="underline underline-offset-4 hover:text-primary"
            >
=======
            <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
            <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
>>>>>>> origin/main
              Sign in
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
