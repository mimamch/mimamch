import crypto from "node:crypto";

const hmac = (key: crypto.BinaryLike, data: string) =>
  crypto.createHmac("sha256", key).update(data, "utf8").digest();
const sha256 = (data: string) =>
  crypto.createHash("sha256").update(data, "utf8").digest("hex");

/**
 * Signature Version 4 for a single request — enough for one JSON endpoint,
 * so we don't pull in the aws-sdk. No query string, no session token.
 */
export function sigv4Headers(req: {
  method: string;
  host: string;
  path: string;
  service: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** extra headers to sign, lowercase names */
  headers?: Record<string, string>;
  body: string;
  date?: Date;
}): Record<string, string> {
  const amzDate = (req.date ?? new Date())
    .toISOString()
    .replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const all: Record<string, string> = {
    ...req.headers,
    host: req.host,
    "x-amz-date": amzDate,
  };
  const names = Object.keys(all).sort();
  const signedHeaders = names.join(";");

  const canonicalRequest = [
    req.method,
    req.path,
    "",
    ...names.map((n) => `${n}:${all[n]!.trim()}`),
    "",
    signedHeaders,
    sha256(req.body),
  ].join("\n");

  const scope = `${dateStamp}/${req.region}/${req.service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    sha256(canonicalRequest),
  ].join("\n");

  const kDate = hmac(`AWS4${req.secretAccessKey}`, dateStamp);
  const signingKey = hmac(
    hmac(hmac(kDate, req.region), req.service),
    "aws4_request",
  );
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign, "utf8")
    .digest("hex");

  return {
    ...req.headers,
    "x-amz-date": amzDate,
    authorization: `AWS4-HMAC-SHA256 Credential=${req.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}
