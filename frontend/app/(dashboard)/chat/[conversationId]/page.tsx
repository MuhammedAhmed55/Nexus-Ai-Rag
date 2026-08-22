"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Sparkles, FileText, Loader2, ArrowLeft, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"
import { useChat } from "@/hooks/use-chat"
import { ChatComposer } from "@/components/chat/chat-composer"

export default function ConversationPage() {
    const params = useParams()
    const conversationId = params.conversationId as string

    const { messages, isLoading, error, sendMessage } = useChat(conversationId)

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background relative">
            {/* Header */}
            <div className="border-b border-white/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/chat">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                            Chat
                        </h1>
                        <p className="text-xs text-muted-foreground/80">
                            Ask your documents anything
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                        <Sparkles className="h-3 w-3" />
                        Ollama
                    </Badge>
                </div>
            </div>

            {/* Messages Area — the only scrollable region */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-8 space-y-8 scroll-smooth">
                <div className="max-w-4xl mx-auto space-y-8 w-full">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-4 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.role === "assistant" && (
                                <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                                        AI
                                    </AvatarFallback>
                                </Avatar>
                            )}

                            <div
                                className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}
                            >
                                <div
                                    className={`rounded-2xl px-5 py-3.5 shadow-sm ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                                        : "glass-strong rounded-tl-sm border-white/5"
                                        }`}
                                >
                                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                                    {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <p className="text-xs font-medium text-muted-foreground/80 mb-2.5 uppercase tracking-wider">
                                                Sources
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.sources.map((citation, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all cursor-pointer group"
                                                    >
                                                        <FileText className="h-3.5 w-3.5 text-accent" />
                                                        <span className="text-xs font-medium text-foreground/90 group-hover:text-foreground">
                                                            {citation.document_name}
                                                        </span>
                                                        {citation.page_number && (
                                                            <span className="text-[11px] text-muted-foreground font-mono bg-black/20 px-1.5 py-0.5 rounded">
                                                                p.{citation.page_number}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {msg.role === "assistant" && (
                                    <div className="flex items-center gap-1.5 ml-1">
                                        <Button variant="ghost" size="icon-xs" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon-xs" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                            <ThumbsUp className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon-xs" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                            <ThumbsDown className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-4 w-full">
                            <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                                <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                                    AI
                                </AvatarFallback>
                            </Avatar>
                            <div className="glass-strong rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border-white/5 flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Generating response...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ChatComposer
                isLoading={isLoading}
                placeholder="Ask about your documents..."
                onSend={(content, documentIds) => sendMessage(content, documentIds)}
            />
        </div>
    )
}