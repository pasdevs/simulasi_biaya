// import React, { useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Check, ChevronRight, ShieldCheck, HelpCircle, Calculator, ArrowRight, PhoneCall, CheckCircle } from "lucide-react";

// /**
//  * PMB UNPAS – Simulasi Pembayaran (Final, fixed)
//  * - Satu file, tanpa import eksternal ke komponen lain (hindari path error)
//  * - Memperbaiki JSX yang terpotong (penyebab SyntaxError di baris ~234)
//  * - Menambahkan util "computeFees" + console.assert sebagai test ringan
//  * - Nomor WA CS resmi: 0811960193 (format 62 untuk wa.me)
//  */

// const CS_WHATSAPP = "62811960193"; // 0811960193 → 62 format

// const FACULTIES_FALLBACK = [
//   { id: "FT", name: "Fakultas Teknik", programs: ["Teknik Industri", "Teknik Mesin", "Teknik Informatika", "Teknik Lingkungan", "Teknologi Pangan", "Perencanaan Wilayah & Kota"] },
//   { id: "FEB", name: "Fakultas Ekonomi & Bisnis", programs: ["Manajemen", "Akuntansi", "Ekonomi Pembangunan"] },
//   { id: "FISIP", name: "FISIP", programs: ["Ilmu Administrasi Publik", "Hubungan Internasional", "Kesejahteraan Sosial"] },
//   { id: "FH", name: "Fakultas Hukum", programs: ["Ilmu Hukum"] },
//   { id: "FKIP", name: "FKIP", programs: ["Pendidikan Bahasa & Sastra Indonesia", "Pendidikan Matematika", "Pendidikan Ekonomi"] },
//   { id: "FISS", name: "FISS", programs: ["Sastra Indonesia", "Sastra Inggris", "Sastra Jepang"] },
//   { id: "FK", name: "Fakultas Kedokteran", programs: ["Kedokteran"] },
//   { id: "PASCA", name: "Sekolah Pascasarjana", programs: ["Magister Manajemen", "Magister Ilmu Administrasi", "Magister Hukum"] },
// ];

// const JALUR = [
//   { id: "reg", name: "Reguler" },
//   { id: "kipk", name: "KIP-K (Kuota terbatas)" },
//   { id: "trans", name: "Alih Jenjang/Transfer" },
// ];

// const CICILAN = [
//   { id: 1, label: "Lunas Sekali Bayar (Diskon)" },
//   { id: 6, label: "6x" },
//   { id: 12, label: "12x" },
//   { id: 24, label: "24x" },
// ];

// const FEE_FALLBACK: Record<string, { spp: number; ug: number }> = {
//   "Teknik Informatika": { spp: 8500000, ug: 6000000 },
//   "Teknik Industri": { spp: 8000000, ug: 6000000 },
//   "Teknik Mesin": { spp: 7800000, ug: 5500000 },
//   "Teknik Lingkungan": { spp: 8000000, ug: 5500000 },
//   "Teknologi Pangan": { spp: 8200000, ug: 6000000 },
//   "Perencanaan Wilayah & Kota": { spp: 8300000, ug: 6000000 },
//   "Manajemen": { spp: 7600000, ug: 5500000 },
//   "Akuntansi": { spp: 7600000, ug: 5500000 },
//   "Ekonomi Pembangunan": { spp: 7000000, ug: 5000000 },
//   "Ilmu Administrasi Publik": { spp: 7000000, ug: 5000000 },
//   "Hubungan Internasional": { spp: 7800000, ug: 5500000 },
//   "Kesejahteraan Sosial": { spp: 6800000, ug: 4500000 },
//   "Ilmu Hukum": { spp: 8000000, ug: 6000000 },
//   "Pendidikan Bahasa & Sastra Indonesia": { spp: 6200000, ug: 4000000 },
//   "Pendidikan Matematika": { spp: 6000000, ug: 3800000 },
//   "Pendidikan Ekonomi": { spp: 6000000, ug: 3800000 },
//   "Sastra Indonesia": { spp: 6000000, ug: 3800000 },
//   "Sastra Inggris": { spp: 6500000, ug: 4200000 },
//   "Sastra Jepang": { spp: 6500000, ug: 4200000 },
//   "Kedokteran": { spp: 22000000, ug: 35000000 },
//   "Magister Manajemen": { spp: 11000000, ug: 8000000 },
//   "Magister Ilmu Administrasi": { spp: 10000000, ug: 7000000 },
//   "Magister Hukum": { spp: 10000000, ug: 7000000 },
// };

