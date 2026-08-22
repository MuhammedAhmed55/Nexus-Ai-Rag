import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 renamed the middleware.ts convention to proxy.ts — the file
// AND the exported function both had to change names. Old versions of
// Next.js looked for a named export called `middleware`; current versions
// require either a named export called `proxy` or a default export.
export async function proxy(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};