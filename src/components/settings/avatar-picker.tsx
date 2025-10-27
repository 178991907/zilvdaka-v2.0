'use client';
import { useState, useRef } from 'react';
import { Avatars } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { CheckCircle, Upload } from 'lucide-react';
import { ClientOnlyT } from '../layout/app-sidebar';

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelectAvatar: (id: string) => void;
}

export default function AvatarPicker({ selectedAvatar, onSelectAvatar }: AvatarPickerProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedImage(result);
        onSelectAvatar(result); // Pass the data URL as the selected "avatar"
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const isUploadedAvatarSelected = (selectedAvatar ?? '').startsWith('data:image');

  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
      {/* Upload Button */}
      <div
        className={cn(
          'relative cursor-pointer rounded-full border-2 transition-all aspect-square w-full flex items-center justify-center bg-secondary/50 hover:bg-secondary',
           isUploadedAvatarSelected ? 'border-primary' : 'border-dashed'
        )}
        onClick={handleUploadClick}
        role="button"
        aria-label="Upload custom avatar"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        {uploadedImage && isUploadedAvatarSelected ? (
          <img
            src={uploadedImage}
            alt="Uploaded avatar"
            className="rounded-full aspect-square object-cover w-full h-full"
          />
        ) : (
          <div className="text-center p-1">
            <Upload className="h-4 w-4 mx-auto text-muted-foreground" />
             <p className="text-[10px] mt-1 text-muted-foreground"><ClientOnlyT tKey="settings.profile.upload" /></p>
          </div>
        )}
        {isUploadedAvatarSelected && (
           <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
             <CheckCircle className="h-3 w-3 text-primary-foreground" />
           </div>
         )}
      </div>

      {/* Pre-defined SVG Avatars */}
      {Avatars.map((avatar) => (
        <div
          key={avatar.id}
          className={cn(
            'relative cursor-pointer rounded-full border-2 transition-all aspect-square w-full p-2 bg-card',
            selectedAvatar === avatar.id ? 'border-primary' : 'border-transparent'
          )}
          onClick={() => {
            onSelectAvatar(avatar.id);
            setUploadedImage(null); // Clear uploaded image if a pre-defined one is selected
          }}
          role="button"
          aria-label={`Select ${avatar.name} avatar`}
        >
          <div dangerouslySetInnerHTML={{ __html: avatar.svg }} className="w-full h-full" />
          {selectedAvatar === avatar.id && (
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
              <CheckCircle className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
