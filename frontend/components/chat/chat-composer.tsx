"use client"

import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Plus, X, Loader2, ArrowUp } from "lucide-react"
import { DocumentService } from "@/services/document.service"

export interface ChatComposerHandle {
    setMessage: (text: string) => void
    focus: () => void
}

interface ChatComposerProps {
    onSend: (content: string, documentIds: string[]) => void | Promise<void>
    isLoading?: boolean
    placeholder?: string
}

export const ChatComposer = forwardRef<ChatComposerHandle, ChatComposerProps>(function ChatComposer(
    { onSend, isLoading = false, placeholder = "Ask anything" },
    ref
) {
    const [message, setMessage] = useState("")
    const [attachments, setAttachments] = useState<File[]>([])
    const [documentIds, setDocumentIds] = useState<string[]>([])
    const [isUploading, setIsUploading] = useState(false)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const resizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
        }
    }

    useImperativeHandle(ref, () => ({
        setMessage: (text: string) => {
            setMessage(text)
            requestAnimationFrame(() => {
                textareaRef.current?.focus()
                resizeTextarea()
            })
        },
        focus: () => textareaRef.current?.focus(),
    }))

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!message.trim()) return

        const content = message
        const ids = documentIds

        setMessage("")
        setAttachments([])
        setDocumentIds([])
        if (textareaRef.current) textareaRef.current.style.height = "auto"

        await onSend(content, ids)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
        resizeTextarea()
    }

    const handleAttachment = () => fileInputRef.current?.click()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        const newAttachments = Array.from(files)
        setAttachments((prev) => [...prev, ...newAttachments])

        for (const file of newAttachments) {
            try {
                const { data } = await DocumentService.uploadDocument(file)
                if (data?.document_id) {
                    setDocumentIds((prev) => [...prev, data.document_id])
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
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    }

    const canSend = message.trim().length > 0 && !isLoading && !isUploading

    return (
        <div className="sticky bottom-0 z-10 shrink-0 bg-background px-4 pb-6 pt-2 w-full">
            <div className="max-w-3xl mx-auto">
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

                    <Textarea
                        ref={textareaRef}
                        placeholder={placeholder}
                        value={message}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        className="min-h-[36px] max-h-[200px] flex-1 resize-none border-0 bg-transparent px-2 py-2 my-auto focus-visible:ring-0 shadow-none text-sm leading-relaxed placeholder:text-muted-foreground/40"
                        rows={1}
                    />

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
})