// export function formatIDR(n: number) {
//   return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
// }

// // --- Pure util (mudah dites) ---
// export function computeFees({ spp, ug }: { spp: number; ug: number }, { path, scholarPct, dp, tenor, includeUniform, includeReg }: { path: "reg" | "kipk" | "trans"; scholarPct: number; dp: number; tenor: number; includeUniform: boolean; includeReg: boolean; }) {
//   const pathAdj = path === "kipk" ? 0.6 : path === "trans" ? 1.1 : 1;
//   const _spp = Math.round(spp * pathAdj);
//   const _ug = Math.round(ug * pathAdj);
//   const uniform = includeUniform ? 600000 : 0;
//   const reg = includeReg ? 300000 : 0;
//   const bea = Math.round(_spp * (scholarPct / 100));
//   const sppAfterBea = Math.max(0, _spp - bea);
//   const ugAfterDp = Math.max(0, _ug + uniform + reg - dp);
//   const monthly = tenor === 1 ? 0 : Math.ceil((sppAfterBea * 2) / tenor);
//   return { spp: _spp, ug: _ug, uniform, reg, bea, sppAfterBea, ugAfterDp, monthly, firstPay: Math.max(0, dp), totalYear: sppAfterBea * 2 + _ug + uniform + reg };
// }

// // --- Light tests (run once in browser devtools) ---
// (function runInlineTests(){
//   const base = { spp: 1000000, ug: 2000000 };
//   let r = computeFees(base, { path: "reg", scholarPct: 0, dp: 0, tenor: 10, includeUniform: true, includeReg: true });
//   console.assert(r.spp === 1000000 && r.ug === 2000000, "Base adjust failed");
//   r = computeFees(base, { path: "kipk", scholarPct: 50, dp: 500000, tenor: 10, includeUniform: false, includeReg: false });
//   console.assert(r.spp === 600000, "KIP-K adjust failed");
//   console.assert(r.bea === 300000 && r.sppAfterBea === 300000, "Scholarship calc failed");
// })();

// export default function PaymentSimulatorLandingFinal() {
//   const [faculty, setFaculty] = useState(FACULTIES_FALLBACK[0].id);
//   const [program, setProgram] = useState(FACULTIES_FALLBACK[0].programs[0]);
//   const [path, setPath] = useState<"reg" | "kipk" | "trans">(JALUR[0].id as any);
//   const [tenor, setTenor] = useState(12);
//   const [dp, setDp] = useState(3000000);
//   const [scholar, setScholar] = useState(0);
//   const [includeUniform, setIncludeUniform] = useState(true);
//   const [includeRegFee, setIncludeRegFee] = useState(true);
//   const [leadName, setLeadName] = useState("");
//   const [leadPhone, setLeadPhone] = useState("");

//   const programsForFaculty = useMemo(() => FACULTIES_FALLBACK.find(f => f.id === faculty)?.programs ?? [], [faculty]);

