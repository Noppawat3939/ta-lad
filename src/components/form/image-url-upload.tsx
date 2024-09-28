"use client";

import { Button, Input } from "@nextui-org/react";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type ImageURLUploadProps = {
  max: number;
};

export default function ImageURLUpload({ max }: ImageURLUploadProps) {
  const [imagUrls, setImageUrls] = useState<string[]>([]);

  return (
    <div className="flex flex-col space-y-3">
      <Button
        className="w-fit"
        aria-label="add-image-url"
        isDisabled={imagUrls.length >= max}
        onClick={() =>
          setImageUrls((prev) => (prev.length > 0 ? [...prev, ""] : [""]))
        }
      >
        <Plus className="w-4 h-4" />
        {"เพิ่มลิงก์รูปภาพ"}
      </Button>
      {imagUrls.map((imageUrl, i) => (
        <div key={`image-url-${i}`} className="flex items-center space-x-2">
          <div
            aria-label="preview-image-url"
            className="w-[46px] overflow-hidden rounded-lg border h-[46px]"
          >
            <img
              src={imageUrl || "/images/no-image.jpg"}
              className="w-full h-full object-cover"
            />
          </div>
          <Input
            label={`ลิงก์รูปภาพที่ ${i + 1}`}
            size="sm"
            value={imageUrl}
            onChange={(e) => {
              const url = e.target.value;
              const updatedUrl = imagUrls.map((urlItem, urlIdx) => {
                if (urlIdx === i) return url;

                return urlItem;
              });

              setImageUrls(updatedUrl);
            }}
            endContent={
              <Button
                onClick={() => {
                  const removedUrl = imagUrls.filter(
                    (_, urlIdx) => i !== urlIdx
                  );
                  setImageUrls(removedUrl);
                }}
                isIconOnly
                variant="light"
                color="danger"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            }
          />
        </div>
      ))}
    </div>
  );
}
