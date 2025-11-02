import { parseCookies, setCookie, destroyCookie } from "nookies";
import type { NextPageContext, GetServerSidePropsContext } from "next";
import type { TokenStorage } from "klog-sdk";
import { KLogSDK } from "klog-sdk";
import { siteConfig } from "@/lib/config";

const AUTH_TOKEN_KEY = "auth_token";

const baseURL = process.env.NEXT_PUBLIC_API_URL || siteConfig.apiUrl;
let kLogSDKInstance: KLogSDK | null = null;

type CookiesContext =
  | NextPageContext
  | GetServerSidePropsContext
  | null
  | undefined;

export class CookieTokenStorage implements TokenStorage {
  private ctx: CookiesContext = null;

  constructor(ctx: CookiesContext = null) {
    this.ctx = ctx;
  }

  getToken(): string | null {
    const cookies = parseCookies(this.ctx);
    return cookies[AUTH_TOKEN_KEY] || null;
  }

  setToken(token: string | null): void {
    if (token) {
      setCookie(this.ctx, AUTH_TOKEN_KEY, token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    } else {
      this.clearToken();
    }
  }

  clearToken(): void {
    destroyCookie(this.ctx, AUTH_TOKEN_KEY, {
      path: "/",
    });
  }
}

export function getKLogSDK(ctx: CookiesContext = null): KLogSDK {
  const isServer = typeof window === "undefined";

  if (isServer) {
    return new KLogSDK({
      baseURL,
      tokenStorage: new CookieTokenStorage(ctx),
    });
  }

  if (!kLogSDKInstance) {
    kLogSDKInstance = new KLogSDK({
      baseURL,
      tokenStorage: new CookieTokenStorage(),
      onTokenExpired: () => {
        console.log("Token expired on client, redirecting to login...");
        new CookieTokenStorage().clearToken();
      },
    });
  }
  return kLogSDKInstance;
}
