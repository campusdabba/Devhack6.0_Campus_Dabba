<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
import type { Metadata } from "next"
import { CooksList } from "@/components/student/dashboard/cooks-list"
import { StatesFilter } from "@/components/student/dashboard/states-filter"

export const metadata: Metadata = {
  title: "Browse Cooks",
  description: "Find and explore home cooks in your area",
}

export default function BrowseCooksPage() {
=======
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
"use client";

import type { Metadata } from "next";
import { CooksList } from "@/components/student/dashboard/cooks-list";
import { StatesFilter } from "@/components/student/dashboard/states-filter";
import { createContext, useState } from "react";
import { metadata } from "./metadata";

export default function BrowseCooksPage() {
  const [selectedState, setSelectedState] = useState("All States");

  const handleStateChange = (state: string) => {
    setSelectedState(state);
  };
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Cooks</h1>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> origin/main
        <p className="text-muted-foreground">Discover talented home cooks and their delicious offerings</p>
      </div>
      <StatesFilter />
      <CooksList />
    </div>
  )
}




=======
<<<<<<< HEAD
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
        <p className="text-muted-foreground">
          Discover talented home cooks and their delicious offerings
        </p>
      </div>
      <StatesFilter
        selectedState={selectedState}
        onStateChange={handleStateChange}
      />
      <CooksList selectedState={selectedState} />
    </div>
  );
}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
>>>>>>> a6396a4 (Version lOLZ)
>>>>>>> origin/main
=======
>>>>>>> 071bc5d (v5)
=======
>>>>>>> ef737eb (V6)
