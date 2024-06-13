import { clerkMiddleware } from "@clerk/nextjs/server";
import { AllowedOrigin } from "@prisma/client";

export default clerkMiddleware(async (auth, req) => {
  const origin = req.headers.get("origin") ?? "";
  const { pathname } = req.nextUrl;
  const isApiRoute =
    pathname.startsWith("/api") &&
    !pathname.startsWith("/api/stores") &&
    !pathname.startsWith("/api/webhook") &&
    !pathname.includes("/origins");

  if (isApiRoute && req.method === "GET") {
    const storeId = pathname.match(/\/api\/([^/]+)\/./)?.[1];
    const URL =
      process.env.NODE_ENV === "production"
        ? "https://estore.nderic.com"
        : "http://localhost:3000";
    const origins = (await fetch(`${URL}/${storeId}/origins`).then((res) =>
      res.json()
    )) as AllowedOrigin[];

    if (origins.some((o) => o.origin === origin)) {
      req.headers.set("Access-Control-Allow-Origin", origin);
      req.headers.set("Access-Control-Allow-Methods", "GET");
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
