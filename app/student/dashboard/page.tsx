"use client";

import { useState } from "react";
import { DashboardContent } from "@/components/student/dashboard/dashboard-content"
import { CooksList } from "@/components/student/dashboard/cooks-list";
import { NearbyCooksMap } from "@/components/student/dashboard/nearby-cooks-map";
import { states } from "@/lib/data/states";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function DashboardPage() {
  const [selectedState, setSelectedState] = useState("All States");

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Find Home Cooks Near You</h1>
      
      <div className="w-full max-w-xs">
        <Select
          value={selectedState}
          onValueChange={setSelectedState}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All States">All States</SelectItem>
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Nearby Cooks Map */}
      <NearbyCooksMap />
      
      {/* List of Cooks */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Available Cooks</h2>
        <CooksList selectedState={selectedState} />
      </div>
    </div>
  );
}

