/// <reference types="@cloudflare/workers-types" />

declare namespace Cloudflare {
  interface Env {
    DB: D1Database
    FILES: R2Bucket
    AUTH_SECRET?: string
    GOOGLE_CLIENT_ID?: string
    GOOGLE_CLIENT_SECRET?: string
    SENIOR_MEMBER_EMAILS?: string
  }
}
