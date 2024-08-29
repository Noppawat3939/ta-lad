import { Fragment, useCallback, useRef, useState } from "react";
import { delay } from "@/lib";
import { Button, Image } from "@nextui-org/react";
import { Trash2, Upload } from "lucide-react";

type ImageUploadProps = {
  max?: number;
};

export default function ImageUpload({ max = 4 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpdatePreviewImage = (file: File) => {
    const wait = file.size / 200;
    const reader = new FileReader();
    reader.readAsDataURL(file);

    setUploading(true);

    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      await delay(wait);

      if (base64) {
        try {
          const res = await fetch(base64);
          const blob = await res.blob();
          const localUrl = URL.createObjectURL(blob);
          setPreviewImage((prev) => [...prev, localUrl]);
        } catch (err) {
          console.error(err);
        } finally {
          setUploading(false);
        }
      }
    };
  };

  const handleRemove = useCallback(
    (index: number) =>
      setPreviewImage((prev) => prev.filter((_, imgIdx) => imgIdx !== index)),
    []
  );

  const isDisabled = previewImage.length >= max;

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
          accept="image/png,image/jpg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            file && handleUpdatePreviewImage(file);
          }}
        />
      </div>
      <div className="flex space-x-2 mt-2">
        {previewImage.length > 0 &&
          previewImage.map((image, i) => (
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
