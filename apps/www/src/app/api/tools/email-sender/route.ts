import { sigv4Headers } from "@/lib/aws-sigv4";
import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import nodemailer from "nodemailer";

type Payload = {
  provider: "resend" | "ses" | "smtp";
  apiKey?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string[];
  subject: string;
  bodyType: "text" | "html";
  body: string;
  headers?: { name: string; value: string }[];
};

async function sendViaSes(p: Payload) {
  const region = p.region!.trim();
  const host = `email.${region}.amazonaws.com`;
  const path = "/v2/email/outbound-emails";

  const body = JSON.stringify({
    FromEmailAddress: p.from,
    Destination: {
      ToAddresses: p.to,
      CcAddresses: p.cc?.length ? p.cc : undefined,
      BccAddresses: p.bcc?.length ? p.bcc : undefined,
    },
    ReplyToAddresses: p.replyTo?.length ? p.replyTo : undefined,
    Content: {
      Simple: {
        Subject: { Data: p.subject, Charset: "UTF-8" },
        Body: {
          [p.bodyType === "html" ? "Html" : "Text"]: {
            Data: p.body,
            Charset: "UTF-8",
          },
        },
        Headers: p.headers?.length
          ? p.headers.map((h) => ({ Name: h.name, Value: h.value }))
          : undefined,
      },
    },
  });

  const res = await fetch(`https://${host}${path}`, {
    method: "POST",
    headers: sigv4Headers({
      method: "POST",
      host,
      path,
      service: "ses",
      region,
      // trimmed: pasted keys often carry stray whitespace, which AWS rejects
      // as UnrecognizedClientException ("security token ... is invalid")
      accessKeyId: p.accessKeyId!.trim(),
      secretAccessKey: p.secretAccessKey!.trim(),
      headers: { "content-type": "application/json" },
      body,
    }),
    body,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    // AWS puts the exception name in this header, the sentence in the body
    const type = res.headers.get("x-amzn-errortype")?.split(":")[0];
    const message =
      json.message ?? json.Message ?? `${res.status} ${res.statusText}`;
    throw new Error(type ? `${type}: ${message}` : message);
  }
  return json.MessageId ?? null;
}

const isPrivateAddress = (ip: string) =>
  /^(0\.|10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/.test(
    ip,
  ) || /^(::1?$|fe80:|f[cd])/i.test(ip);

/**
 * Unlike SES/Resend the SMTP host comes from the user, so this endpoint would
 * otherwise happily dial the internal network. Resolve first and refuse
 * anything private.
 * ponytail: resolve-then-connect leaves a DNS-rebinding gap; pin the resolved
 * IP as the connect target if this ever runs somewhere with real secrets.
 */
async function assertPublicHost(host: string) {
  const addresses = await lookup(host, { all: true }).catch(() => []);
  if (!addresses.length) throw new Error(`Cannot resolve host: ${host}`);
  if (addresses.some((a) => isPrivateAddress(a.address))) {
    throw new Error("Refusing to connect to a private or loopback address.");
  }
}

async function sendViaSmtp(p: Payload) {
  const host = p.host!.trim();
  await assertPublicHost(host);

  const transporter = nodemailer.createTransport({
    host,
    port: p.port!,
    secure: !!p.secure,
    auth: { user: p.user!.trim(), pass: p.pass! },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  const info = await transporter.sendMail({
    from: p.from,
    to: p.to,
    cc: p.cc?.length ? p.cc : undefined,
    bcc: p.bcc?.length ? p.bcc : undefined,
    replyTo: p.replyTo?.length ? p.replyTo : undefined,
    subject: p.subject,
    text: p.bodyType === "text" ? p.body : undefined,
    html: p.bodyType === "html" ? p.body : undefined,
    headers: p.headers?.length
      ? Object.fromEntries(p.headers.map((h) => [h.name, h.value]))
      : undefined,
  });

  return info.messageId ?? null;
}

async function sendViaResend(p: Payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${p.apiKey!.trim()}`,
    },
    body: JSON.stringify({
      from: p.from,
      to: p.to,
      cc: p.cc?.length ? p.cc : undefined,
      bcc: p.bcc?.length ? p.bcc : undefined,
      reply_to: p.replyTo?.length ? p.replyTo : undefined,
      subject: p.subject,
      [p.bodyType]: p.body,
      headers: p.headers?.length
        ? Object.fromEntries(p.headers.map((h) => [h.name, h.value]))
        : undefined,
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message ?? `${res.status} ${res.statusText}`);
  }
  return json.id ?? null;
}

export async function POST(request: NextRequest) {
  const p = (await request.json()) as Payload;

  const missing =
    !p.from?.trim() ||
    !p.to?.length ||
    !p.subject?.trim() ||
    !p.body?.trim() ||
    (p.provider === "resend"
      ? !p.apiKey?.trim()
      : p.provider === "smtp"
        ? !p.host?.trim() || !p.port || !p.user?.trim() || !p.pass
        : !p.accessKeyId?.trim() ||
          !p.secretAccessKey?.trim() ||
          !p.region?.trim());
  if (missing) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }
  if (p.provider === "ses" && !/^[a-z0-9-]{1,32}$/.test(p.region!.trim())) {
    return NextResponse.json({ error: "Invalid region." }, { status: 400 });
  }
  if (
    p.provider === "smtp" &&
    (!Number.isInteger(p.port) || p.port! < 1 || p.port! > 65535)
  ) {
    return NextResponse.json({ error: "Invalid port." }, { status: 400 });
  }

  try {
    const id =
      p.provider === "ses"
        ? await sendViaSes(p)
        : p.provider === "smtp"
          ? await sendViaSmtp(p)
          : await sendViaResend(p);
    return NextResponse.json({ id });
  } catch (e) {
    if (!(e instanceof Error)) {
      return NextResponse.json({ error: "Request failed." }, { status: 502 });
    }
    // AWS SDK errors carry the useful part in `name` (e.g. UnrecognizedClientException)
    const name = e.name && e.name !== "Error" ? `${e.name}: ` : "";
    return NextResponse.json({ error: `${name}${e.message}` }, { status: 502 });
  }
}
