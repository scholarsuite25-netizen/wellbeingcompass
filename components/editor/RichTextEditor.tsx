"use client";
import { useRef, useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { Bold, Italic, Underline, Link2, Code, Upload, Image as ImageIcon } from "lucide-react";

type Block = {
  type: "heading" | "paragraph" | "list" | "quote" | "callout" | "tip" | "warning" | "image";
  text: string;
  items?: string[];
  url?: string;
  alt?: string;
};

const BLOCK_TYPES: Block["type"][] = ["heading", "paragraph", "list", "quote", "callout", "tip", "warning", "image"];

export function RichTextEditor({ value, onChange }: { value: Block[]; onChange: (v: Block[]) => void }) {
  const [blocks, setBlocks] = useState<Block[]>(value);
  const taRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});
  const focusRef = useRef({ idx: 0, start: 0, end: 0 });
  const [uploading, setUploading] = useState<number | null>(null);
  const [uploadErr, setUploadErr] = useState("");
  const router = useRouter();

  function update(idx: number, patch: Partial<Block>) {
    const next = blocks.map((b, i) => (i === idx ? { ...b, ...patch } : b));
    setBlocks(next);
    onChange(next);
  }

  function add(type: Block["type"]) {
    const nb: Block =
      type === "list"
        ? { type, text: "", items: ["New item"] }
        : type === "image"
          ? { type, text: "", url: "", alt: "" }
          : { type, text: "New content" };
    const next = [...blocks, nb];
    setBlocks(next);
    onChange(next);
  }

  function remove(idx: number) {
    const next = blocks.filter((_, i) => i !== idx);
    setBlocks(next);
    onChange(next);
  }

  function move(idx: number, dir: -1 | 1) {
    const to = idx + dir;
    if (to < 0 || to >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[to]] = [next[to], next[idx]];
    setBlocks(next);
    onChange(next);
  }

  function setSelection(idx: number, start: number, end: number) {
    const el = taRefs.current[idx];
    if (!el) return;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start, end);
    });
  }

  const PLACEHOLDER: Record<string, string> = {
    bold: "bold text",
    italic: "italic text",
    underline: "underlined text",
    code: "code",
  };

  function applyInline(fmt: string) {
    const { idx, start, end } = focusRef.current;
    const block = blocks[idx];
    if (!block || block.type === "image") return;
    const text = block.text || "";
    const sel = text.slice(start, end);
    let prefix = "";
    let inner = sel;
    let suffix = "";
    if (fmt === "link") {
      if (sel) {
        if (/^https?:\/\//i.test(sel)) {
          prefix = "[";
          suffix = `](${sel})`;
        } else {
          prefix = "[";
          suffix = "](https://)";
        }
      } else {
        prefix = "[";
        inner = "link text";
        suffix = "](https://)";
      }
    } else {
      prefix = `**`;
      suffix = `**`;
      if (fmt === "italic") {
        prefix = `*`;
        suffix = `*`;
      } else if (fmt === "underline") {
        prefix = `__`;
        suffix = `__`;
      } else if (fmt === "code") {
        prefix = "`";
        suffix = "`";
      }
      if (!sel) inner = PLACEHOLDER[fmt] || "text";
    }
    const newText = text.slice(0, start) + prefix + inner + suffix + text.slice(end);
    const next = blocks.map((b, i) => (i === idx ? { ...b, text: newText } : b));
    setBlocks(next);
    onChange(next);
    setSelection(idx, start + prefix.length, start + prefix.length + inner.length);
  }

  function trackFocus(idx: number, e: SyntheticEvent<HTMLTextAreaElement>) {
    const t = e.currentTarget;
    focusRef.current = { idx, start: t.selectionStart, end: t.selectionEnd };
  }

  async function handleUpload(idx: number, file: File | undefined) {
    if (!file) return;
    if (!/^image\/(png|jpeg|jpg|webp|gif)$/.test(file.type)) {
      setUploadErr("Only PNG, JPEG, WebP or GIF images are supported.");
      return;
    }
    setUploading(idx);
    setUploadErr("");
    try {
      const reader = new FileReader();
      const dataUrl: string = await new Promise((res, rej) => {
        reader.onload = () => res(reader.result as string);
        reader.onerror = () => rej(new Error("Could not read file"));
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      update(idx, { url: data.url, alt: file.name.replace(/\.[^.]+$/, "") });
      router.refresh();
    } catch (err: any) {
      setUploadErr(err?.message || "Upload failed — check your session and try again.");
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="space-y-3">
      {uploadErr && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{uploadErr}</p>}
      <div className="flex flex-wrap gap-1">
        {BLOCK_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => add(t)}
            className="text-xs border border-border rounded-full px-2 py-1 hover:bg-brand-50 capitalize"
          >
            + {t}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">
        Select text in a block, then use the block toolbar for <b>bold</b>, <i>italic</i>, <u>underline</u>, links and
        code. Markup is stored as structured text and rendered safely.
      </p>

      {blocks.map((b, i) => (
        <div key={i} className="border border-border rounded-xl p-3 bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted">{b.type}</span>
            <div className="flex items-center gap-1">
              {b.type !== "image" && (
                <div className="flex items-center gap-0.5 mr-1">
                  <button type="button" title="Bold" aria-label="Bold" onClick={() => applyInline("bold")} className="h-7 w-7 grid place-items-center rounded-md border border-border bg-white hover:bg-brand-50"><Bold className="h-3.5 w-3.5 text-brand-700" /></button>
                  <button type="button" title="Italic" aria-label="Italic" onClick={() => applyInline("italic")} className="h-7 w-7 grid place-items-center rounded-md border border-border bg-white hover:bg-brand-50"><Italic className="h-3.5 w-3.5 text-brand-700" /></button>
                  <button type="button" title="Underline" aria-label="Underline" onClick={() => applyInline("underline")} className="h-7 w-7 grid place-items-center rounded-md border border-border bg-white hover:bg-brand-50"><Underline className="h-3.5 w-3.5 text-brand-700" /></button>
                  <button type="button" title="Link" aria-label="Link" onClick={() => applyInline("link")} className="h-7 w-7 grid place-items-center rounded-md border border-border bg-white hover:bg-brand-50"><Link2 className="h-3.5 w-3.5 text-brand-700" /></button>
                  <button type="button" title="Inline code" aria-label="Inline code" onClick={() => applyInline("code")} className="h-7 w-7 grid place-items-center rounded-md border border-border bg-white hover:bg-brand-50"><Code className="h-3.5 w-3.5 text-brand-700" /></button>
                </div>
              )}
              <button type="button" onClick={() => move(i, -1)} className="text-xs border border-border rounded-full px-2 py-0.5 hover:bg-brand-50" disabled={i === 0}>↑</button>
              <button type="button" onClick={() => move(i, 1)} className="text-xs border border-border rounded-full px-2 py-0.5 hover:bg-brand-50" disabled={i === blocks.length - 1}>↓</button>
              <button type="button" onClick={() => remove(i)} className="text-xs text-red-600 border border-red-200 rounded-full px-2 py-0.5 hover:bg-red-50">Remove</button>
            </div>
          </div>

          {b.type === "image" ? (
            <div className="mt-2 space-y-2">
              {b.url && <img src={b.url} alt={b.alt || ""} className="max-h-48 rounded-lg border border-border object-cover" />}
              <div className="flex flex-wrap gap-2">
                <input value={b.url || ""} onChange={(e) => update(i, { url: e.target.value })} placeholder="Image URL or use Upload" className="flex-1 min-w-40 rounded-lg border border-border px-2 py-1 text-sm" />
                <label className="inline-flex items-center gap-1.5 text-xs border border-border rounded-full px-3 py-1.5 bg-white hover:bg-brand-50 cursor-pointer">
                  <Upload className="h-3.5 w-3.5 text-brand-700" />
                  {uploading === i ? "Uploading…" : "Upload"}
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => handleUpload(i, e.target.files?.[0])} />
                </label>
                <button type="button" onClick={() => router.refresh()} className="text-xs border border-border rounded-full px-3 py-1.5 hover:bg-brand-50">
                  <ImageIcon className="h-3.5 w-3.5 text-brand-700 inline-block mr-1" />Refresh preview
                </button>
              </div>
              <input value={b.alt || ""} onChange={(e) => update(i, { alt: e.target.value })} placeholder="Alt text (accessibility)" className="w-full rounded-lg border border-border px-2 py-1 text-sm" />
            </div>
          ) : b.type === "list" ? (
            <textarea
              ref={(el) => { taRefs.current[i] = el; }}
              value={(b.items || []).join("\n")}
              onSelect={(e) => trackFocus(i, e)}
              onKeyUp={(e) => trackFocus(i, e as any)}
              onClick={(e) => trackFocus(i, e)}
              onChange={(e) => update(i, { items: e.target.value.split("\n").filter(Boolean) })}
              rows={3}
              placeholder="One item per line"
              className="mt-2 w-full rounded-lg border border-border px-2 py-1 text-sm"
            />
          ) : (
            <textarea
              ref={(el) => { taRefs.current[i] = el; }}
              value={b.text}
              onSelect={(e) => trackFocus(i, e)}
              onKeyUp={(e) => trackFocus(i, e as any)}
              onClick={(e) => trackFocus(i, e)}
              onChange={(e) => update(i, { text: e.target.value })}
              rows={b.type === "heading" ? 1 : 3}
              placeholder={b.type === "heading" ? "Heading…" : "Text…"}
              className="mt-2 w-full rounded-lg border border-border px-2 py-1 text-sm"
            />
          )}
        </div>
      ))}
      {blocks.length === 0 && <p className="text-sm text-muted">No blocks — add one above. Stored as structured JSON, not raw HTML.</p>}
    </div>
  );
}