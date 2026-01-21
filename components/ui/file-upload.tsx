"use client";

import { cn } from "@/lib/utils";
import React, { useCallback, useRef, useState } from "react";

type Props = {
  onChange: (files: File[]) => void;
  accept?: string;
  label?: string;
  description?: string;
  multiple?: boolean;
};

export function FileUpload({
  onChange,
  accept = "image/*",
  label = "Seleccionar imagen",
  description = "Arrastra o selecciona un archivo JPEG/PNG",
  multiple = false,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = useCallback(
    (newFiles: FileList | File[] | null) => {
      if (!newFiles) return;
      const list = Array.from(newFiles);
      setFiles(list);
      onChange(list);
    },
    [onChange]
  );

  const handleClear = () => {
    setFiles([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange([]);
  };

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFileChange(event.dataTransfer.files);
      }}
      className={cn(
        "relative flex flex-col items-center justify-center w-full min-h-[160px] rounded-2xl border-2 border-dashed border-zinc-700 bg-black/40 text-center p-6 transition",
        dragging && "border-primary text-primary"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        className="absolute inset-0 opacity-0 cursor-pointer rounded-2xl"
        onChange={(event) => handleFileChange(event.target.files)}
      />
      {files.length === 0 ? (
        <>
          <div className="text-lg font-semibold">{label}</div>
          <p className="text-xs text-zinc-500">{description}</p>
        </>
      ) : (
        <>
          <p className="text-sm text-text-primary mb-3">
            Archivo seleccionado:
          </p>
          <div className="text-xs text-zinc-300 text-left w-full max-w-xs">
            {files.map((file) => (
              <div key={file.name} className="flex justify-between gap-2">
                <span className="truncate">{file.name}</span>
                <span className="text-text-secondary">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleClear();
            }}
            className="mt-4 text-xs font-bold text-primary underline"
          >
            Eliminar archivo
          </button>
        </>
      )}
    </label>
  );
}
