
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  LogOut,
  UserCircle,
  MessageSquareQuote,
  Info,
  Mail,
  MapPin, 
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ThemeToggleButton } from '@/components/common/theme-toggle-button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chatbot', label: 'Symptom Chatbot', icon: BotMessageSquare },
  { href: '/prediction', label: 'Disease Prediction', icon: ClipboardCheck },
  { href: '/tracking', label: 'Symptom Tracking', icon: Activity },
  { href: '/advice', label: 'Health Advice', icon: BookOpenText },
  { href: '/find-doctors', label: 'Find Doctors', icon: MapPin }, 
];

const unauthenticatedNavItems = [
  { href: '/auth/login', label: 'Login', icon: LogIn },
  { href: '/auth/signup', label: 'Sign Up', icon: UserPlus },
];

const footerNavItems = [
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/contact', label: 'Contact Us', icon: Mail },
  { href: '/feedback', label: 'Feedback', icon: MessageSquareQuote },
];


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Logout Failed',
        description: error.message || 'Could not log out.',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0]!.charAt(0).toUpperCase();
    return names[0]!.charAt(0).toUpperCase() + names[names.length - 1]!.charAt(0).toUpperCase();
  };
  
  const isChatPage = pathname === '/chatbot';

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4 flex items-center justify-between">
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
                  <SidebarMenuButton
                     asChild
                     isActive={pathname === item.href}
                     tooltip={item.label}
                     className="justify-start"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
        <Separator />
        <SidebarContent className="flex-grow-0">
          <SidebarMenu>
             {footerNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                   <SidebarMenuButton
                     asChild
                     isActive={pathname === item.href}
                     tooltip={item.label}
                     className="justify-start"
                     variant="ghost"
                     size="sm"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
             ))}
          </SidebarMenu>
        </SidebarContent>
        <Separator />
        <SidebarFooter className="p-4 space-y-3">
          <div className="flex justify-center">
             <ThemeToggleButton />
           </div>
          {loading ? (
            <div className="flex items-center space-x-2">
               <UserCircle className="h-5 w-5 text-muted-foreground" />
               <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : user ? (
            <>
              <SidebarMenu>
                <SidebarMenuItem>
                   <SidebarMenuButton tooltip={user.displayName || user.email || "User Profile"} className="justify-start h-auto py-2">
                      <Avatar className="h-7 w-7 mr-2">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(user.displayName || user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{user.displayName || 'User'}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</span>
                      </div>
                   </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </>
          ) : (
            <SidebarMenu>
              {unauthenticatedNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="justify-start"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className={cn(isChatPage && 'flex flex-col h-screen')}>
        <header className={cn(
          "sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:h-16 sm:px-6 md:hidden dark:bg-background/70",
          isChatPage && 'md:hidden'
        )}>
          <SidebarTrigger />
          <Link href="/" className="flex items-center gap-2 md:hidden">
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="font-semibold font-headline">HealthWise</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggleButton />
          </div>
        </header>
        <main className={cn(
            "flex flex-1 flex-col",
            !isChatPage && "p-4 sm:p-6 md:p-8"
        )}>
          {children}
        </main>
        {!isChatPage && (
            <footer className="border-t p-4 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} HealthWise Assistant. All rights reserved.
            </footer>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
