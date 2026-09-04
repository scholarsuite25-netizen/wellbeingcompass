"use client";
import { useEffect, useRef, useState } from "react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Upload, UserPlus } from "lucide-react";

export default function EditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cats, setCats] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [form, setForm] = useState({
    slug: "new-article-" + Date.now().toString(36),
    title: "",
    deck: "",
    excerpt: "",
    featuredImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=700&fit=crop",
    imageAlt: "",
    categoryId: "",
    authorId: "",
    readingTime: 5,
    evidenceLevel: "General_education",
    reviewStatus: "draft",
    contentWarning: "",
  });
  const [blocks, setBlocks] = useState<any[]>([{ type: "paragraph", text: "Start writing — this is structured content, not arbitrary HTML." }]);
  const [keyTakeaways, setKT] = useState("Takeaway one\nTakeaway two");
  const [faqs, setFaqs] = useState([{ q: "", a: "" }]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Author creation
  const [creatingAuthor, setCreatingAuthor] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newAuthorRole, setNewAuthorRole] = useState("");
  const [authorBusy, setAuthorBusy] = useState(false);

  // Image upload
  const [imgBusy, setImgBusy] = useState(false);
  const [imgPreview, setImgPreview] = useState(form.featuredImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCats);
    loadAuthors();
  }, []);
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);
  if (status === "loading") return <div className="mx-auto max-w-3xl px-4 py-8">Loading session…</div>;

  const role = (session?.user as any)?.role as string;
  const isAuthor = role === "AUTHOR" || role === "CONTRIBUTOR";

  async function loadAuthors() {
    try {
      const r = await fetch("/api/authors");
      const data = await r.json();
      setAuthors(Array.isArray(data) ? data : []);
    } catch {
      setAuthors([]);
    }
  }

  async function handleUploadImage(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(png|jpeg|jpg|webp|gif)$/.test(file.type)) {
      setMsg({ kind: "err", text: "Only PNG, JPEG, WebP or GIF images are supported." });
      return;
    }
    setImgBusy(true);
    setMsg(null);
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
      setForm((f) => ({ ...f, featuredImage: data.url, imageAlt: f.imageAlt || file.name.replace(/\.[^.]+$/, "") }));
      setImgPreview(data.url);
      setMsg({ kind: "ok", text: "Image uploaded. It will be visible after this article is deployed if it is a durable host file." });
    } catch (err: any) {
      setMsg({ kind: "err", text: err?.message || "Upload failed — check your session and try again." });
    } finally {
      setImgBusy(false);
    }
  }

  async function createAuthor() {
    const name = newAuthorName.trim();
    if (!name) {
      setMsg({ kind: "err", text: "Type an author name first." });
      return;
    }
    setAuthorBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role: newAuthorRole.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create author");
      setAuthors((prev) => [...prev, data]);
      setForm((f) => ({ ...f, authorId: data.id }));
      setCreatingAuthor(false);
      setNewAuthorName("");
      setNewAuthorRole("");
      setMsg({ kind: "ok", text: `Author "${name}" created and selected.` });
    } catch (err: any) {
      setMsg({ kind: "err", text: err?.message || "Could not create author." });
    } finally {
      setAuthorBusy(false);
    }
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    const payload = {
      ...form,
      content: blocks,
      keyTakeaways: keyTakeaways.split("\n").filter(Boolean),
      faqs: faqs.filter((f) => f.q),
      references: [],
      topics: [],
    };
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          content: JSON.stringify(payload.content),
          keyTakeaways: JSON.stringify(payload.keyTakeaways),
          faqs: JSON.stringify(payload.faqs),
          references: JSON.stringify([]),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setMsg({ kind: "ok", text: `Saved! Slug: ${data.slug}. View: /articles/${data.slug}` });
    } catch (err: any) {
      setMsg({ kind: "err", text: "Error: " + (err?.message || "Failed to save") });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="font-display font-bold text-2xl text-brand-700">CMS Editor — Create Article</h1>
      <p className="text-sm text-muted mt-1">
        Rich structured blocks, SEO panel, author assignment, reviewer assignment, risk classification. Role: <b>{role}</b>{" "}
        {isAuthor && <span className="text-amber-600">(authors cannot publish high-risk without medical review)</span>}
      </p>

      <div className="mt-6 grid gap-4 bg-white border border-border rounded-2xl p-5">
        <label className="text-sm">
          <span className="font-medium">Title</span>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm" placeholder="Understanding…" />
        </label>
        <label className="text-sm">
          <span className="font-medium">Slug (URL)</span>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })} className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm font-mono" />
        </label>
        <label className="text-sm">
          <span className="font-medium">Deck / Subtitle</span>
          <textarea value={form.deck} onChange={(e) => setForm({ ...form, deck: e.target.value })} rows={2} className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          <span className="font-medium">Excerpt (SEO meta)</span>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm" />
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="text-sm">
            <span className="font-medium">Category</span>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm">
              <option value="">Select…</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
          <div className="text-sm">
            <span className="font-medium">Author</span>
            <select
              value={creatingAuthor ? "__new" : form.authorId}
              onChange={(e) => {
                if (e.target.value === "__new") setCreatingAuthor(true);
                else {
                  setCreatingAuthor(false);
                  setForm({ ...form, authorId: e.target.value });
                }
              }}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
            >
              <option value="">Select…</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name} — {a.role}</option>
              ))}
              <option value="__new">＋ Create new author…</option>
            </select>
            {creatingAuthor && (
              <div className="mt-2 rounded-xl border border-brand-200 bg-brand-50 p-3 space-y-2">
                <p className="text-xs font-semibold text-brand-700 flex items-center gap-1"><UserPlus className="h-3.5 w-3.5" /> New author</p>
                <input value={newAuthorName} onChange={(e) => setNewAuthorName(e.target.value)} placeholder="Full name (e.g. Ada Eze)" className="w-full rounded-lg border border-border px-2 py-1.5 text-sm" />
                <input value={newAuthorRole} onChange={(e) => setNewAuthorRole(e.target.value)} placeholder="Role / title (e.g. Public Health Writer)" className="w-full rounded-lg border border-border px-2 py-1.5 text-sm" />
                <button type="button" onClick={createAuthor} disabled={authorBusy} className="w-full bg-brand-700 text-white text-sm font-semibold rounded-full py-2 hover:bg-[#0A223C] disabled:opacity-50">
                  {authorBusy ? "Creating…" : "Create author & select"}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="text-sm">
          <span className="font-medium">Featured image</span>
          <div className="mt-1 flex flex-wrap items-start gap-3">
            <input value={form.featuredImage} onChange={(e) => { setForm({ ...form, featuredImage: e.target.value }); setImgPreview(e.target.value); }} className="flex-1 min-w-52 rounded-xl border border-border px-3 py-2 text-sm" placeholder="https://…" />
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => handleUploadImage(e.target.files?.[0])} />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imgBusy} className="inline-flex items-center gap-1.5 text-sm border border-border rounded-full px-4 py-2 hover:bg-brand-50 disabled:opacity-50">
              <Upload className="h-4 w-4 text-brand-700" /> {imgBusy ? "Uploading…" : "Upload"}
            </button>
          </div>
          <span className="text-xs text-muted">Alt text required for accessibility.</span>
          {imgPreview && (
            <img src={imgPreview} alt="Featured image preview" className="mt-2 max-h-40 rounded-xl border border-border object-cover" />
          )}
        </div>
        <label className="text-sm">
          <span className="font-medium">Image alt text</span>
          <input value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm" placeholder="Describe the image for screen readers" />
        </label>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="text-sm">
            <span className="font-medium">Reading time (min)</span>
            <input type="number" value={form.readingTime} onChange={(e) => setForm({ ...form, readingTime: parseInt(e.target.value) || 5 })} className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm" />
          </label>
          <label className="text-sm">
            <span className="font-medium">Evidence level</span>
            <select value={form.evidenceLevel} onChange={(e) => setForm({ ...form, evidenceLevel: e.target.value })} className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm">
              <option>Evidence_informed</option>
              <option>Expert_reviewed</option>
              <option>General_education</option>
              <option>Research_summary</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="font-medium">Review status</span>
            <select value={form.reviewStatus} onChange={(e) => setForm({ ...form, reviewStatus: e.target.value })} className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm">
              <option>draft</option>
              <option>pending_medical_review</option>
              <option>medically_reviewed</option>
              <option>published</option>
              <option>scheduled</option>
            </select>
          </label>
        </div>
        <label className="text-sm">
          <span className="font-medium">Content warning (if high-risk)</span>
          <input value={form.contentWarning} onChange={(e) => setForm({ ...form, contentWarning: e.target.value })} className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm" placeholder="Optional — e.g., Mentions self-harm, seek help resources" />
        </label>
      </div>

      <div className="mt-6 bg-white border border-border rounded-2xl p-5">
        <h3 className="font-semibold">Structured content blocks</h3>
        <p className="text-xs text-muted">Reusable blocks: heading, paragraph, list, quote, callout, tip, warning, image — with inline formatting and image upload.</p>
        <div className="mt-3"><RichTextEditor value={blocks} onChange={setBlocks} /></div>
      </div>

      <div className="mt-6 bg-white border border-border rounded-2xl p-5">
        <h3 className="font-semibold">Key takeaways (one per line)</h3>
        <textarea value={keyTakeaways} onChange={(e) => setKT(e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm" />
        <h3 className="font-semibold mt-4">FAQs</h3>
        {faqs.map((f, i) => (
          <div key={i} className="grid md:grid-cols-2 gap-2 mt-2">
            <input value={f.q} onChange={(e) => { const n = [...faqs]; n[i].q = e.target.value; setFaqs(n); }} placeholder="Question" className="rounded-xl border border-border px-3 py-2 text-sm" />
            <input value={f.a} onChange={(e) => { const n = [...faqs]; n[i].a = e.target.value; setFaqs(n); }} placeholder="Answer" className="rounded-xl border border-border px-3 py-2 text-sm" />
          </div>
        ))}
        <button type="button" onClick={() => setFaqs([...faqs, { q: "", a: "" }])} className="mt-2 text-xs border border-border rounded-full px-3 py-1">+ Add FAQ</button>
      </div>

      <div className="mt-6 flex gap-2">
        <button onClick={save} disabled={saving || !form.title || !form.categoryId || !form.authorId} className="bg-brand-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-brand-600 disabled:opacity-50">
          {saving ? "Saving…" : "Save article (create in DB)"}
        </button>
        <a href="/admin" className="border border-border px-6 py-2.5 rounded-full font-semibold hover:bg-gray-50">Back to dashboard</a>
      </div>
      {!form.authorId && form.title && form.categoryId && (
        <p className="text-xs text-amber-600 mt-3">Select an author or use “＋ Create new author…” to enable Save.</p>
      )}
      {msg && (
        <p role="status" className={`mt-3 text-sm rounded-xl p-3 ${msg.kind === "ok" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          {msg.text}
        </p>
      )}
      <p className="text-xs text-muted mt-4">Editor respects role permissions: Authors blocked from publishing high-risk without Medical Review. All saves create Revision entries in production and are audited.</p>
    </div>
  );
}