//   const fees = useMemo(() => {
//     const base = FEE_FALLBACK[program] ?? { spp: 7000000, ug: 5000000 };
//     return computeFees(base, { path, scholarPct: scholar, dp, tenor, includeUniform, includeReg: includeRegFee });
//   }, [program, path, includeUniform, includeRegFee, scholar, dp, tenor]);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-emerald-50">
//       {/* Header */}
//       <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
//         <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="h-10 w-10 rounded-xl bg-indigo-600 grid place-items-center text-white font-bold">U</div>
//             <div>
//               <p className="text-sm text-slate-500 leading-none">Portal Resmi</p>
//               <p className="text-base font-semibold leading-tight">PMB Universitas Pasundan</p>
//             </div>
//           </div>
//           <div className="hidden md:flex items-center gap-3">
//             <Badge variant="secondary" className="gap-1"><ShieldCheck className="h-4 w-4"/> Terakreditasi</Badge>
//             <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => document.getElementById("simulator")?.scrollIntoView({behavior:"smooth"})}>
//               Simulasikan Biaya <Calculator className="ml-2 h-4 w-4"/>
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Hero */}
//       <section className="relative overflow-hidden">
//         <div className="mx-auto max-w-7xl px-4 py-10 md:py-16 grid md:grid-cols-2 gap-10 items-center">
//           <div>
//             <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
//               Rancang Cara Bayarmu. <span className="text-indigo-600">Transparan</span>, <span className="text-emerald-600">Fleksibel</span>, <span className="text-amber-600">Terjangkau</span>.
//             </motion.h1>
//             <p className="mt-4 text-slate-600 md:text-lg leading-relaxed">
//               Simulasikan sendiri biaya kuliahmu sesuai jurusan dan jalur masuk. Dapatkan estimasi cicilan, uang pangkal, dan total tahun pertama.
//             </p>
//             <div className="mt-6 flex items-center gap-3">
//               <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => document.getElementById("simulator")?.scrollIntoView({behavior:"smooth"})}>
//                 Mulai Simulasi <ArrowRight className="ml-2 h-4 w-4"/>
//               </Button>
//               <Button variant="outline" onClick={() => document.getElementById("akreditasi")?.scrollIntoView({behavior:"smooth"})}>Lihat Akreditasi</Button>
//             </div>
//             <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
//               <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/> Transparansi biaya</div>
//               <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600"/> CS responsif via WhatsApp</div>
//             </div>
//           </div>

//           <Card className="shadow-xl rounded-2xl">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-xl font-bold">Quick Look – Estimasimu</CardTitle>
//             </CardHeader>
//             <CardContent className="grid grid-cols-2 gap-4">
//               <div className="rounded-xl bg-indigo-50 p-4">
//                 <p className="text-xs text-slate-500">Cicilan per bulan</p>
//                 <p className="text-2xl font-extrabold text-indigo-700">{formatIDR(fees.monthly)}</p>
//               </div>
//               <div className="rounded-xl bg-emerald-50 p-4">
//                 <p className="text-xs text-slate-500">DP (uang muka)</p>
//                 <p className="text-2xl font-extrabold text-emerald-700">{formatIDR(fees.firstPay)}</p>
//               </div>
//               <div className="rounded-xl bg-amber-50 p-4 col-span-2">
//                 <p className="text-xs text-slate-500">Perkiraan total tahun pertama</p>
//                 <p className="text-xl font-extrabold text-amber-700">{formatIDR(fees.totalYear)}</p>
//               </div>
//               <Button className="col-span-2 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => document.getElementById("simulator")?.scrollIntoView({behavior:"smooth"})}>Atur Simulasi Lengkap</Button>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* Simulator */}
//       <section id="simulator" className="mx-auto max-w-7xl px-4 py-12">
//         <Card className="rounded-2xl shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-2xl">Simulasi Pembayaran</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="grid md:grid-cols-3 gap-4">
//               <SelectField label="Fakultas" value={faculty} options={FACULTIES_FALLBACK.map(f => ({value: f.id, label: f.name}))} onChange={(v)=>{setFaculty(v); setProgram(FACULTIES_FALLBACK.find(f=>f.id===v)?.programs[0]||"");}}/>
//               <SelectField label="Program Studi" value={program} options={programsForFaculty.map(p => ({value: p, label: p}))} onChange={setProgram}/>
//               <SelectField label="Jalur" value={path} options={JALUR.map(j => ({value: j.id as any, label: j.name}))} onChange={(v)=>setPath(v as any)}/>
//             </div>

