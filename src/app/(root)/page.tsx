import {Button} from "@/components/ui/Button";
import {UserButton} from "@clerk/nextjs";

export default function Home() {
  return (
      <div className="p-4">
          <UserButton afterSignOutUrl="/" />
      </div>
  )
}
