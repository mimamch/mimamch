"use client";
import Header from "@/components/layouts/header";
import toast from "@/components/toast/toast";
import { Button } from "@/components/ui/button";
import { Plus, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const inputClass = "w-full rounded border p-2";
const list = (v: string) =>
  v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export default function EmailSenderPage() {
  const t = useTranslations("email_sender");

  const [provider, setProvider] = useState<"resend" | "ses" | "smtp">("resend");
  const [apiKey, setApiKey] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("587");
  const [secure, setSecure] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyType, setBodyType] = useState<"text" | "html">("text");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState<{ name: string; value: string }[]>([]);
  const [sending, setSending] = useState(false);

  const setHeader = (i: number, patch: Partial<(typeof headers)[number]>) =>
    setHeaders(headers.map((h, j) => (i === j ? { ...h, ...patch } : h)));

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await toast.promise(
        (async () => {
          const res = await fetch("/api/tools/email-sender", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              provider,
              apiKey,
              accessKeyId,
              secretAccessKey,
              region,
              host,
              port: Number(port),
              secure,
              user,
              pass,
              from,
              to: list(to),
              cc: list(cc),
              bcc: list(bcc),
              replyTo: list(replyTo),
              subject,
              bodyType,
              body,
              headers: headers.filter((h) => h.name.trim()),
            }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error ?? t("error"));
          return json;
        })(),
        {
          loading: t("sending"),
          success: t("success"),
        },
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <Header />
      <main>
        <div className="relative py-8">
          <div className="container relative mx-auto w-full px-4">
            <form
              onSubmit={handleSend}
              className="grid w-full grid-cols-1 gap-8 md:grid-cols-2"
            >
              {/* provider + credentials */}
              <div className="backdrop-blur-xs w-full space-y-4 rounded-lg border bg-slate-900/90 p-8 shadow-lg">
                <h1 className="text-2xl font-bold">{t("title")}</h1>
                <p className="text-sm">{t("description")}</p>

                <div>
                  <label className="mb-2 block" htmlFor="provider">
                    {t("provider")}
                  </label>
                  <select
                    id="provider"
                    className={inputClass}
                    value={provider}
                    onChange={(e) =>
                      setProvider(e.target.value as typeof provider)
                    }
                  >
                    <option value="resend">Resend</option>
                    <option value="ses">AWS SES</option>
                    <option value="smtp">SMTP</option>
                  </select>
                </div>

                {provider === "smtp" ? (
                  <>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-8">
                        <label className="mb-2 block" htmlFor="smtp-host">
                          {t("smtp_host")}
                        </label>
                        <input
                          id="smtp-host"
                          className={inputClass}
                          placeholder="smtp.example.com"
                          value={host}
                          onChange={(e) => setHost(e.target.value)}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label className="mb-2 block" htmlFor="smtp-port">
                          {t("smtp_port")}
                        </label>
                        <input
                          id="smtp-port"
                          type="text"
                          inputMode="numeric"
                          className={inputClass}
                          placeholder="587"
                          value={port}
                          onChange={(e) => {
                            const next = e.target.value.replace(/\D/g, "");
                            setPort(next);
                            setSecure(next === "465");
                          }}
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={secure}
                        onChange={(e) => setSecure(e.target.checked)}
                      />
                      {t("smtp_secure")}
                    </label>
                    <div>
                      <label className="mb-2 block" htmlFor="smtp-user">
                        {t("smtp_user")}
                      </label>
                      <input
                        id="smtp-user"
                        className={inputClass}
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block" htmlFor="smtp-password">
                        {t("smtp_password")}
                      </label>
                      <input
                        id="smtp-password"
                        type="password"
                        className={inputClass}
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                      />
                    </div>
                  </>
                ) : provider === "resend" ? (
                  <div>
                    <label className="mb-2 block" htmlFor="api-key">
                      {t("api_key")}
                    </label>
                    <input
                      id="api-key"
                      type="password"
                      className={inputClass}
                      placeholder="re_xxxxxxxx"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="mb-2 block" htmlFor="access-key-id">
                        {t("access_key_id")}
                      </label>
                      <input
                        id="access-key-id"
                        className={inputClass}
                        placeholder="AKIA..."
                        value={accessKeyId}
                        onChange={(e) => setAccessKeyId(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block" htmlFor="secret-access-key">
                        {t("secret_access_key")}
                      </label>
                      <input
                        id="secret-access-key"
                        type="password"
                        className={inputClass}
                        value={secretAccessKey}
                        onChange={(e) => setSecretAccessKey(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block" htmlFor="region">
                        {t("region")}
                      </label>
                      <input
                        id="region"
                        className={inputClass}
                        placeholder="us-east-1"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="mb-2 block">{t("custom_headers")}</label>
                  <div className="space-y-2">
                    {headers.map((h, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          className={inputClass}
                          placeholder={t("header_name_placeholder")}
                          value={h.name}
                          onChange={(e) =>
                            setHeader(i, { name: e.target.value })
                          }
                        />
                        <input
                          className={inputClass}
                          placeholder={t("header_value_placeholder")}
                          value={h.value}
                          onChange={(e) =>
                            setHeader(i, { value: e.target.value })
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={t("remove_header")}
                          onClick={() =>
                            setHeaders(headers.filter((_, j) => j !== i))
                          }
                        >
                          <X />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setHeaders([...headers, { name: "", value: "" }])
                      }
                    >
                      <Plus /> {t("add_header")}
                    </Button>
                  </div>
                </div>
              </div>

              {/* message */}
              <div className="backdrop-blur-xs w-full space-y-4 rounded-lg border bg-slate-900/90 p-8 shadow-lg">
                <h2 className="text-2xl font-bold">{t("message")}</h2>

                <div>
                  <label className="mb-2 block" htmlFor="from">
                    {t("from")}
                  </label>
                  <input
                    id="from"
                    className={inputClass}
                    // raw: the value contains <...>, which ICU would parse as a tag
                    placeholder={t.raw("from_placeholder")}
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {(
                    [
                      ["to", to, setTo],
                      ["cc", cc, setCc],
                      ["bcc", bcc, setBcc],
                    ] as const
                  ).map(([key, value, set]) => (
                    <div key={key}>
                      <label className="mb-2 block" htmlFor={key}>
                        {t(key)}
                      </label>
                      <input
                        id={key}
                        className={inputClass}
                        placeholder={t("comma_separated")}
                        value={value}
                        onChange={(e) => set(e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block" htmlFor="reply-to">
                    {t("reply_to")}
                  </label>
                  <input
                    id="reply-to"
                    className={inputClass}
                    placeholder={t("comma_separated")}
                    value={replyTo}
                    onChange={(e) => setReplyTo(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block" htmlFor="subject">
                    {t("subject")}
                  </label>
                  <input
                    id="subject"
                    className={inputClass}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="body">{t("body")}</label>
                    <select
                      className="rounded border p-1 text-sm"
                      aria-label={t("body_type")}
                      value={bodyType}
                      onChange={(e) =>
                        setBodyType(e.target.value as typeof bodyType)
                      }
                    >
                      <option value="text">{t("plain_text")}</option>
                      <option value="html">{t("html")}</option>
                    </select>
                  </div>
                  <textarea
                    id="body"
                    rows={10}
                    className={`${inputClass} font-mono text-sm`}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>

                <Button type="submit" disabled={sending}>
                  <Send /> {t("send_button")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
