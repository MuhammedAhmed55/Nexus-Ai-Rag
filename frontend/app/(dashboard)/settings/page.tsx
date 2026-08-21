"use client"

import { useState, useEffect } from "react"
import { AuthService } from "@/services/auth.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    User,
    Key,
    Bell,
    Shield,
    Database,
    HardDrive,
    Globe,
    Moon,
    Sun,
    Cpu,
    Zap,
    Sparkles,
    Save,
    FileText,
    MessageSquare,
    AlertTriangle,
    Settings
} from "lucide-react"

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState("account")
    const [darkMode, setDarkMode] = useState(true)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [profile, setProfile] = useState<{ full_name: string, email: string, first_name: string, last_name: string } | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { user, profile: userProfile } = await AuthService.getUser()
                const fullName = userProfile.full_name || ''
                const parts = fullName.split(' ')
                const firstName = parts[0] || ''
                const lastName = parts.length > 1 ? parts.slice(1).join(' ') : ''
                
                setProfile({
                    full_name: fullName,
                    first_name: firstName,
                    last_name: lastName,
                    email: user.email || ''
                })
            } catch (error) {
                console.error("Failed to load user profile:", error)
            }
        }
        fetchProfile()
    }, [])

    const getInitials = (name: string) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    }

    const sections = [
        { id: "account", label: "Account Profile", icon: <User className="h-4 w-4" /> },
        { id: "models", label: "AI & Models", icon: <Cpu className="h-4 w-4" /> },
        { id: "chat", label: "Chat Preferences", icon: <MessageSquare className="h-4 w-4" /> },
        { id: "documents", label: "Documents", icon: <FileText className="h-4 w-4" /> },
        { id: "appearance", label: "Appearance", icon: <Globe className="h-4 w-4" /> },
    ]

    return (
        <div className="flex flex-col h-full bg-background relative overflow-y-auto">
            <div className="max-w-[1200px] w-full mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                        Settings
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">
                        Manage your account settings, AI model preferences, and customize your Nexus AI workspace.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:w-64 shrink-0">
                        <nav className="flex flex-col space-y-1">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        activeSection === section.id
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                    }`}
                                >
                                    {section.icon}
                                    {section.label}
                                </button>
                            ))}
                            
                            <Separator className="my-4 bg-white/10" />
                            
                            <button
                                onClick={() => setActiveSection("danger")}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                    activeSection === "danger"
                                        ? "bg-destructive/10 text-destructive"
                                        : "text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                                }`}
                            >
                                <AlertTriangle className="h-4 w-4" />
                                Danger Zone
                            </button>
                        </nav>
                    </aside>

                    {/* Main Settings Content */}
                    <main className="flex-1 max-w-3xl space-y-8">
                        {/* Account Section */}
                        {activeSection === "account" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Card className="glass-strong border-white/5 shadow-sm overflow-hidden">
                                    <CardHeader className="border-b border-white/5 bg-white/5">
                                        <CardTitle className="text-xl">Profile Information</CardTitle>
                                        <CardDescription>
                                            Update your personal details and public profile.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        <div className="flex items-center gap-6">
                                            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-semibold shrink-0">
                                                {profile ? getInitials(profile.full_name) : '--'}
                                            </div>
                                            <div className="space-y-2">
                                                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 shadow-none">
                                                    Change Avatar
                                                </Button>
                                                <p className="text-xs text-muted-foreground">
                                                    JPG, GIF or PNG. 1MB max.
                                                </p>
                                            </div>
                                        </div>
                                        <Separator className="bg-white/10" />
                                        {profile ? (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="firstName" className="text-foreground/80">First name</Label>
                                                    <Input id="firstName" defaultValue={profile.first_name} className="bg-white/5 border-white/10 focus-visible:ring-primary/50 shadow-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lastName" className="text-foreground/80">Last name</Label>
                                                    <Input id="lastName" defaultValue={profile.last_name} className="bg-white/5 border-white/10 focus-visible:ring-primary/50 shadow-none" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-[72px] animate-pulse bg-white/5 rounded-md" />
                                        )}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-foreground/80">Email address</Label>
                                            <Input id="email" type="email" value={profile?.email || ''} readOnly className="bg-white/5 border-white/10 text-muted-foreground focus-visible:ring-0 shadow-none cursor-not-allowed" />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t border-white/5 bg-black/10 py-4 px-6 flex justify-end">
                                        <Button className="gap-2 px-6 h-9 shadow-none">
                                            Save Changes
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}

                        {/* AI & Models Section */}
                        {activeSection === "models" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Card className="glass-strong border-white/5 shadow-sm overflow-hidden">
                                    <CardHeader className="border-b border-white/5 bg-white/5">
                                        <CardTitle className="text-xl">Ollama Configuration</CardTitle>
                                        <CardDescription>
                                            Manage your local AI models for privacy-first processing.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        <div className="space-y-3">
                                            <Label className="text-foreground/80">Generation Model</Label>
                                            <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 shadow-sm">
                                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                    <Zap className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-[15px]">llama3:8b</span>
                                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary border-primary/20">Active</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5">Primary model for chat generation</p>
                                                </div>
                                                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 shadow-none">
                                                    Change
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <Label className="text-foreground/80">Embedding Model</Label>
                                            <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                                                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                                                    <Database className="h-5 w-5 text-accent" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-[15px]">nomic-embed-text</span>
                                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground border-white/10">Connected</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5">Used for document vectorization</p>
                                                </div>
                                                <Button variant="outline" size="sm" className="bg-transparent border-white/10 hover:bg-white/10 shadow-none">
                                                    Change
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t border-white/5 bg-black/10 py-4 px-6 flex justify-between items-center">
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <Shield className="h-3.5 w-3.5" />
                                            All models run 100% locally.
                                        </p>
                                        <Button variant="secondary" className="gap-2 h-9 shadow-none bg-white/10 hover:bg-white/20">
                                            <HardDrive className="h-4 w-4" />
                                            Manage Ollama
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}

                        {/* Appearance Section */}
                        {activeSection === "appearance" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Card className="glass-strong border-white/5 shadow-sm overflow-hidden">
                                    <CardHeader className="border-b border-white/5 bg-white/5">
                                        <CardTitle className="text-xl">Appearance</CardTitle>
                                        <CardDescription>
                                            Customize the look and feel of your Nexus AI workspace.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <Label className="text-[15px] font-medium text-foreground">Dark Theme</Label>
                                                <p className="text-sm text-muted-foreground">Nexus AI is optimized for dark mode.</p>
                                            </div>
                                            <Switch
                                                checked={darkMode}
                                                onCheckedChange={setDarkMode}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </div>
                                        <Separator className="bg-white/10" />
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <Label className="text-[15px] font-medium text-foreground">Fluid Animations</Label>
                                                <p className="text-sm text-muted-foreground">Enable smooth transitions and micro-interactions.</p>
                                            </div>
                                            <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                        </div>
                                        <Separator className="bg-white/10" />
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <Label className="text-[15px] font-medium text-foreground">Compact Chat Mode</Label>
                                                <p className="text-sm text-muted-foreground">Reduce spacing between messages for high-density viewing.</p>
                                            </div>
                                            <Switch className="data-[state=checked]:bg-primary" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Danger Zone */}
                        {activeSection === "danger" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Card className="border border-destructive/20 bg-destructive/5 shadow-sm overflow-hidden">
                                    <CardHeader className="border-b border-destructive/10 bg-destructive/10">
                                        <CardTitle className="text-xl text-destructive flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5" />
                                            Danger Zone
                                        </CardTitle>
                                        <CardDescription className="text-destructive/80">
                                            Irreversible and destructive actions for your account.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-destructive/10">
                                            <div className="space-y-1 max-w-sm">
                                                <p className="font-medium text-foreground">Clear All Data</p>
                                                <p className="text-sm text-muted-foreground">Delete all your chat history, documents, and vector embeddings permanently.</p>
                                            </div>
                                            <Button variant="destructive" className="shrink-0 shadow-none">
                                                Clear Workspace
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Chat & Documents Placeholder Sections */}
                        {(activeSection === "chat" || activeSection === "documents") && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Card className="glass-strong border-white/5 shadow-sm overflow-hidden">
                                    <CardHeader className="border-b border-white/5 bg-white/5">
                                        <CardTitle className="text-xl capitalize">{activeSection} Preferences</CardTitle>
                                        <CardDescription>
                                            Configuration options for your {activeSection}.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <Settings className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                            <p className="text-lg font-medium">Coming Soon</p>
                                            <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                                                Advanced {activeSection} settings are currently under development.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    )
}