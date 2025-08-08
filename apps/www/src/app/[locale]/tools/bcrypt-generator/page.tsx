"use client";
import DotGrid from "@/components/backgrounds/dot-grid";
import Header from "@/components/layouts/header";
import toast from "@/components/toast/toast";
import { Button } from "@/components/ui/button";
import bcrypt from "bcryptjs";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useDebouncedCallback } from "use-debounce";

export default function BcryptGeneratorPage() {
  const t = useTranslations("bcrypt_generator");

  const [stringToHash, setStringToHash] = useState("");
  const [hashedString, setHashedString] = useState("");
  const [salt, setSalt] = useState(10);

  const handleGenerateHash = () => {
    const hash = bcrypt.hashSync(stringToHash, salt);
    setHashedString(hash);
  };
  const debounced = useDebouncedCallback(handleGenerateHash, 300);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(hashedString);
    toast.success(t("copy_success"));
  };

  const [compareHashedString, setCompareHashedString] = useState("");
  const [compareString, setCompareString] = useState("");
  const [isCompareMatch, setIsCompareMatch] = useState(false);

  const handleCompare = () => {
    const isMatch = bcrypt.compareSync(compareString, compareHashedString);
    setIsCompareMatch(isMatch);
  };
  const debouncedCompare = useDebouncedCallback(handleCompare, 300);

  return (
    <div>
      <Header />
      <main className="">
        <div className="relative py-8">
          <div className="absolute inset-0 bottom-0 top-0">
            <DotGrid
              dotSize={5}
              gap={15}
              baseColor="#191424"
              activeColor="#143cdb"
              proximity={100}
              shockRadius={250}
              shockStrength={5}
              resistance={750}
              returnDuration={1.5}
            />
          </div>

          <div className="container relative mx-auto flex w-full items-center">
            <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
              <div className="backdrop-blur-xs m-4 w-full rounded-lg border bg-slate-900/20 p-8 shadow-lg">
                <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
                <p className="mb-6 text-sm">{t("description")}</p>
                <div className="mb-4 grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-9">
                    <label className="mb-2 block" htmlFor="password">
                      {t("password_label")}
                    </label>
                    <input
                      id="password"
                      className="w-full rounded border p-2"
                      value={stringToHash}
                      placeholder={t("password_placeholder")}
                      onChange={(e) => {
                        setStringToHash(e.target.value);
                        debounced();
                      }}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <label className="mb-2 block" htmlFor="password">
                      {t("salt")}
                    </label>
                    <input
                      id="salt"
                      type="number"
                      className="w-full rounded border p-2"
                      value={salt}
                      onChange={(e) =>
                        setSalt(
                          Math.max(1, Math.min(Number(e.target.value), 12)),
                        )
                      }
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-2 block" htmlFor="hash">
                    {t("hash_label")}
                  </label>
                  <input
                    type="text"
                    id="hash"
                    className="w-full rounded border p-2"
                    value={hashedString}
                    readOnly
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    disabled={!hashedString}
                    onClick={handleCopyToClipboard}
                  >
                    <Copy /> {t("copy_button")}
                  </Button>
                </div>
              </div>

              {/* compare */}
              <div className="backdrop-blur-xs m-4 w-full rounded-lg border bg-slate-900/20 p-8 shadow-lg">
                <h1 className="mb-4 text-2xl font-bold">
                  {t("compare_title")}
                </h1>
                <p className="mb-6 text-sm">{t("compare_description")}</p>
                <div className="mb-4">
                  <label className="mb-2 block" htmlFor="hashed">
                    {t("compare_password_label")}
                  </label>
                  <input
                    id="hashed"
                    className="w-full rounded border p-2"
                    placeholder={t("compare_hash_placeholder")}
                    value={compareHashedString}
                    onChange={(e) => {
                      setCompareHashedString(e.target.value);
                      debouncedCompare();
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block" htmlFor="hashed">
                    {t("compare_hash_plain")}
                  </label>
                  <input
                    id="hashed-compare"
                    className="w-full rounded border p-2"
                    value={compareString}
                    onChange={(e) => {
                      setCompareString(e.target.value);
                      debouncedCompare();
                    }}
                  />
                </div>
                {isCompareMatch && (
                  <div className="rounded bg-green-800 p-4 text-white">
                    <p className="">{t("compare_success")}</p>
                  </div>
                )}
                {!isCompareMatch && compareHashedString && (
                  <div className="rounded bg-red-800 p-4 text-white">
                    <p className="">{t("compare_failure")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
