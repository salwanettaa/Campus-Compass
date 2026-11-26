"use client";

import { useState } from "react";
import { Check, HelpCircle, X } from "lucide-react";
import { GUIDE_CATEGORIES } from "@/lib/knowledge/types";
import { categoryName } from "@/lib/knowledge/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function RequestGuideModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<string>(GUIDE_CATEGORIES[0]);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    // Simulate submission to admin queue
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setTopic("");
      setNote("");
    }, 2000);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5"
      >
        <HelpCircle className="size-4 text-brand-700" aria-hidden="true" />
        <span>Request Panduan</span>
      </Button>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-guide-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-brand-300 bg-paper-raised p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup form"
              className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-lg text-brand-700 hover:bg-brand-100 hover:text-brand-950 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <div className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <Check className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-h3 font-semibold text-brand-950">
                  Permintaan Terkirim!
                </h3>
                <p className="text-body text-pretty text-brand-800 max-w-sm">
                  Tim kurator kampus & perwakilan mahasiswa telah menerima usulan panduan ini. Kami akan memverifikasi dan menyusun panduan resminya secepatnya.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <h3 id="request-guide-title" className="text-h3 font-semibold text-brand-950">
                    Ajukan Panduan Kampus Baru
                  </h3>
                  <p className="text-caption text-brand-800 mt-1">
                    Belum menemukan panduan yang kamu butuhkan? Tulis topik yang kamu cari, tim kurator akan memvalidasi sumber resminya.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="req-topic" className="text-caption font-semibold text-brand-900">
                    Topik Panduan <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="req-topic"
                    required
                    placeholder="Contoh: Alur Pengajuan Cuti Kuliah Vokasi UGM"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="req-cat" className="text-caption font-semibold text-brand-900">
                    Kategori Terkait
                  </label>
                  <Select
                    id="req-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {GUIDE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryName(cat)}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="req-note" className="text-caption font-semibold text-brand-900">
                    Keterangan Tambahan / Sumber yang Diketahui (Opsional)
                  </label>
                  <Textarea
                    id="req-note"
                    rows={3}
                    placeholder="Ceritakan kendala yang kamu hadapi atau kontak unit kampus terkait..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit">
                    Kirim Permintaan
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
