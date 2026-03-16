import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import { uploadRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<typeof uploadRouter>();
export const UploadDropzone = generateUploadDropzone<typeof uploadRouter>();
