"use client";

import { RegexImageUrl } from "@/lib";
import { Button, Textarea } from "@nextui-org/react";
import { Plus } from "lucide-react";
import { useState } from "react";

type ImageURLUploadProps = {
  max: number;
};

export default function ImageURLUpload({ max }: ImageURLUploadProps) {
  const [imageUrls, setImageUrls] = useState<string>("");
  const [isShowTextArea, setIsShowTextArea] = useState(false);
  const [isInvalidUrl, setIsInvalidUrl] = useState(false);

  const splittedUrl = imageUrls.split("\n").filter((value) => value);

  const handleKeyDown = () => {
    const hasInvalid = splittedUrl.some((url) => !RegexImageUrl.test(url));

    setIsInvalidUrl(hasInvalid);
  };

  return (
    <div className="flex flex-col space-y-3">
      {isShowTextArea && (
        <Textarea
          className="resize-none"
          label={"ลิงก์รูปภาพ"}
          isInvalid={isInvalidUrl}
          errorMessage={isInvalidUrl ? "ลิงก์รูปภาพไม่ถูกต้อง" : undefined}
          aria-label="image-url"
          isDisabled={imageUrls.length >= max}
          placeholder="Enter เพื่อเพิ่มรูปใหม่"
          onKeyDown={({ key }) => {
            if (key === "Enter") {
              handleKeyDown();
            }
          }}
          value={imageUrls}
          onChange={({ target: { value } }) => {
            isInvalidUrl && setIsInvalidUrl(false);

            setImageUrls(value);
          }}
        />
      )}
      <Button
        className="w-fit"
        type="button"
        onClick={() => {
          setIsShowTextArea(!isShowTextArea);
        }}
      >
        <Plus className="w-4 h-4" />
        {"เพิ่มลิงก์รูปภาพ"}
      </Button>
      <div className="grid grid-cols-5 gap-2">
        {splittedUrl.length >= 1 &&
          splittedUrl.map((url, i) => (
            <div
              className="border rounded cursor-pointer overflow-hidden"
              key={`image-url-${i}`}
              onClick={() => {
                console.log("delete-", i, imageUrls);
              }}
            >
              <img
                src={url}
                alt="image-url"
                loading="lazy"
                className="w-full h-[90px] object-contain"
              />
            </div>
          ))}
      </div>
    </div>
  );
}