//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <Label>Tenor Cicilan (bulan)</Label>
//                 <div className="flex gap-2 flex-wrap">
//                   {CICILAN.map(opt => (
//                     <Button key={opt.id} variant={tenor===opt.id?"default":"outline"} className={tenor===opt.id?"bg-indigo-600 text-white":""} onClick={()=>setTenor(opt.id)}>
//                       {opt.label}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 <Label>Beasiswa (persentase SPP)</Label>
//                 <Slider defaultValue={[0]} value={[scholar]} min={0} max={50} step={5} onValueChange={(v)=>setScholar(v[0])}/>
//                 <div className="text-sm text-slate-600">{scholar}% dari SPP per semester</div>
//               </div>
//             </div>

//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <Label>Uang Muka (DP)</Label>
//                 <Input type="number" value={dp} onChange={(e)=>setDp(parseInt(e.target.value||"0"))}/>
//                 <p className="text-xs text-slate-500">DP lebih besar → cicilan lebih ringan.</p>
//               </div>
//               <div className="space-y-3">
//                 <Label>Biaya Tambahan</Label>
//                 <ToggleOption label="Seragam & atribut" checked={includeUniform} onChange={setIncludeUniform}/>
//                 <ToggleOption label="Registrasi awal" checked={includeRegFee} onChange={setIncludeRegFee}/>
//               </div>
//             </div>

//             <div className="grid md:grid-cols-3 gap-4">
//               <SummaryTile label="SPP per semester" value={fees.spp}/>
//               <SummaryTile label="Uang Gedung" value={fees.ug}/>
//               <SummaryTile label="Potongan Beasiswa" value={-fees.bea}/>
//               <SummaryTile label="Sisa UG setelah DP" value={fees.ugAfterDp}/>
//               <SummaryTile label="Cicilan/bulan" value={fees.monthly} highlight="indigo"/>
//               <SummaryTile label="Total Tahun Pertama (perkiraan)" value={fees.totalYear} highlight="amber"/>
//             </div>

//             <div className="grid md:grid-cols-3 gap-3">
//               <Button className="bg-amber-500 hover:bg-amber-600 text-white">
//                 Lanjut Daftar Sekarang
//               </Button>
//               <Button variant="outline" onClick={()=>document.getElementById("lead")?.scrollIntoView({behavior:"smooth"})}>
//                 Konsultasi dengan CS <PhoneCall className="ml-2 h-4 w-4"/>
//               </Button>
//               <Button variant="ghost" asChild>
//                 <a href="#faq">Lihat FAQ <HelpCircle className="ml-2 h-4 w-4"/></a>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </section>

//       {/* Akreditasi */}
//       <section id="akreditasi" className="mx-auto max-w-7xl px-4 py-12">
//         <AccreditationPanel />
//       </section>

//       {/* Lead Capture */}
//       <section id="lead" className="mx-auto max-w-7xl px-4 py-12">
//         <Card className="rounded-2xl shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-2xl">Simpan Hasil & Konsultasikan via WhatsApp</CardTitle>
//           </CardHeader>
//           <CardContent className="grid md:grid-cols-4 gap-4 items-end">
//             <div className="md:col-span-2 space-y-2">
//               <Label>Nama lengkap</Label>
//               <Input placeholder="contoh: Ferry Mulyanto" value={leadName} onChange={(e)=>setLeadName(e.target.value)}/>
//             </div>
//             <div className="md:col-span-1 space-y-2">
//               <Label>No. WhatsApp</Label>
//               <Input placeholder="08xxxxxxxxxx" value={leadPhone} onChange={(e)=>setLeadPhone(e.target.value)}/>
//             </div>
//             <div className="md:col-span-1">
//               <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
//                 <a href={`https://wa.me/${CS_WHATSAPP}?text=` + encodeURIComponent(`Halo UNPAS, saya ${leadName||"(Nama)"}. Mohon bantuannya untuk simulasi pembayaran prodi ${program}.`)} target="_blank" rel="noreferrer">Chat WhatsApp</a>
//               </Button>
//               <p className="mt-2 text-xs text-slate-500">Jam layanan: 08.00–20.00 WIB (Senin–Sabtu)</p>
//             </div>
//           </CardContent>
//         </Card>
//       </section>

