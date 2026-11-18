'use client';

import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { PoolCategory } from '@/types';
import { cn } from '@/lib/utils';

interface ImageUploadDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  category: PoolCategory;
}

const CATEGORY_PRESETS: Record<PoolCategory, { label: string; url: string; preview: string }[]> = {
  wedding: [
    {
      label: 'Sacred Mandap & Garlands',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000',
      preview: '💍 Traditional Wedding',
    },
    {
      label: 'Wedding Couple Blessing',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000',
      preview: '✨ Sacred Union',
    },
    {
      label: 'Floral Haldi & Celebrations',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000',
      preview: '🌸 Festive Ceremony',
    },
  ],
  education: [
    {
      label: 'Coding & Engineering Setup',
      url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000',
      preview: '💻 Tech Workstation',
    },
    {
      label: 'University Campus & Library',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
      preview: '🎓 Campus Ambition',
    },
    {
      label: 'Academic Study & Books',
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000',
      preview: '📚 Higher Studies',
    },
  ],
  milestone: [
    {
      label: 'New Family Home',
      url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000',
      preview: '🏡 Home Foundation',
    },
    {
      label: 'Dream Travel & Himalayas',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000',
      preview: '✈️ Dream Journey',
    },
    {
      label: 'Anniversary Celebration',
      url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1000',
      preview: '🎉 Life Celebration',
    },
  ],
  universal: [
    {
      label: 'Seedling & Strong Foundation',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000',
      preview: '🌱 Rising Foundation',
    },
    {
      label: 'Artisan Workshop & Crafts',
      url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1000',
      preview: '🎨 Creative Dream',
    },
  ],
};

export function ImageUploadDropzone({
  value,
  onChange,
  category,
}: ImageUploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const presets = CATEGORY_PRESETS[category] || CATEGORY_PRESETS.universal;

  // Upload handler
  const handleFile = async (file: File) => {
    setUploadError(null);

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, WEBP, or HEIC).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image size exceeds 8MB. Please select a smaller photo.');
      return;
    }

    // Show temporary local preview instantly
    const localPreviewUrl = URL.createObjectURL(file);
    onChange(localPreviewUrl);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Update with permanent URL from server
      onChange(data.url);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setUploadError(err?.message || 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const removePhoto = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/heic"
        onChange={onFileChange}
        className="hidden"
      />

      {/* Main Upload Area / Preview */}
      {value ? (
        <div className="relative rounded-neev-xl overflow-hidden border-2 border-neev-forest/30 shadow-warm-md group bg-neev-ivory-subtle">
          <div className="relative h-56 sm:h-64 w-full">
            <img
              src={value}
              alt="Milestone cover preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

            {/* Uploading Spinner Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-neev-amber" />
                <span className="text-xs font-semibold">Saving your photo...</span>
              </div>
            )}

            {/* Actions Bar on Image */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-neev-charcoal text-xs font-semibold shadow-warm-sm flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-neev-forest" />
                <span>Change Photo</span>
              </button>

              <button
                type="button"
                onClick={removePhoto}
                className="p-1.5 rounded-full bg-white/90 hover:bg-red-50 text-red-600 hover:text-red-700 shadow-warm-sm transition-all"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-semibold text-neev-forest-800 border border-neev-forest-100 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-neev-forest" />
              <span>Cover Photo Ready</span>
            </div>
          </div>
        </div>
      ) : (
        /* Drag & Drop Area */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'p-8 rounded-neev-xl border-2 border-dashed cursor-pointer transition-all duration-200 text-center flex flex-col items-center justify-center gap-3 bg-neev-ivory-subtle/50',
            isDragging
              ? 'border-neev-forest bg-neev-forest-50 scale-[1.01]'
              : 'border-neev-ivory-border hover:border-neev-forest/60 hover:bg-white'
          )}
        >
          <div className="w-14 h-14 rounded-full bg-white border border-neev-ivory-border flex items-center justify-center text-neev-forest shadow-warm-sm">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-neev-amber" />
            ) : (
              <Upload className="w-6 h-6 text-neev-forest" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-neev-charcoal">
              Click to upload your milestone photo or drag & drop
            </p>
            <p className="text-xs text-neev-slate">
              Upload your dream vision, college admission letter, project proposal, or photo (PNG, JPG, WEBP, up to 8MB)
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neev-ivory-border text-[11px] font-semibold text-neev-forest-800">
            <ImageIcon className="w-3.5 h-3.5 text-neev-amber" />
            <span>Show supporters what their contributions are building</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <p className="text-xs font-semibold text-neev-terracotta">{uploadError}</p>
      )}

      {/* Curated 1-Click Milestone Presets */}
      <div className="pt-1 space-y-1.5">
        <span className="text-[11px] font-semibold text-neev-slate flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-neev-amber" />
          <span>Or choose a curated photo for this occasion:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(preset.url)}
              className={cn(
                'text-xs px-2.5 py-1 rounded-full border transition-all text-left flex items-center gap-1.5',
                value === preset.url
                  ? 'bg-neev-forest-50 border-neev-forest text-neev-forest-800 font-semibold'
                  : 'bg-white border-neev-ivory-border text-neev-slate hover:border-neev-forest/40'
              )}
            >
              <span>{preset.preview}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

