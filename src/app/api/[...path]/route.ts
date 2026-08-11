import type { NextRequest } from "next/server";

import { dispatch } from "@/server/router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = dispatch;
export const POST = dispatch;
export const PUT = dispatch;
export const PATCH = dispatch;
export const DELETE = dispatch;
