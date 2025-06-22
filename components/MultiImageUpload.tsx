'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export default function MultiImageUpload({ value, onChange, disabled }: MultiImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null); // ✅ moved inside
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.images) {
        const urls = data.images.map((img: { url: string }) => img.url);
        onChange([...value, ...urls]);
      } else {
        console.error(data.error || 'Failed to upload');
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      event.target.value = ''; // reset input
    }
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-4 flex-wrap">
        {value.map((url, idx) => (
          <div key={idx} className="relative group w-24 h-24 border rounded overflow-hidden">
            <img src={url} alt={`upload-${idx}`} className="object-cover w-full h-full" />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute top-0 right-0 bg-black text-white text-xs px-1 py-0.5 rounded-bl opacity-80 hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        disabled={disabled || uploading}
        className="hidden"
      />

      <Button
        variant="outline"
        type="button"
        disabled={disabled || uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? 'Uploading...' : 'Upload Images'}
      </Button>
    </div>
  );
}
