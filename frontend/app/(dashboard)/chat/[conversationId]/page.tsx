"use client"

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    MessageSquare,
    Send,
    Sparkles,
    FileText,
    Loader2,
    ArrowLeft,
    Copy,
    ThumbsUp,
    ThumbsDown,
    Paperclip,
    X,
} from "lucide-react"
import Link from "next/link"
import { useChat } from "@/hooks/use-chat"
import { DocumentService } from "@/services/document.service"

export default function ConversationPage() {
    const params = useParams()
    const conversationId = params.conversationId as string
    
    const [message, setMessage] = useState("")
    const [attachments, setAttachments] = useState<File[]>([])
    const [documentIds, setDocumentIds] = useState<string[]>([])
    const [isUploading, setIsUploading] = useState(false)
    
    const { messages, isLoading, error, sendMessage } = useChat(conversationId)
    
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!message.trim() && attachments.length === 0) return

        const content = message
        setMessage("")
        
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
        }
        
        await sendMessage(content, documentIds)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
        e.target.style.height = "auto"
        e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
    }

    const handleAttachment = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return
        
        setIsUploading(true)
        const newAttachments = Array.from(files)
        setAttachments((prev) => [...prev, ...newAttachments])
        
        for (const file of newAttachments) {
            try {
                const { data, error } = await DocumentService.uploadDocument(file)
                if (data && data.document_id) {
                    setDocumentIds(prev => [...prev, data.document_id])
                }
            } catch (err) {
                console.error("Upload failed", err)
            }
        }
        
        setIsUploading(false)
        e.target.value = ""
    }

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    return (
        <div className="flex flex-col h-full bg-background relative">
            {/* Header */}
            <div className="border-b border-white/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 flex items-center justify-between sticky top-0 z-10">
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
                    <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                        <FileText className="h-3 w-3" />
                        <span>3 documents</span>
                    </div>
                    <Badge variant="outline" className="gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                        <Sparkles className="h-3 w-3" />
                        Ollama
                    </Badge>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8 scroll-smooth">
                <div className="max-w-4xl mx-auto space-y-8 w-full">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-4 w-full ${msg.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {msg.role === "assistant" && (
                                <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                                        AI
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            
                            <div
                                className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"
                                    }`}
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

            {/* Composer Input Area */}
            <div className="p-4 sm:p-6 w-full max-w-4xl mx-auto">
                <div className="relative flex flex-col w-full bg-card/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                    
                    {/* Attachments Preview Area */}
                    {attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 border-b border-white/5 bg-black/20">
                            {attachments.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg group">
                                    <FileText className="h-3.5 w-3.5 text-accent" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-foreground max-w-[120px] truncate">
                                            {file.name}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {formatFileSize(file.size)}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        className="h-5 w-5 ml-1 opacity-50 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive text-foreground rounded-full"
                                        onClick={() => removeAttachment(idx)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                            {isUploading && (
                                <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                                    <span className="text-xs font-medium text-muted-foreground">Uploading...</span>
                                </div>
                            )}
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.csv,.doc,.docx,.xls,.xlsx,.txt,.md,application/pdf,text/csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/markdown"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <Textarea
                        ref={textareaRef}
                        placeholder="Ask about your documents..."
                        value={message}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        className="min-h-[60px] max-h-[200px] w-full resize-none border-0 bg-transparent px-4 py-4 focus-visible:ring-0 shadow-none text-base sm:text-sm"
                        rows={1}
                    />
                    
                    <div className="flex items-center justify-between p-3 pt-0">
                        <div className="flex items-center gap-2">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon-sm" 
                                className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg"
                                onClick={handleAttachment}
                                title="Attach File"
                            >
                                <Paperclip className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button 
                            onClick={() => handleSubmit()} 
                            disabled={isLoading || isUploading || (!message.trim() && attachments.length === 0)}
                            className="rounded-lg gap-2 h-9 px-4 font-medium transition-all"
                        >
                            <span>Send</span>
                            <Send className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
                <div className="text-center mt-3">
                    <p className="text-[11px] text-muted-foreground/60">
                        Nexus AI can make mistakes. Consider verifying important information.
                    </p>
                </div>
            </div>
        </div>
    )
}