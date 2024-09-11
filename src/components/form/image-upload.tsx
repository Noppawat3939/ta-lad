"use client";

import { Fragment, useRef, useState } from "react";
import { RegexImageUrl, delay, isEmpty } from "@/lib";
import { Button, Image, Input } from "@nextui-org/react";
import { Trash2, Upload } from "lucide-react";
import Compressor from "compressorjs";

type ImageUploadProps = {
  max?: number;
  width?: number;
  height?: number;
  quality?: number;
  onFileUpload?: (file: (File | Blob)[]) => void;
  onImageUrlChange?: (url: string[]) => void;
};

const UPLOADING_RATE = 200;

export default function ImageUpload({
  max = 4,
  onFileUpload,
  width,
  height,
  quality = 0.8,
  onImageUrlChange,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<(File | Blob)[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlList, setImageUrlList] = useState<string[]>([]);
  const [errorImageUrl, setErrorImageUrl] = useState("");

  const handleUpdatePreviewImage = async (file: File) => {
    const wait = file.size / UPLOADING_RATE;
    setUploading(true);

    await delay(wait);

    new Compressor(file, {
      width: width || 500,
      height: height || 500,
      quality,
      success: (fileRes) => {
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
      onImageUrlChange?.(removedUrl);

      return;
    }

    const removedFile = fileList.filter((_, idx) => idx !== removedIndex);

    setFileList(removedFile);
    onFileUpload?.(removedFile);
  };

  const handleSaveUrl = () => {
    if (!RegexImageUrl.test(imageUrl)) {
      setErrorImageUrl("ลิงก์รูปภาพไม่ถูกต้อง");
      return;
    }

    const updatedUrl = isEmpty(imageUrlList)
      ? [imageUrl]
      : [...imageUrlList, imageUrl];

    setImageUrlList(updatedUrl);
    onImageUrlChange?.(updatedUrl);
    setImageUrl("");
  };

  const isDisabled = (fileList.length || imageUrlList.length) >= max;

  return (
    <section>
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
      <p className="text-xs mb-2 text-foreground-500/80 text-center">
        {"หรือ"}
      </p>
      <div className="flex items-center space-x-2">
        <Input
          label={"ลิงก์รูปภาพ"}
          size="sm"
          value={imageUrl}
          onChange={({ target: { value } }) => {
            if (errorImageUrl) {
              setErrorImageUrl("");
            }

            setImageUrl(value.trim());
          }}
          isInvalid={!!errorImageUrl}
          errorMessage={errorImageUrl}
        />
        <Button isDisabled={!imageUrl || isDisabled} onClick={handleSaveUrl}>
          {"บันทึก"}
        </Button>
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
