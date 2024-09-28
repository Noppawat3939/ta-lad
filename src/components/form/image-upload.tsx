"use client";

import { Fragment, useRef, useState } from "react";
import { delay, isUndefined } from "@/lib";
import { Button, Image, cn } from "@nextui-org/react";
import { Trash2, Upload } from "lucide-react";
import Compressor from "compressorjs";

type ImageUploadProps = {
  max?: number;
  width?: number;
  height?: number;
  quality?: number;
  onFileUpload?: (file: (File | Blob)[]) => void;
  fullPreview?: boolean;
};

const UPLOADING_RATE = 200;

export default function ImageUpload({
  max = 4,
  onFileUpload,
  width,
  height,
  quality = 0.8,
  fullPreview = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<(File | Blob)[]>([]);
  const [imageUrlList, setImageUrlList] = useState<string[]>([]);
  const [mainFile, setMainFile] = useState<File | Blob>();

  const handleUpdatePreviewImage = async (file: File) => {
    const wait = file.size / UPLOADING_RATE;
    setUploading(true);

    await delay(wait);

    new Compressor(file, {
      width: width || 500,
      height: height || 500,
      quality,
      success: (fileRes) => {
        if (fullPreview) {
          setMainFile(fileRes);
          return;
        }
        const updateFile = [...fileList, fileRes];
        setFileList(updateFile);
        onFileUpload?.(updateFile);
      },
      error: (e) => console.error(e),
    });
    setUploading(false);
  };

  const handleRemove = (removedIndex: number, isUrl = false) => {
    if (isUrl) {
      const removedUrl = imageUrlList.filter((_, idx) => idx !== removedIndex);

      setImageUrlList(removedUrl);

      return;
    }

    const removedFile = fileList.filter((_, idx) => idx !== removedIndex);

    setFileList(removedFile);
    onFileUpload?.(removedFile);
  };

  const isDisabled = fullPreview
    ? !isUndefined(mainFile)
    : (fileList.length || imageUrlList.length) >= max;

  return (
    <section>
      {fullPreview && (
        <div className="relative w-fit mx-auto">
          <img
            src={
              mainFile ? URL.createObjectURL(mainFile) : "/images/no-image.jpg"
            }
            className={cn(
              "h-[300px] mb-2 rounded-lg",
              mainFile ? "border" : undefined
            )}
          />
          <Button
            className={cn(
              "z-[2] absolute rounded-full border-red-200 h-6 top-2 right-2",
              mainFile ? "flex" : "hidden"
            )}
            size="sm"
            variant="bordered"
            isIconOnly
            onClick={() => setMainFile(undefined)}
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        </div>
      )}
      <div className="flex justify-center items-center border-dotted border-2 rounded-lg min-h-[150px]">
        <Button
          isDisabled={isDisabled}
          isLoading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            "กำลังอัพโหลด"
          ) : isDisabled ? (
            `อัพโหลดมากที่สุด ${max} รูป`
          ) : (
            <Fragment>
              <Upload className="w-4 h-4" />
              {"เลือกรูปภาพ"}
            </Fragment>
          )}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            file && handleUpdatePreviewImage(file);
          }}
        />
      </div>
      <div className="flex space-x-2 mt-2">
        {fileList.length > 0 &&
          fileList.map((image, i) => (
            <div
              key={`preview-image-${i}`}
              className="relative border border-slate-100 rounded p-3"
            >
              <Button
                className="z-[2] absolute rounded-full border-red-200 h-6 top-1 right-1"
                size="sm"
                variant="bordered"
                isIconOnly
                onClick={() => handleRemove(i)}
              >
                <Trash2 className="w-3 h-3 text-red-500" />
              </Button>
              <Image
                src={URL.createObjectURL(image)}
                width={80}
                className="object-contain z-0"
                loading="lazy"
                alt={`preview-image-${i}`}
              />
            </div>
          ))}
        {imageUrlList.length > 0 &&
          imageUrlList.map((image, i) => (
            <div
              key={`preview-image-${i}`}
              className="relative border border-slate-100 rounded p-3"
            >
              <Button
                className="z-[2] absolute rounded-full border-red-200 h-6 top-1 right-1"
                size="sm"
                variant="bordered"
                isIconOnly
                onClick={() => handleRemove(i, true)}
              >
                <Trash2 className="w-3 h-3 text-red-500" />
              </Button>
              <Image
                src={image}
                width={80}
                className="object-contain z-0"
                loading="lazy"
                alt={`preview-image-${i}`}
              />
            </div>
          ))}
      </div>
    </section>
  );
}
