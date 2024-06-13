import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { AllowedOrigin } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
]);

const NextMiddleware = async (req: NextRequest) => {
  const response = NextResponse.next();
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
        ? "https://estore.nderic.com/api/"
        : "http://localhost:3000/api/";
    const origins = (await fetch(`${URL}${storeId}/origins`).then((res) =>
      res.json()
    )) as AllowedOrigin[];

    if (origins.some((o) => o.origin === origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "GET");
    }
  }

  return response;
};

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }

  return NextMiddleware(req);
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
