"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AuthService } from "@/services/auth.service"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    MessageSquare,
    FileText,
    Settings,
    Plus,
    Search,
    LogOut,
    Sparkles,
    Pin,
    MoreVertical,
    FolderOpen,
    Upload,
    Database,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react"

import { ChatService } from "@/services/chat.service"
import { format } from "date-fns"

interface Conversation {
    id: string;
    title: string;
    updated_at: string;
    pinned?: boolean;
}

export function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { toggleSidebar, state } = useSidebar()
    const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [profile, setProfile] = useState<{ full_name: string, email: string } | null>(null)

    const [conversations, setConversations] = useState<Conversation[]>([])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { user, profile: userProfile } = await AuthService.getUser()
                setProfile({
                    full_name: userProfile?.full_name || 'User',
                    email: user?.email || 'user@example.com'
                })
            } catch (error) {
                console.error("Failed to load user profile:", error)
            }
        }
        
        const fetchConversations = async () => {
            try {
                const { data, error } = await ChatService.getConversations()
                if (data && !error) {
                    setConversations(data)
                }
            } catch (error) {
                console.error("Failed to fetch conversations:", error)
            }
        }
        
        fetchProfile()
        fetchConversations()
    }, [pathname])

    const getInitials = (name: string) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    }

    const filteredChats = conversations.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const pinnedChats = conversations.filter(chat => chat.pinned)
    const recentChats = conversations.filter(chat => !chat.pinned)

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`)

    const handleLogout = async () => {
        await AuthService.logout()
        router.push("/")
    }

    return (
        <Sidebar collapsible="icon">
            {/* ── Header ───────────────────────────────────────────── */}
            <SidebarHeader className="p-0 border-b border-sidebar-border">

                {/* Logo row — hidden when collapsed, replaced by toggle */}
                <div className="flex items-center justify-between px-3 py-3">
                    {/* Logo: visible only when expanded */}
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 overflow-hidden group-data-[collapsible=icon]:hidden"
                    >
                        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                            <Sparkles className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-base tracking-tight">Nexus AI</span>
                    </Link>

                    {/* Collapse toggle — always visible, centered when collapsed */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent shrink-0 group-data-[collapsible=icon]:mx-auto"
                        title={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {state === "expanded"
                            ? <PanelLeftClose className="h-4 w-4" />
                            : <PanelLeftOpen className="h-4 w-4" />
                        }
                    </Button>
                </div>

                {/* Action buttons: New Chat + Search */}
                <div className="px-2 pb-2 flex flex-col gap-1.5 group-data-[collapsible=icon]:items-center">
                    {/* New Chat */}
                    <SidebarMenuButton
                        tooltip="New Chat"
                        onClick={() => setIsNewChatDialogOpen(true)}
                        className="h-9 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-medium border border-primary/20"
                    >
                        <Plus className="h-4 w-4 shrink-0" />
                        <span className="truncate">New Chat</span>
                    </SidebarMenuButton>

                    {/* Search */}
                    <SidebarMenuButton
                        tooltip="Search"
                        onClick={() => setIsSearchOpen(true)}
                        className="h-9 text-muted-foreground hover:text-foreground bg-sidebar-accent/50 hover:bg-sidebar-accent"
                    >
                        <Search className="h-4 w-4 shrink-0" />
                        <span className="truncate">Search chats...</span>
                    </SidebarMenuButton>
                </div>
            </SidebarHeader>

            {/* ── Main content ─────────────────────────────────────── */}
            <SidebarContent className="px-2 py-2 gap-0">

                {/* Nav: Chat & Documents */}
                <SidebarGroup className="p-0 mb-1">
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip="Chat"
                                    isActive={isActive("/chat")}
                                    render={<Link href="/chat" />}
                                >
                                    <MessageSquare className="h-4 w-4 shrink-0" />
                                    <span>Chat</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip="Documents"
                                    isActive={isActive("/documents")}
                                    render={<Link href="/documents" />}
                                >
                                    <FileText className="h-4 w-4 shrink-0" />
                                    <span>Documents</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Pinned chats */}
                {pinnedChats.length > 0 && (
                    <SidebarGroup className="p-0 mt-3">
                        <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-2 mb-0.5 group-data-[collapsible=icon]:hidden">
                            Pinned
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-0.5">
                                {pinnedChats.map(chat => (
                                    <SidebarMenuItem key={chat.id}>
                                        <SidebarMenuButton
                                            tooltip={chat.title}
                                            render={<Link href={`/chat/${chat.id}`} />}
                                        >
                                            <Pin className="h-3.5 w-3.5 shrink-0 text-primary" />
                                            <span className="truncate">{chat.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}

                {/* Recent chats */}
                {recentChats.length > 0 && (
                    <SidebarGroup className="p-0 mt-3">
                        <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-2 mb-0.5 group-data-[collapsible=icon]:hidden">
                            Recent
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-0.5">
                                {recentChats.map(chat => (
                                    <SidebarMenuItem key={chat.id}>
                                        <SidebarMenuButton
                                            tooltip={chat.title}
                                            render={<Link href={`/chat/${chat.id}`} />}
                                        >
                                            <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                                            <span className="truncate">{chat.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            {/* ── Footer / Profile ─────────────────────────────────── */}
            <SidebarFooter className="border-t border-sidebar-border p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                    data-slot="sidebar-menu-button"
                                    data-sidebar="menu-button"
                                    data-size="lg"
                                    className="peer/menu-button flex w-full items-center gap-2 rounded-md p-2 text-left text-sm outline-hidden transition-colors hover:bg-sidebar-accent group-data-[collapsible=icon]:!w-9 group-data-[collapsible=icon]:!h-9 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto data-[state=open]:bg-sidebar-accent"
                                >
                                    <Avatar className="h-7 w-7 rounded-lg shrink-0">
                                        <AvatarFallback className="rounded-lg bg-primary/20 text-primary text-xs font-semibold">
                                            {profile ? getInitials(profile.full_name) : '--'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
                                        <p className="text-sm font-medium truncate">{profile?.full_name || 'Loading...'}</p>
                                        <p className="text-xs text-muted-foreground truncate">{profile?.email || 'Loading...'}</p>
                                    </div>
                                    <MoreVertical className="h-4 w-4 shrink-0 text-muted-foreground ml-auto group-data-[collapsible=icon]:hidden" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                side={state === "collapsed" ? "right" : "top"}
                                align={state === "collapsed" ? "start" : "end"}
                                sideOffset={8}
                                className="w-56 bg-[#1c1f27] border border-white/10 rounded-xl shadow-2xl p-1"
                            >
                                {/* User info header inside menu */}
                                <div className="px-2 py-2 mb-1">
                                    <p className="text-sm font-medium">Alex Rivera</p>
                                    <p className="text-xs text-muted-foreground">alex@nexus.ai</p>
                                </div>
                                <DropdownMenuSeparator className="bg-white/10" />

                                <DropdownMenuItem
                                    className="gap-2 cursor-pointer py-2 focus:bg-white/8"
                                    onClick={() => router.push("/settings")}
                                >
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                    Settings
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-white/10" />

                                <DropdownMenuItem
                                    className="gap-2 cursor-pointer py-2 text-destructive focus:bg-white/8 focus:text-destructive"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            {/* Drag-to-resize rail */}
            <SidebarRail />

            {/* ── Dialogs ──────────────────────────────────────────── */}

            {/* New Chat dialog */}
            <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
                <DialogContent className="glass-strong sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Start a new chat</DialogTitle>
                        <DialogDescription>
                            Ask your documents anything — every answer traces back to a real source.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4">
                        <div
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer"
                            onClick={() => setIsNewChatDialogOpen(false)}
                        >
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm">Upload a document</p>
                                <p className="text-xs text-muted-foreground mt-0.5">PDF, DOCX, TXT up to 10MB</p>
                            </div>
                            <Upload className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/50 transition-all cursor-pointer"
                            onClick={() => { setIsNewChatDialogOpen(false); router.push("/chat") }}
                        >
                            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                                <Database className="h-5 w-5 text-accent" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm">Use existing documents</p>
                                <p className="text-xs text-muted-foreground mt-0.5">3 documents available</p>
                            </div>
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsNewChatDialogOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Search dialog */}
            <Dialog open={isSearchOpen} onOpenChange={(open) => { setIsSearchOpen(open); if (!open) setSearchQuery("") }}>
                <DialogContent className="glass-strong sm:max-w-[500px] p-0 gap-0 overflow-hidden">
                    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Input
                            placeholder="Search conversations..."
                            className="border-0 focus-visible:ring-0 bg-transparent shadow-none text-sm h-auto p-0"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {filteredChats.length > 0 ? (
                            <div className="p-1.5 space-y-0.5">
                                {filteredChats.map(chat => (
                                    <button
                                        key={chat.id}
                                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-left hover:bg-white/8 transition-colors"
                                        onClick={() => {
                                            setIsSearchOpen(false)
                                            setSearchQuery("")
                                            router.push(`/chat/${chat.id}`)
                                        }}
                                    >
                                        <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <span className="truncate">{chat.title}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                <Search className="h-8 w-8 mb-2 opacity-30" />
                                <p className="text-sm">No conversations found</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </Sidebar>
    )
}