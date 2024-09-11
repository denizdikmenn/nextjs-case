import { Suspense } from "react";
import { Homepage } from "./pages/Homepage";

export default function Home() {

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Suspense fallback={<div>Loading...</div>}>
          <Homepage />
        </Suspense>
      </main>
    </div>
  );
}
