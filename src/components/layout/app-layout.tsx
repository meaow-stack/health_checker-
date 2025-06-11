
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Home,
  BotMessageSquare,
  ClipboardCheck,
  Activity,
  BookOpenText,
  LogIn,
  UserPlus,
  HeartPulse,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chatbot', label: 'Symptom Chatbot', icon: BotMessageSquare },
  { href: '/prediction', label: 'Disease Prediction', icon: ClipboardCheck },
  { href: '/tracking', label: 'Symptom Tracking', icon: Activity },
  { href: '/advice', label: 'Health Advice', icon: BookOpenText },
];

const authNavItems = [
  { href: '/auth/login', label: 'Login', icon: LogIn },
  { href: '/auth/signup', label: 'Sign Up', icon: UserPlus },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold font-headline">HealthWise</h1>
          </Link>
        </SidebarHeader>
        <ScrollArea className="flex-1">
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      className="justify-start"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
        <Separator />
        <SidebarFooter className="p-4">
          <SidebarMenu>
            {authNavItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="justify-start"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
            {/* Example for a settings button - can be implemented later */}
            {/* <SidebarMenuItem>
              <Link href="/settings" legacyBehavior passHref>
                  <SidebarMenuButton isActive={pathname === "/settings"} tooltip="Settings" className="justify-start">
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                  </SidebarMenuButton>
              </Link>
            </SidebarMenuItem> */}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:h-16 sm:px-6 md:hidden">
          <SidebarTrigger />
          <Link href="/" className="flex items-center gap-2 md:hidden">
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="font-semibold font-headline">HealthWise</span>
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
        <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} HealthWise Assistant. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
