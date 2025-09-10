'use client';
import Link from "next/link";
import { Wand2, Menu, X, LogOut, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  // Main section pages
  const mainPages = [
    { href: "/audiences", label: "Audiences" },
    { href: "/campaigns", label: "Campaigns" },
    { href: "/ingest-data", label: "Ingest Data" },
    { href: "/api-docs", label: "API Documentation" },
  ];

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl">
      <div className="mx-4">
        <div className="flex h-12 items-center justify-between rounded-full border bg-background/80 backdrop-blur-sm px-3 sm:px-6 dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-shadow duration-300">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {/* <Wand2 className="h-5 w-5 text-primary" /> */}
            <span className="text-lg font-bold">XENO-CRM</span>
          </Link>
        </div>

        {/* Main Section Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {mainPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="text-sm font-medium px-2.5 py-1.5 rounded hover:bg-muted transition-colors"
            >
              {page.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer h-8 w-8 border">
                {session?.user?.image ? (
                  <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                ) : (
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {session ? (
                <>
                  <div className="px-3 py-2">
                    <div className="font-medium">{session.user?.name || "User"}</div>
                    <div className="text-xs text-muted-foreground truncate">{session.user?.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signIn(undefined, { callbackUrl: "/" })}
                  >
                    Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signIn(undefined, { callbackUrl: "/" })}
                  >
                    Sign Up
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden mx-4 mt-2">
          <div className="rounded-2xl border bg-background/80 backdrop-blur-sm shadow-lg py-4 px-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            {mainPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="block text-base font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {page.label}
              </Link>
            ))}
          </div>
          <div className="border-t pt-4 flex flex-col gap-2">
            {/* Avatar Dropdown for Mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9 border">
                  {session?.user?.image ? (
                    <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {session ? (
                  <>
                    <div className="px-3 py-2">
                      <div className="font-medium">{session.user?.name || "User"}</div>
                      <div className="text-xs text-muted-foreground truncate">{session.user?.email}</div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex gap-2 cursor-pointer"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signIn(undefined, { callbackUrl: "/dashboard" });
                      }}
                    >
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signIn(undefined, { callbackUrl: "/dashboard" });
                      }}
                    >
                      Sign Up
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          </div>
        </div>
      )}
    </header>
  );
}