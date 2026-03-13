"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Copy, 
  Upload, 
  Globe, 
  Lock, 
  Search, 
  Image as ImageIcon, 
  Folder, 
  FolderOpen
} from "lucide-react";
import { useState, useRef } from "react";
import { useLibraryStore } from "@/hooks/use-library";
import { useConferenceStore } from "@/hooks/use-conference";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const REPO_ITEMS = [
  {
    title: "Cyber Warfare Framework (UK)",
    type: "Position Paper",
    author: "@delegateJohn",
    date: "2 days ago",
    downloads: 18,
  },
  {
    title: "Resolution 1A — Autonomous Weapons Systems",
    type: "Draft Resolution",
    author: "@admin",
    date: "1 week ago",
    downloads: 41,
  },
  {
    title: "UNSC Veto Reform Analysis (France)",
    type: "Research Brief",
    author: "@delegate_martine",
    date: "3 days ago",
    downloads: 27,
  },
];

export default function Library() {
  const [activeTab, setActiveTab] = useState<"vault" | "repository">("vault");
  const { documents, addDocument, deleteDocument } = useLibraryStore();
  const { getActive } = useConferenceStore();
  const activeConference = getActive();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Filter documents to show:
  // 1. Documents for the active conference
  // 2. Or all documents if no conference is active
  const vaultItems = documents.filter(doc => 
    !activeConference || doc.conferenceId === activeConference.id || !doc.conferenceId
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isFolder = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isFolder) {
      // If uploading a folder, we'll create a single "Folder" entry in the library
      const folderName = files[0].webkitRelativePath.split('/')[0] || "New Folder";
      addDocument({
        title: folderName,
        content: `Folder containing ${files.length} files.`,
        type: "Folder",
        isPrivate: true,
        conferenceId: activeConference?.id,
        fileCount: files.length
      });
    } else {
      // Process individual files
      Array.from(files).forEach(file => {
        const type = file.type.startsWith('image/') ? 'Image' : 'Research Brief';
        addDocument({
          title: file.name,
          content: `Uploaded file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
          type: type as any,
          isPrivate: true,
          conferenceId: activeConference?.id
        });
      });
    }
    
    // Reset inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  const triggerFileUpload = () => fileInputRef.current?.click();
  const triggerFolderUpload = () => folderInputRef.current?.click();

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hidden Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleFileChange(e)} 
        multiple 
        className="hidden" 
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      <input 
        type="file" 
        ref={folderInputRef} 
        onChange={(e) => handleFileChange(e, true)} 
        // @ts-ignore
        webkitdirectory="" 
        // @ts-ignore
        directory="" 
        className="hidden" 
      />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-playfair font-bold tracking-tight text-foreground">Dual Library</h2>
          <p className="text-muted-foreground text-lg">Your personal vault and the global delegate repository.</p>
          {activeConference && (
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                Scoped to: {activeConference.title}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={triggerFolderUpload} variant="outline" className="rounded-full px-6 font-geist">
            <FolderOpen className="w-4 h-4 mr-2 text-amber-500" />
            Upload Folder
          </Button>
          <Button onClick={triggerFileUpload} className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90 font-geist">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files/Images
          </Button>
        </div>
      </div>

      {/* Segmented Tab Control */}
      <div className="flex bg-muted/30 p-1 rounded-full w-fit">
        <button
          onClick={() => setActiveTab("vault")}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "vault" ? "bg-background shadow-sm text-foreground border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Lock className="w-4 h-4" /> My Vault
        </button>
        <button
          onClick={() => setActiveTab("repository")}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "repository" ? "bg-background shadow-sm text-foreground border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Globe className="w-4 h-4" /> Global Repository
        </button>
      </div>

      {activeTab === "vault" && (
        <motion.div variants={container} initial="hidden" animate="show">
          {vaultItems.length === 0 ? (
            <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card shadow-sm p-16 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary/40" />
              </div>
              <h3 className="font-playfair text-xl font-semibold">Your Vault is Empty</h3>
              <p className="text-muted-foreground max-w-xs text-sm">Upload research docs, folders, or images for your active conference.</p>
              <Button onClick={triggerFileUpload} className="mt-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Upload className="w-4 h-4 mr-2" /> Upload First File
              </Button>
            </motion.div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
              {vaultItems.map((doc) => (
                <motion.div key={doc.id} variants={item} className="rounded-3xl border border-primary/10 bg-card shadow-sm p-6 flex items-center gap-5 group hover:border-primary/30 transition-colors">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    doc.type === 'Folder' ? 'bg-amber-500/10 text-amber-500' :
                    doc.type === 'Image' ? 'bg-indigo-500/10 text-indigo-500' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {doc.type === 'Folder' ? <Folder className="w-5 h-5" /> : 
                     doc.type === 'Image' ? <ImageIcon className="w-5 h-5" /> :
                     <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{doc.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                        {doc.type === 'Folder' ? `${doc.fileCount} items` : doc.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{doc.date}</span>
                      {doc.isPrivate && <span className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" /> Private</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" className="rounded-full border-border">Open</Button>
                    <Button onClick={() => deleteDocument(doc.id)} variant="ghost" size="sm" className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10">Delete</Button>
                  </div>
                </motion.div>
              ))}
              <motion.div onClick={triggerFileUpload} variants={item} className="rounded-3xl border-2 border-dashed border-border/50 p-8 flex flex-col items-center text-center gap-3 cursor-pointer hover:border-primary/30 transition-colors group">
                <Upload className="w-6 h-6 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                <p className="text-sm text-muted-foreground">Drop files or images here to sync with {activeConference?.title || 'active conference'}</p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}

      {activeTab === "repository" && (
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
          <motion.div variants={item} className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search global repository..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </motion.div>

          {REPO_ITEMS.map((doc) => (
            <motion.div key={doc.title} variants={item} className="rounded-3xl border border-primary/10 bg-card shadow-sm p-6 flex items-center gap-5 group hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{doc.title}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">{doc.type}</span>
                  <span className="text-xs text-muted-foreground">by {doc.author}</span>
                  <span className="text-xs text-muted-foreground">{doc.date}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary shrink-0">
                <Copy className="w-4 h-4 mr-2" /> Clone
              </Button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
