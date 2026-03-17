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
  FolderOpen,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLibraryStore } from "@/hooks/use-library";
import { useConferenceStore } from "@/hooks/use-conference";
import { UploadButton } from "@/components/uploadThing/uploadThing";
import { File } from "@prisma/client";
import { UseConference } from "../../../contexts/ConferenceContext";
import axios from "axios";
import { UploadDropzone } from "@uploadthing/react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
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
  const [files, setFiles] = useState<File[]>([]);

  const { conference: activeConference } = UseConference();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = () => {
    axios
      .get(`/api/files/${activeConference?.id}`)
      .then((res) => {
        setFiles(res.data.files);

        return res.data.files;
      })
      .catch((err) => {
        if (err.response.status == 404) setFiles([]);
      });
  };

  useEffect(() => {
    if (!activeConference) return;
    fetchFiles();
  }, [activeConference]);
  const triggerFileUpload = () => fileInputRef.current?.click();

  const deleteDocument = (fileId: string) => {
    axios
      .delete(`/api/files/${fileId}`)
      .then(() => {
        console.log("deleted");
        fetchFiles();
      })
      .catch((err) => {
        alert("There was an error");
      });
  };
  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-playfair font-bold tracking-tight text-foreground">
            Dual Library
          </h2>
          <p className="text-muted-foreground text-lg">
            Your personal vault and the global delegate repository.
          </p>
          {activeConference && (
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                Scoped to: {activeConference.title}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <UploadButton
            endpoint="docUploader"
            input={{ conferenceId: activeConference?.id }}
            appearance={{
              allowedContent: "hidden",
            }}
            onClientUploadComplete={() => {
              fetchFiles();
            }}
          />
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
          {files.length === 0 ? (
            <motion.div
              variants={item}
              className="rounded-3xl border border-primary/10 bg-card shadow-sm p-16 flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary/40" />
              </div>
              <h3 className="font-playfair text-xl font-semibold">
                Your Vault is Empty
              </h3>
              <p className="text-muted-foreground max-w-xs text-sm">
                Upload research docs, folders, or images for your active
                conference.
              </p>

              <UploadButton
                endpoint="docUploader"
                input={{ conferenceId: activeConference?.id }}
                appearance={{
                  allowedContent: "hidden",
                }}
                onClientUploadComplete={(res) => {
                  fetchFiles();
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-4"
            >
              {files.map((doc) => (
                <motion.div
                  key={doc.id}
                  variants={item}
                  className="rounded-3xl border border-primary/10 bg-card shadow-sm p-6 flex items-center gap-5 group hover:border-primary/30 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0`}
                  >
                    <FileText className="w-10 h-10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {doc.createdAt.toLocaleString()}
                      </span>
                      {!doc.isPublic && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Private
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => deleteDocument(doc.id)}
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
              <UploadDropzone
                endpoint="docUploader"
                input={{ conferenceId: activeConference?.id }}
                appearance={{
                  allowedContent: "hidden",
                }}
                onClientUploadComplete={() => {
                  fetchFiles();
                }}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {activeTab === "repository" && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4"
        >
          <motion.div variants={item} className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search global repository..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </motion.div>

          {REPO_ITEMS.map((doc) => (
            <motion.div
              key={doc.title}
              variants={item}
              className="rounded-3xl border border-primary/10 bg-card shadow-sm p-6 flex items-center gap-5 group hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {doc.title}
                </p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                    {doc.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    by {doc.author}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {doc.date}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary shrink-0"
              >
                <Copy className="w-4 h-4 mr-2" /> Clone
              </Button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
