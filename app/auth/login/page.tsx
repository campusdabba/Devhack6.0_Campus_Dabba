<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

<<<<<<< HEAD
=======

>>>>>>> 071bc5d (v5)
=======

>>>>>>> ef737eb (V6)
"use client";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {Loader_login} from "@/components/ui/join_us";
import { LoginForm } from "@/components/auth/login-form";


<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD

=======
>>>>>>> origin/main



=======
>>>>>>> a6396a4 (Version lOLZ)
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Login",
  description: "Login to your account",
=======
  title: "Login | CampusDabba",
  description: "Login to your CampusDabba account",
>>>>>>> a6396a4 (Version lOLZ)
}

<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
        <div className="relative z-20 flex justify-center items-center">
          <div className="flex items-center text-5xl font-medium tracking-tight text-center">
            <Loader_login />
          </div>
        </div>
        <div className="flex-grow relative z-20 flex justify-center items-center my-8">
          <Image
            src="https://ejtjwejiulepzcglswis.supabase.co/storage/v1/object/public/webpage-images//login.webp"
            alt="Login Banner"
            width={500}
            height={700}
            className=" object-cover shadow-xl"
          />
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
              "CampusDabba has transformed how I discover and enjoy authentic
              home-cooked meals. The variety and quality are amazing!"
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
              "FoodConnect has transformed how I discover and enjoy authentic home-cooked meals. The variety and quality
=======
              "CampusDabba has transformed how I discover and enjoy authentic home-cooked meals. The variety and quality
>>>>>>> a6396a4 (Version lOLZ)
              are amazing!"
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======
              "CampusDabba has transformed how I discover and enjoy authentic
              home-cooked meals. The variety and quality are amazing!"
>>>>>>> 071bc5d (v5)
=======
              "CampusDabba has transformed how I discover and enjoy authentic
              home-cooked meals. The variety and quality are amazing!"
>>>>>>> ef737eb (V6)
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
<<<<<<< HEAD
<<<<<<< HEAD
            <p className="text-sm text-muted-foreground">
              Enter your credentials to sign in to your account
            </p>
=======
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
>>>>>>> origin/main
=======
            <p className="text-sm text-muted-foreground">
              Enter your credentials to sign in to your account
            </p>
>>>>>>> 071bc5d (v5)
=======
            <p className="text-sm text-muted-foreground">
              Enter your credentials to sign in to your account
            </p>
>>>>>>> ef737eb (V6)
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
            <Link
              href="/auth/register"
              className="underline underline-offset-4 hover:text-primary"
            >
<<<<<<< HEAD
<<<<<<< HEAD
=======
            <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
            <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
  );
}
>>>>>>> 071bc5d (v5)
=======
  );
}
>>>>>>> ef737eb (V6)
