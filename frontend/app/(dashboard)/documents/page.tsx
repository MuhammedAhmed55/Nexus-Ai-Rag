"use client"

import { useState, useEffect } from "react"
import { DocumentService } from "@/services/document.service"
import { Document } from "@/types/documents"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Search,
    Trash2,
    FileText as FileTextIcon,
    Database,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Paperclip,
} from "lucide-react"

const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case "pdf":
            return <div className="h-8 w-8 rounded-md bg-red-500/10 flex items-center justify-center border border-red-500/20"><FileTextIcon className="h-4 w-4 text-red-500" /></div>
        case "docx":
        case "doc":
            return <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20"><FileTextIcon className="h-4 w-4 text-blue-500" /></div>
        case "txt":
            return <div className="h-8 w-8 rounded-md bg-gray-500/10 flex items-center justify-center border border-gray-500/20"><FileTextIcon className="h-4 w-4 text-gray-400" /></div>
        default:
            return <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20"><FileTextIcon className="h-4 w-4 text-primary" /></div>
    }
}

const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case "processed":
            return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 font-normal gap-1.5"><CheckCircle2 className="h-3 w-3" /> Processed</Badge>
        case "processing":
            return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 font-normal gap-1.5"><Loader2 className="h-3 w-3 animate-spin" /> Processing</Badge>
        case "failed":
            return <Badge variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 font-normal gap-1.5"><AlertCircle className="h-3 w-3" /> Failed</Badge>
        default:
            return <Badge variant="secondary" className="font-normal text-muted-foreground border-white/10">Pending</Badge>
    }
}

export default function DocumentsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [documents, setDocuments] = useState<Document[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDocuments = async () => {
            setIsLoading(true)
            const { data, error } = await DocumentService.getDocuments()
            if (data && !error) {
                setDocuments(data)
            } else {
                console.error("Failed to load documents", error)
            }
            setIsLoading(false)
        }
        fetchDocuments()
    }, [])

    const filteredDocs = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        const { error } = await DocumentService.deleteDocument(id)
        if (!error) {
            setDocuments(documents.filter(doc => doc.id !== id))
        } else {
            console.error("Failed to delete document", error)
        }
    }

    return (
        <div className="flex flex-col h-full bg-background relative overflow-y-auto">
            <div className="max-w-[1400px] w-full mx-auto p-4 md:p-8">
                {/* Header — upload button removed, uploads happen from chat now */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                            Documents
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage your documents — they're processed locally for privacy.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="glass-strong border-white/5 shadow-sm">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                                    <div className="flex flex-col gap-2 flex-1">
                                        <Skeleton className="h-6 w-10" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card className="glass-strong border-white/5 shadow-sm">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <FileTextIcon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold tracking-tight">{documents.length}</p>
                                    <p className="text-sm text-muted-foreground font-medium">Total Documents</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="glass-strong border-white/5 shadow-sm">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold tracking-tight">{documents.filter(d => d.status === 'processed').length}</p>
                                    <p className="text-sm text-muted-foreground font-medium">Ready to Chat</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="glass-strong border-white/5 shadow-sm">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                    <Loader2 className="h-5 w-5 text-amber-500 animate-spin-slow" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold tracking-tight">{documents.filter(d => d.status === 'processing').length}</p>
                                    <p className="text-sm text-muted-foreground font-medium">Processing</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="glass-strong border-white/5 shadow-sm">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                                    <Database className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold tracking-tight">{documents.reduce((acc, doc) => acc + (doc.chunk_count || 0), 0)}</p>
                                    <p className="text-sm text-muted-foreground font-medium">Total Chunks</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Content Area */}
                <Card className="glass-strong border-white/5 shadow-sm flex flex-col min-h-[400px]">
                    <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h2 className="text-lg font-medium px-1">All Documents</h2>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 bg-white/5 border-white/10 focus:border-primary text-sm shadow-none"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="p-4 space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 py-2">
                                    <Skeleton className="h-8 w-8 rounded-md shrink-0" />
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <Skeleton className="h-3.5 w-1/3" />
                                        <Skeleton className="h-2.5 w-1/5" />
                                    </div>
                                    <Skeleton className="h-3.5 w-12" />
                                    <Skeleton className="h-3.5 w-20" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
                            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                                <FileTextIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">No documents yet</h3>
                            <p className="text-muted-foreground text-center max-w-md mb-2">
                                Upload your first document from a chat to start asking questions with Nexus AI.
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                                <Paperclip className="h-3.5 w-3.5" />
                                <span>Use the attach icon in the chat composer</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto">
                            <Table>
                                <TableHeader className="bg-black/20 hover:bg-black/20">
                                    <TableRow className="border-white/5">
                                        <TableHead className="w-[40%] font-medium text-muted-foreground h-10">Name</TableHead>
                                        <TableHead className="font-medium text-muted-foreground h-10">Size</TableHead>
                                        <TableHead className="font-medium text-muted-foreground h-10">Uploaded</TableHead>
                                        <TableHead className="font-medium text-muted-foreground h-10">Status</TableHead>
                                        <TableHead className="text-right font-medium text-muted-foreground h-10 pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDocs.map((doc) => (
                                        <TableRow key={doc.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                            <TableCell className="font-medium py-3">
                                                <div className="flex items-center gap-3">
                                                    {getFileIcon(doc.file_type)}
                                                    <div className="flex flex-col min-w-0">
                                                        <span
                                                            className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
                                                            title={doc.name}
                                                        >
                                                            {doc.name}
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">
                                                            {doc.file_type} • {doc.chunk_count} chunks
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground py-3">{formatBytes(doc.file_size)}</TableCell>
                                            <TableCell className="text-muted-foreground py-3">{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="py-3">
                                                {getStatusBadge(doc.status)}
                                            </TableCell>
                                            <TableCell className="text-right py-3 pr-4">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => handleDelete(doc.id)}
                                                    title="Delete document"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredDocs.length === 0 && documents.length > 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                No documents match your search.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}