//       {/* FAQ */}
//       <section id="faq" className="mx-auto max-w-7xl px-4 py-12">
//         <div className="grid md:grid-cols-2 gap-8">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-extrabold">Pertanyaan yang sering ditanyakan</h2>
//             <p className="mt-2 text-slate-600">Jawaban singkat, bahasa ramah, dan tanpa istilah rumit.</p>
//             <div className="mt-6">
//               <Accordion type="single" collapsible>
//                 <AccordionItem value="item-1">
//                   <AccordionTrigger>Apakah angka di simulasi pasti sama saat daftar?</AccordionTrigger>
//                   <AccordionContent>
//                     Angka di simulasi adalah estimasi berdasarkan data saat ini. Keputusan akhir mengikuti kebijakan universitas pada saat registrasi.
//                   </AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="item-2">
//                   <AccordionTrigger>Bisakah saya mengubah tenor dan DP?</AccordionTrigger>
//                   <AccordionContent>
//                     Bisa. Atur ulang slider beasiswa, masukkan nominal DP yang diinginkan, lalu pilih tenor yang sesuai. Sistem akan menyesuaikan estimasi cicilan.
//                   </AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="item-3">
//                   <AccordionTrigger>Apa itu uang gedung dan kapan dibayar?</AccordionTrigger>
//                   <AccordionContent>
//                     Uang gedung adalah biaya pengembangan sarana/prasarana yang umumnya dibayarkan di tahun pertama. Anda dapat mengurangi beban awal dengan DP.
//                   </AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="item-4">
//                   <AccordionTrigger>Apakah ada beasiswa?</AccordionTrigger>
//                   <AccordionContent>
//                     Ada beberapa skema beasiswa (prestasi, jalur kemitraan, dll). Pilih perkiraan di simulasi untuk melihat dampaknya. Tim CS akan menilai kelayakan Anda saat konsultasi.
//                   </AccordionContent>
//                 </AccordionItem>
//               </Accordion>
//             </div>
//           </div>
//           <Card className="rounded-2xl h-fit">
//             <CardHeader>
//               <CardTitle>Butuh bantuan sekarang?</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <p className="text-slate-600">Tim kami siap bantu hitungkan opsi terbaik.</p>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
//                   <a href={`https://wa.me/${CS_WHATSAPP}`} target="_blank" rel="noreferrer">Chat WhatsApp</a>
//                 </Button>
//                 <Button variant="outline">Jadwalkan Panggilan</Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t bg-white/50">
//         <div className="mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-3 gap-6 text-sm text-slate-600">
//           <div>
//             <p className="font-semibold">PMB Universitas Pasundan</p>
//             <p className="mt-2">Jl. Setiabudi No.193, Bandung</p>
//           </div>
//           <div>
//             <p className="font-semibold">Tautan</p>
//             <ul className="mt-2 space-y-1 list-disc list-inside">
//               <li><a href="#simulator" className="hover:underline">Simulasi Pembayaran</a></li>
//               <li><a href="#akreditasi" className="hover:underline">Akreditasi</a></li>
//               <li><a href="#faq" className="hover:underline">FAQ</a></li>
//             </ul>
//           </div>
//           <div>
//             <p className="font-semibold">Legal</p>
//             <ul className="mt-2 space-y-1 list-disc list-inside">
//               <li><a href="#" className="hover:underline">Syarat & Ketentuan</a></li>
//               <li><a href="#" className="hover:underline">Kebijakan Privasi</a></li>
//             </ul>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// // ---------- Helper Components ----------
// function SelectField({ label, value, options, onChange }: { label: string; value: any; options: { value: any; label: string }[]; onChange: (v: any)=>void; }) {
//   return (
//     <div className="space-y-2">
//       <Label>{label}</Label>
//       <Select value={String(value)} onValueChange={onChange as any}>
//         <SelectTrigger><SelectValue placeholder={`Pilih ${label.toLowerCase()}`}/></SelectTrigger>
//         <SelectContent>
//           {options.map((o) => (
//             <SelectItem key={String(o.value)} value={String(o.value)}>{o.label}</SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }

