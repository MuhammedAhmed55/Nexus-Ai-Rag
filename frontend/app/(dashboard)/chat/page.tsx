"use client"

import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Sparkles,
    FileText,
    Plus,
    X,
    Database,
    Zap,
    Briefcase,
    HelpCircle,
    ArrowUp,
    AlertCircle,
    Loader2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useChat } from "@/hooks/use-chat"
import { DocumentService } from "@/services/document.service"

export default function ChatPage() {
    const [message, setMessage] = useState("")
    const [attachments, setAttachments] = useState<File[]>([])
    const [documentIds, setDocumentIds] = useState<string[]>([])
    const [isUploading, setIsUploading] = useState(false)
    
    const { messages, isLoading, error, sendMessage } = useChat()
    
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

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

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!message.trim()) return
        
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

    // Opens the native OS file picker instead of faking a file
    const handleAttachment = () => {
        fileInputRef.current?.click()
    }

    // Fired once the user actually picks file(s) from their device
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return
        
        setIsUploading(true)
        const newAttachments = Array.from(files)
        setAttachments((prev) => [...prev, ...newAttachments])
        
        // upload files
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
        setDocumentIds(documentIds.filter((_, i) => i !== index))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    const handlePromptClick = (prompt: string) => {
        setMessage(prompt)
        if (textareaRef.current) {
            textareaRef.current.focus()
            textareaRef.current.style.height = "auto"
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
                }
            }, 10)
        }
    }

    const canSend = message.trim().length > 0 && !isLoading && !isUploading

    return (
        <div className="flex flex-col h-full bg-background">

            {/* ── Top bar ── */}
            <div className="border-b border-white/5 px-6 py-3 flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur">
                <h1 className="font-heading text-base font-semibold tracking-tight">New Chat</h1>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-white/5 px-2.5 py-1.5 rounded-md border border-white/8">
                        <Database className="h-3 w-3" />
                        <span>3 documents ready</span>
                    </div>
                    <Badge variant="outline" className="gap-1.5 bg-primary/10 text-primary border-primary/20 text-xs">
                        <Sparkles className="h-3 w-3" />
                        Ollama
                    </Badge>
                </div>
            </div>

            {/* ── Chat Messages or Empty state ── */}
            <div className="flex-1 overflow-y-auto flex flex-col items-center px-4 py-8">
                {messages.length === 0 ? (
                    <div className="max-w-2xl w-full flex flex-col items-center justify-center text-center space-y-8 my-auto">
                        {/* Hero */}
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

                        {/* Suggested prompts */}
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
                                <div className={`px-4 py-3 rounded-2xl max-w-[85%] ${
                                    msg.role === 'user' 
                                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                                        : 'bg-white/5 border border-white/10 rounded-tl-sm'
                                }`}>
                                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                                    
                                    {/* Sources */}
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

            {/* ── Prompt bar — single-row pill style ── */}
            <div className="px-4 pb-6 pt-2 w-full max-w-3xl mx-auto">

                {/* Attachment chips sit above the pill so the pill itself stays one row */}
                {(attachments.length > 0 || isUploading) && (
                    <div className="flex flex-wrap gap-2 px-1 pb-2">
                        {attachments.map((file, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-1.5 bg-white/8 border border-white/10 px-2.5 py-1.5 rounded-lg"
                            >
                                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                                <span className="text-xs font-medium max-w-[110px] truncate">{file.name}</span>
                                <span className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</span>
                                <button
                                    onClick={() => removeAttachment(idx)}
                                    className="ml-0.5 h-3.5 w-3.5 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    <X className="h-2.5 w-2.5" />
                                </button>
                            </div>
                        ))}
                        {isUploading && (
                            <div className="flex items-center gap-2 bg-white/8 border border-white/10 px-3 py-1.5 rounded-lg">
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
                                <span className="text-xs font-medium text-muted-foreground">Uploading...</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-1 w-full rounded-full border border-white/10 bg-[#1c1f27] pl-1.5 pr-1.5 py-1.5 transition-all duration-150 focus-within:border-white/[0.18] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_40px_rgba(0,0,0,0.5)]">

                    {/* Left: attach / upload */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.csv,.doc,.docx,.xls,.xlsx,.txt,.md,application/pdf,text/csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/markdown"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={handleAttachment}
                        title="Attach file"
                        className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                    </button>

                    {/* Middle: input, vertically centered, no internal padding fuss */}
                    <Textarea
                        ref={textareaRef}
                        placeholder="Ask anything"
                        value={message}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        className="min-h-[36px] max-h-[200px] flex-1 resize-none border-0 bg-transparent px-2 py-2 my-auto focus-visible:ring-0 shadow-none text-sm leading-relaxed placeholder:text-muted-foreground/40"
                        rows={1}
                    />

                    {/* Right: single send button */}
                    <button
                        onClick={() => handleSubmit()}
                        disabled={!canSend}
                        aria-label="Send message"
                        className={`h-9 w-9 shrink-0 flex items-center justify-center rounded-full font-medium transition-all duration-150 ${canSend
                                ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25"
                                : "bg-white/10 text-muted-foreground/40 cursor-not-allowed"
                            }`}
                    >
                        <ArrowUp className="h-[18px] w-[18px]" strokeWidth={2.5} />
                    </button>
                </div>

                <p className="text-center text-[11px] text-muted-foreground/35 mt-3">
                    Nexus AI can make mistakes. Consider verifying important information.
                </p>
            </div>
        </div>
    )
}