import {Skeleton} from "@/components/ui/Skeleton";
import React from "react";
import {Separator} from "@/components/ui/Separator";

const Loading = () => {
  return (
      <div className="flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
              <div className="space-y-4">
                 <Skeleton className="w-32 h-6 rounded-lg"/>
                 <Skeleton className="w-48 h-4 rounded-lg"/>
              </div>
              <Separator/>
              <div className="grid gap-4 grid-cols-3">
                  <Skeleton className="w-full h-32 rounded-lg"/>
                  <Skeleton className="w-full h-32 rounded-lg"/>
                  <Skeleton className="w-full h-32 rounded-lg"/>
              </div>
              <Skeleton className="w-full h-96 rounded-lg"/>
          </div>
      </div>
  );
}

export default Loading;