// function ToggleOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean)=>void; }) {
//   return (
//     <div className="flex items-center justify-between rounded-xl border p-3">
//       <span>{label}</span>
//       <Switch checked={checked} onCheckedChange={onChange}/>
//     </div>
//   );
// }

// function SummaryTile({ label, value, highlight }: { label: string; value: number; highlight?: "indigo" | "amber" }) {
//   return (
//     <div className={`rounded-2xl border p-4 ${highlight === "indigo" ? "bg-indigo-50 border-indigo-200" : highlight === "amber" ? "bg-amber-50 border-amber-200" : "bg-white"}`}>
//       <p className="text-xs text-slate-500">{label}</p>
//       <p className={`mt-1 font-extrabold text-lg ${highlight === "indigo" ? "text-indigo-700" : highlight === "amber" ? "text-amber-700" : "text-slate-900"}`}>{formatIDR(value)}</p>
//     </div>
//   );
// }

// function AccreditationPanel() {
//   const data = [
//     { faculty: "Fakultas Teknik", programs: [
//       { name: "Teknik Industri", acc: "Unggul" },
//       { name: "Teknik Mesin", acc: "Baik Sekali" },
//       { name: "Teknik Informatika", acc: "Unggul" },
//       { name: "Teknik Lingkungan", acc: "Baik Sekali" },
//       { name: "Teknologi Pangan", acc: "Baik Sekali" },
//       { name: "Perencanaan Wilayah & Kota", acc: "Baik Sekali" },
//     ]},
//     { faculty: "Fakultas Ekonomi & Bisnis", programs: [
//       { name: "Manajemen", acc: "Unggul" },
//       { name: "Akuntansi", acc: "Unggul" },
//       { name: "Ekonomi Pembangunan", acc: "Baik Sekali" },
//     ]},
//     { faculty: "FISIP", programs: [
//       { name: "Ilmu Administrasi Publik", acc: "Unggul" },
//       { name: "Hubungan Internasional", acc: "Baik Sekali" },
//       { name: "Kesejahteraan Sosial", acc: "Unggul" },
//     ]},
//     { faculty: "Fakultas Hukum", programs: [
//       { name: "Ilmu Hukum", acc: "Unggul" },
//     ]},
//     { faculty: "FKIP", programs: [
//       { name: "Pendidikan Bahasa & Sastra Indonesia", acc: "Unggul" },
//       { name: "Pendidikan Matematika", acc: "Baik Sekali" },
//       { name: "Pendidikan Ekonomi", acc: "Unggul" },
//     ]},
//     { faculty: "FISS", programs: [
//       { name: "Sastra Indonesia", acc: "Baik Sekali" },
//       { name: "Sastra Inggris", acc: "Unggul" },
//       { name: "Sastra Jepang", acc: "Baik Sekali" },
//     ]},
//     { faculty: "Fakultas Kedokteran", programs: [
//       { name: "Kedokteran", acc: "Baik Sekali" },
//     ]},
//     { faculty: "Sekolah Pascasarjana", programs: [
//       { name: "Magister Manajemen", acc: "Unggul" },
//       { name: "Magister Ilmu Administrasi", acc: "Baik Sekali" },
//       { name: "Magister Hukum", acc: "Unggul" },
//     ]},
//   ];

//   return (
//     <Card className="rounded-2xl">
//       <CardHeader>
//         <CardTitle>Akreditasi Seluruh Program Studi UNPAS</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6 text-sm text-slate-700">
//         {data.map((f) => (
//           <div key={f.faculty}>
//             <p className="font-semibold text-indigo-700 mb-2">{f.faculty}</p>
//             <ul className="space-y-1">
//               {f.programs.map((p) => (
//                 <li key={p.name} className="flex items-center gap-2">
//                   <CheckCircle className={`h-4 w-4 ${p.acc === 'Unggul' ? 'text-emerald-600' : 'text-amber-500'}`} />
//                   <span>{p.name}</span>
//                   <span className="ml-auto font-medium text-slate-600">{p.acc}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   );
// }
