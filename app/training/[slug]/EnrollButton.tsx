"use client";
export function EnrollButton(){
  return <button onClick={()=>alert("Demo: enroll stored locally (would save to DB in production)")} className="mt-4 w-full bg-brand-500 text-white py-2.5 rounded-full font-semibold hover:bg-brand-600">Enroll (demo)</button>;
}
