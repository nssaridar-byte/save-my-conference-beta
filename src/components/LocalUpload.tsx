
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FileUp } from "lucide-react";
import axios from "axios";

interface LocalUploadProps {
  conferenceId?: string;
  onComplete: () => void;
  variant?: "button" | "dropzone";
}

export function LocalUpload({ conferenceId, onComplete, variant = "button" }: LocalUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        if (conferenceId) formData.append("conferenceId", conferenceId);

        await axios.post("/api/files/upload-local", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 600000, // 10 minutes for very large files
        });
      }
      
      onComplete();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Some uploads failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (variant === "dropzone") {
    return (
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-48 border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          multiple
          className="hidden" 
        />
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Upload className="w-6 h-6 text-primary" />}
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">
            {isUploading ? "Uploading..." : "Click to upload research files"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Max 100MB per file • Multiple Selection Enabled
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        multiple
        className="hidden" 
      />
      <Button 
        onClick={() => fileInputRef.current?.click()} 
        disabled={isUploading}
        className="rounded-full px-6 h-11 flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
      >
        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
        {isUploading ? "Uploading..." : "Choose File(s)"}
      </Button>
    </div>
  );
}
