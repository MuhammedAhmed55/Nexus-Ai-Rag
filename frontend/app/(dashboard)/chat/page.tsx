"use client"

import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import {
    Sparkles,
    FileText,
    Database,
    Zap,
    Briefcase,
    HelpCircle,
    AlertCircle,
    Loader2
} from "lucide-react"
import { useChat } from "@/hooks/use-chat"
import { ChatComposer, ChatComposerHandle } from "@/components/chat/chat-composer"

export default function ChatPage() {
    const { messages, isLoading, error, sendMessage } = useChat()
    const composerRef = useRef<ChatComposerHandle>(null)

    const suggestedPrompts = [
        {
            title: "What is our refund policy?",
            icon: <HelpCircle className="h-4 w-4" />,
            prompt: "What is our refund policy for enterprise customers according to the MSA?"
        },
        {
            title: "Summarize this document",
            icon: <FileText className="h-4 w-4" />,
            prompt: "Summarize the key points from the latest uploaded document."
        },
        {
            title: "Find the termination clause",
            icon: <Briefcase className="h-4 w-4" />,
            prompt: "Find the termination clause and explain the conditions."
        },
        {
            title: "What are the key obligations?",
            icon: <Zap className="h-4 w-4" />,
            prompt: "What are the key obligations for both parties?"
        }
    ]

    const handlePromptClick = (prompt: string) => {
        composerRef.current?.setMessage(prompt)
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">

            {/* ── Top bar ── */}
            <div className="border-b border-white/5 px-6 py-3 flex items-center justify-between shrink-0 z-20 bg-background/95 backdrop-blur">
                <h1 className="font-heading text-base font-semibold tracking-tight">New Chat</h1>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="gap-1.5 bg-primary/10 text-primary border-primary/20 text-xs">
                        <Sparkles className="h-3 w-3" />
                        Ollama
                    </Badge>
                </div>
            </div>

            {/* ── Chat Messages or Empty state — the only scrollable region ── */}
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center px-4 py-8">
                {messages.length === 0 ? (
                    <div className="max-w-2xl w-full flex flex-col items-center justify-center text-center space-y-8 my-auto">
                        <div className="space-y-3">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                                <Sparkles className="h-7 w-7 text-primary" />
                            </div>
                            <h2 className="text-3xl font-heading font-semibold tracking-tight">
                                Ask questions about your documents
                            </h2>
                            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
                                Upload your documents and start exploring them with Nexus AI.
                                Every answer is backed by a verifiable source.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                            {suggestedPrompts.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handlePromptClick(item.prompt)}
                                    className="group flex flex-col text-left p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.14] transition-all duration-150"
                                >
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                                            {item.icon}
                                        </span>
                                        <span className="font-medium text-sm text-foreground">{item.title}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        "{item.prompt}"
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl w-full space-y-6">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-4 py-3 rounded-2xl max-w-[85%] ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                    : 'bg-white/5 border border-white/10 rounded-tl-sm'
                                    }`}>
                                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>

                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 w-full">Sources</span>
                                            {msg.sources.map((src, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5 bg-background border border-white/10 px-2 py-1 rounded-md">
                                                    <FileText className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                                        {src.document_name}
                                                    </span>
                                                    {src.page_number !== null && src.page_number !== undefined && (
                                                        <span className="text-[10px] text-muted-foreground/60">
                                                            pg {src.page_number}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Generating response...</span>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="flex justify-start">
                                <div className="px-4 py-3 rounded-2xl bg-destructive/20 border border-destructive/30 rounded-tl-sm flex items-center gap-2 text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ChatComposer
                ref={composerRef}
                isLoading={isLoading}
                onSend={(content, documentIds) => sendMessage(content, documentIds)}
            />
        </div>
    )
}