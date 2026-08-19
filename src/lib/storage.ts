import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { storageConfig } from "./config";

// Private object storage abstraction. Files are NEVER placed under /public
// and are never given predictable, guessable names. Downloads must always
// go through an authenticated, authorized API route — see
// src/app/api/admin/enrollments/[id]/pdf/route.ts and .../signature/route.ts.
//
// The "local" driver (filesystem under private-storage/) is for development
// only and does not work on serverless hosts with an ephemeral/read-only
// filesystem (e.g. Vercel) — use STORAGE_DRIVER=s3 there. The bucket must NOT
// have public read access; this abstraction is the only way files are read
// back, so a private bucket is sufficient (no ACLs/signed URLs needed).

export interface StoredFileRef {
  storagePath: string; // opaque identifier, not a public URL
}

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    if (!storageConfig.s3.bucket || !storageConfig.s3.accessKeyId || !storageConfig.s3.secretAccessKey) {
      throw new Error(
        "STORAGE_DRIVER=s3 requires S3_BUCKET, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY to be set."
      );
    }
    s3Client = new S3Client({
      region: storageConfig.s3.region,
      endpoint: storageConfig.s3.endpoint,
      forcePathStyle: storageConfig.s3.forcePathStyle,
      credentials: {
        accessKeyId: storageConfig.s3.accessKeyId,
        secretAccessKey: storageConfig.s3.secretAccessKey,
      },
    });
  }
  return s3Client;
}

function resolveLocalPath(storagePath: string): string {
  // Dev-only path (STORAGE_DRIVER=local); production uses the S3 driver above.
  // Ignored so Turbopack doesn't trace the whole project into serverless output.
  const root = path.resolve(/* turbopackIgnore: true */ process.cwd(), storageConfig.localRoot);
  const resolved = path.resolve(/* turbopackIgnore: true */ root, storagePath);
  if (!resolved.startsWith(root)) {
    throw new Error("Invalid storage path");
  }
  return resolved;
}

export async function savePrivateFile(
  category: "signatures" | "agreements",
  buffer: Buffer,
  extension: string
): Promise<StoredFileRef> {
  const unguessableName = `${crypto.randomBytes(24).toString("hex")}.${extension}`;
  const storagePath = path.posix.join(category, unguessableName);

  if (storageConfig.driver === "local") {
    const fullPath = resolveLocalPath(storagePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);
    return { storagePath };
  }

  if (storageConfig.driver === "s3") {
    await getS3Client().send(
      new PutObjectCommand({
        Bucket: storageConfig.s3.bucket,
        Key: storagePath,
        Body: buffer,
        ContentType: contentTypeFor(extension),
      })
    );
    return { storagePath };
  }

  throw new Error(`Unknown STORAGE_DRIVER "${storageConfig.driver}". Use "local" or "s3".`);
}

export async function readPrivateFile(storagePath: string): Promise<Buffer> {
  if (storageConfig.driver === "local") {
    const fullPath = resolveLocalPath(storagePath);
    return fs.readFile(fullPath);
  }

  if (storageConfig.driver === "s3") {
    const result = await getS3Client().send(
      new GetObjectCommand({ Bucket: storageConfig.s3.bucket, Key: storagePath })
    );
    if (!result.Body) {
      throw new Error(`Object not found in S3: ${storagePath}`);
    }
    const bytes = await result.Body.transformToByteArray();
    return Buffer.from(bytes);
  }

  throw new Error(`Unknown STORAGE_DRIVER "${storageConfig.driver}". Use "local" or "s3".`);
}

function contentTypeFor(extension: string): string {
  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "png":
      return "image/png";
    default:
      return "application/octet-stream";
  }
}
