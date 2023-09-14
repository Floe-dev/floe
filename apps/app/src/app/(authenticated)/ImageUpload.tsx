import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useUploadThing } from "@/utils/uploadthing";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { UploadFileResponse } from "uploadthing/client";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { Spinner } from "@floe/ui";

interface ImageUploadProps {
  label: string;
  type: "logoUploader" | "faviconUploader";
  imageUploadURL: string | undefined;
  setImageUploadURL: (imageUploadURL: string) => void;
}

export const ImageUpload = ({
  type,
  label,
  imageUploadURL,
  setImageUploadURL,
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { startUpload, permittedFileInfo } = useUploadThing(type, {
    onClientUploadComplete: (files) => {
      if (!files) {
        return;
      }
      setIsUploading(false);
      setImageUploadURL(files[0]?.url);
    },
    onUploadError: (e) => {
      setIsUploading(false);
      alert("error occurred while uploading: " + e.message);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      startUpload(acceptedFiles);
    },
    [startUpload]
  );

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  const fileTypeText = type === "logoUploader" ? ".svg" : ".png";

  return (
    <>
      <label className="inline-block mb-2 text-sm font-medium leading-6 text-gray-900 dark:text-white">
        {label}
      </label>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center object-cover w-full h-20 rounded-lg shadow-sm cursor-pointer outline-dashed outline-gray-300 outline-1">
          {isUploading ? (
            <Spinner />
          ) : imageUploadURL ? (
            <img src={imageUploadURL} alt="Logo" className="p-2 max-h-14" />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <CloudArrowUpIcon className="w-6 h-6 text-zinc-400" />
              <p className="mt-1 text-xs text-gray-700">
                <span className="font-mono">{fileTypeText}</span> up to 1mb
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
