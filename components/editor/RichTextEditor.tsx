"use client";
import { useState } from "react";

type Block = { type: "heading"|"paragraph"|"list"|"quote"|"callout"|"tip"|"warning"; text: string; items?: string[] };

export function RichTextEditor({ value, onChange }: { value: Block[]; onChange: (v:Block[])=>void }){
  const [blocks,setBlocks]=useState<Block[]>(value);
  function update(idx:number, patch:Partial<Block>){
    const next = blocks.map((b,i)=> i===idx ? { ...b, ...patch } : b);
    setBlocks(next); onChange(next);
  }
  function add(type: Block["type"]){
    const nb: Block = type==="list" ? { type, text:"", items:["New item"] } : { type, text:"New content" };
    const next = [...blocks, nb]; setBlocks(next); onChange(next);
  }
  function remove(idx:number){ const next = blocks.filter((_,i)=>i!==idx); setBlocks(next); onChange(next); }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {(["heading","paragraph","list","quote","callout","tip","warning"] as const).map(t=>(
          <button key={t} type="button" onClick={()=>add(t)} className="text-xs border border-border rounded-full px-2 py-1 hover:bg-brand-50 capitalize">+ {t}</button>
        ))}
      </div>
      {blocks.map((b,i)=>(
        <div key={i} className="border border-border rounded-xl p-3 bg-surface">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted">{b.type}</span>
            <button type="button" onClick={()=>remove(i)} className="text-xs text-red-600 hover:underline">Remove</button>
          </div>
          {b.type==="list" ? (
            <textarea value={(b.items||[]).join("\n")} onChange={e=> update(i, { items: e.target.value.split("\n").filter(Boolean) })} rows={3} placeholder="One item per line" className="mt-2 w-full rounded-lg border border-border px-2 py-1 text-sm"/>
          ) : (
            <textarea value={b.text} onChange={e=> update(i,{ text: e.target.value })} rows={b.type==="heading"?1:3} className="mt-2 w-full rounded-lg border border-border px-2 py-1 text-sm" placeholder={b.type==="heading"?"Heading…":"Text…"}/>
          )}
        </div>
      ))}
      {blocks.length===0 && <p className="text-sm text-muted">No blocks — add one above. Stored as structured JSON, not raw HTML.</p>}
    </div>
  )
}
