// "use client";

// import { Button } from "@/components/ui/button";
// import { useEffect } from "react";

// export default function Error({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string };
//   reset: () => void;
// }) {
//   useEffect(() => {
//     console.log(error);
//   }, [error]);
//   return (
//     <main className="flex flex-col items-center justify-center h-full">
//       <h1 className="text-2xl">Something went wrong!</h1>
//       <Button onClick={() => reset()}>Try Again</Button>
//     </main>
//   );
// }
'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an external monitoring service (optional)
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <html>
      <head>
        <title>Something Went Wrong</title>
      </head>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p>{error.message}</p>
          <button
            onClick={() => {
              // Attempt to recover by reloading the page or resetting the boundary
              reset();
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}