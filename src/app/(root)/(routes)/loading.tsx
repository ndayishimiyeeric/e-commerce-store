import {Skeleton} from "@/components/ui/Skeleton";
import Heading from "@/components/ui/Heading";
import React from "react";
import {Separator} from "@/components/ui/Separator";

const Loading = () => {
  return (
      <div className="flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
              <Heading title="Dashboard" description="Overview of your store"/>
              <Separator/>
          </div>
      </div>
  );
}

export default Loading;