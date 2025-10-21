import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import "../App.css";

const CS_WHATSAPP = "62811960193";

const FACULTIES_FALLBACK = [
  { id: "FT", name: "Fakultas Teknik", programs: ["Teknik Industri", "Teknik Mesin", "Teknik Informatika", "Teknik Lingkungan", "Teknologi Pangan", "Perencanaan Wilayah & Kota"] },
  { id: "FEB", name: "Fakultas Ekonomi & Bisnis", programs: ["Manajemen", "Akuntansi", "Ekonomi Pembangunan"] },
  { id: "FISIP", name: "FISIP", programs: ["Ilmu Administrasi Publik", "Hubungan Internasional", "Kesejahteraan Sosial"] },
  { id: "FH", name: "Fakultas Hukum", programs: ["Ilmu Hukum"] },
  { id: "FKIP", name: "FKIP", programs: ["Pendidikan Bahasa & Sastra Indonesia", "Pendidikan Matematika", "Pendidikan Ekonomi"] },
  { id: "FISS", name: "FISS", programs: ["Sastra Indonesia", "Sastra Inggris", "Sastra Jepang"] },
  { id: "FK", name: "Fakultas Kedokteran", programs: ["Kedokteran"] },
  { id: "PASCA", name: "Sekolah Pascasarjana", programs: ["Magister Manajemen", "Magister Ilmu Administrasi", "Magister Hukum"] },
];

const JALUR = [
  { id: "reg", name: "Reguler" },
  { id: "kipk", name: "KIP-K (Kuota terbatas)" },
  { id: "trans", name: "Alih Jenjang/Transfer" },
];

const CICILAN = [
  { id: 1, label: "Lunas Sekali Bayar (Diskon)" },
  { id: 6, label: "6x" },
  { id: 12, label: "12x" },
  { id: 24, label: "24x" },
];

const FEE_FALLBACK = {
  "Teknik Informatika": { spp: 8500000, ug: 6000000 },
  "Teknik Industri": { spp: 8000000, ug: 6000000 },
  "Teknik Mesin": { spp: 7800000, ug: 5500000 },
  "Teknik Lingkungan": { spp: 8000000, ug: 5500000 },
  "Teknologi Pangan": { spp: 8200000, ug: 6000000 },
  "Perencanaan Wilayah & Kota": { spp: 8300000, ug: 6000000 },
  "Manajemen": { spp: 7600000, ug: 5500000 },
  "Akuntansi": { spp: 7600000, ug: 5500000 },
  "Ekonomi Pembangunan": { spp: 7000000, ug: 5000000 },
  "Ilmu Administrasi Publik": { spp: 7000000, ug: 5000000 },
  "Hubungan Internasional": { spp: 7800000, ug: 5500000 },
  "Kesejahteraan Sosial": { spp: 6800000, ug: 4500000 },
  "Ilmu Hukum": { spp: 8000000, ug: 6000000 },
  "Pendidikan Bahasa & Sastra Indonesia": { spp: 6200000, ug: 4000000 },
  "Pendidikan Matematika": { spp: 6000000, ug: 3800000 },
  "Pendidikan Ekonomi": { spp: 6000000, ug: 3800000 },
  "Sastra Indonesia": { spp: 6000000, ug: 3800000 },
  "Sastra Inggris": { spp: 6500000, ug: 4200000 },
  "Sastra Jepang": { spp: 6500000, ug: 4200000 },
  "Kedokteran": { spp: 22000000, ug: 35000000 },
  "Magister Manajemen": { spp: 11000000, ug: 8000000 },
  "Magister Ilmu Administrasi": { spp: 10000000, ug: 7000000 },
  "Magister Hukum": { spp: 10000000, ug: 7000000 },
};

export function formatIDR(n) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export function computeFees(base, { path, scholarPct, dp, tenor, includeUniform, includeReg }) {
  const pathAdj = path === "kipk" ? 0.6 : path === "trans" ? 1.1 : 1;
  const _spp = Math.round(base.spp * pathAdj);
  const _ug = Math.round(base.ug * pathAdj);
  const uniform = includeUniform ? 600000 : 0;
  const reg = includeReg ? 300000 : 0;
  const bea = Math.round(_spp * (scholarPct / 100));
  const sppAfterBea = Math.max(0, _spp - bea);
  const ugAfterDp = Math.max(0, _ug + uniform + reg - dp);
  const monthly = tenor === 1 ? 0 : Math.ceil((sppAfterBea * 2) / tenor);
  return { spp: _spp, ug: _ug, uniform, reg, bea, sppAfterBea, ugAfterDp, monthly, firstPay: Math.max(0, dp), totalYear: sppAfterBea * 2 + _ug + uniform + reg };
}

function PaymentSimulatorLandingBootstrap() {
  const [faculty, setFaculty] = useState(FACULTIES_FALLBACK[0].id);
  const [program, setProgram] = useState(FACULTIES_FALLBACK[0].programs[0]);
  const [path, setPath] = useState(JALUR[0].id);
  const [tenor, setTenor] = useState(12);
  const [dp, setDp] = useState(3000000);
  const [scholar, setScholar] = useState(0);
  const [includeUniform, setIncludeUniform] = useState(true);
  const [includeRegFee, setIncludeRegFee] = useState(true);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");

  const programsForFaculty = useMemo(() => FACULTIES_FALLBACK.find(f => f.id === faculty)?.programs ?? [], [faculty]);

  const fees = useMemo(() => {
    const base = FEE_FALLBACK[program] ?? { spp: 7000000, ug: 5000000 };
    return computeFees(base, { path, scholarPct: scholar, dp, tenor, includeUniform, includeReg: includeRegFee });
  }, [program, path, includeUniform, includeRegFee, scholar, dp, tenor]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#eef2ff 0%,#ffffff 50%, #ecfdf5 100%)" }}>
      <header className="sticky-top border-bottom" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)" }}>
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div style={{ width:40, height:40, borderRadius:12, background:"#4f46e5", display:"grid", placeItems:"center", color:"#fff", fontWeight:700 }}>U</div>
            <div>
              <p className="mb-0 small text-muted">Portal Resmi</p>
              <p className="mb-0" style={{ fontWeight:600 }}>PMB Universitas Pasundan</p>
            </div>
          </div>
          <div className="d-none d-md-flex align-items-center gap-2">
            <span className="badge bg-secondary">Terakreditasi</span>
            <button className="btn" style={{ background:"#f59e0b", color:"#fff" }} onClick={() => document.getElementById("simulator")?.scrollIntoView({behavior:"smooth"})}>
              Simulasikan Biaya
            </button>
          </div>
        </div>
      </header>

      <section>
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.5}} style={{ fontSize: "2rem", fontWeight:800, lineHeight:1.1, color:"#0f172a" }}>
                Rancang Cara Bayarmu. <span style={{ color:"#4f46e5" }}>Transparan</span>, <span style={{ color:"#10b981" }}>Fleksibel</span>, <span style={{ color:"#f59e0b" }}>Terjangkau</span>.
              </motion.h1>
              <p className="mt-3 text-muted">Simulasikan sendiri biaya kuliahmu sesuai jurusan dan jalur masuk. Dapatkan estimasi cicilan, uang pangkal, dan total tahun pertama.</p>
              <div className="mt-4 d-flex gap-2">
                <button className="btn" style={{ background:"#f59e0b", color:"#fff" }} onClick={() => document.getElementById("simulator")?.scrollIntoView({behavior:"smooth"})}>Mulai Simulasi</button>
                <button className="btn btn-outline-secondary" onClick={() => document.getElementById("akreditasi")?.scrollIntoView({behavior:"smooth"})}>Lihat Akreditasi</button>
              </div>
              <div className="mt-3 d-flex flex-wrap gap-3 small text-muted">
                <div className="d-flex gap-2 align-items-center"><span style={{ color:"#10b981" }}>✔</span> Transparansi biaya</div>
                <div className="d-flex gap-2 align-items-center"><span style={{ color:"#10b981" }}>✔</span> CS responsif via WhatsApp</div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm rounded-3">
                <div className="card-body">
                  <h5 style={{ fontWeight:700 }}>Quick Look – Estimasimu</h5>
                  <div className="row g-3 mt-3">
                    <div className="col-6">
                      <div className="p-3 rounded-3" style={{ background:"#eef2ff" }}>
                        <div className="small text-muted">Cicilan per bulan</div>
                        <div style={{ fontWeight:800, color:"#4338ca" }}>{formatIDR(fees.monthly)}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-3" style={{ background:"#ecfdf5" }}>
                        <div className="small text-muted">DP (uang muka)</div>
                        <div style={{ fontWeight:800, color:"#059669" }}>{formatIDR(fees.firstPay)}</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="p-3 rounded-3" style={{ background:"#fff7ed" }}>
                        <div className="small text-muted">Perkiraan total tahun pertama</div>
                        <div style={{ fontWeight:800, color:"#b45309" }}>{formatIDR(fees.totalYear)}</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn w-100" style={{ background:"#f59e0b", color:"#fff" }} onClick={() => document.getElementById("simulator")?.scrollIntoView({behavior:"smooth"})}>Atur Simulasi Lengkap</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="simulator" className="py-5">
        <div className="container">
          <div className="card shadow-sm rounded-3">
            <div className="card-body">
              <h4 style={{ fontWeight:700, marginBottom:20 }}>Simulasi Pembayaran</h4>
              <div className="row g-4">
                <div className="col-md-4">
                  <label className="form-label">Fakultas</label>
                  <select className="form-select" value={faculty} onChange={(e)=>{ setFaculty(e.target.value); setProgram(FACULTIES_FALLBACK.find(f=>f.id===e.target.value)?.programs[0]||""); }}>
                    {FACULTIES_FALLBACK.map(f=> <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Program Studi</label>
                  <select className="form-select" value={program} onChange={(e)=>setProgram(e.target.value)}>
                    {(FACULTIES_FALLBACK.find(f=>f.id===faculty)?.programs ?? []).map(p=> <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Jalur</label>
                  <select className="form-select" value={path} onChange={(e)=>setPath(e.target.value)}>
                    {JALUR.map(j=> <option key={j.id} value={j.id}>{j.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="row g-3 mt-3">
                <div className="col-md-6">
                  <div>
                    <label className="form-label">Tenor Cicilan (bulan)</label>
                    <div className="d-flex flex-wrap gap-2">
                      {CICILAN.map(opt=> <button key={opt.id} className={`btn ${tenor===opt.id ? "btn-primary" : "btn-outline-primary"}`} onClick={()=>setTenor(opt.id)}>{opt.label}</button>)}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Beasiswa (persentase SPP)</label>
                  <input type="range" min="0" max="50" step="5" value={scholar} onChange={(e)=>setScholar(parseInt(e.target.value))} className="form-range"/>
                  <div className="small text-muted">{scholar}% dari SPP per semester</div>
                </div>
              </div>

              <div className="row g-3 mt-3">
                <div className="col-md-6">
                  <label className="form-label">Uang Muka (DP)</label>
                  <input type="number" className="form-control" value={dp} onChange={(e)=>setDp(parseInt(e.target.value||"0"))}/>
                  <div className="small text-muted">DP lebih besar → cicilan lebih ringan.</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Biaya Tambahan</label>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-center border rounded-3 p-2">
                      <div>Seragam & atribut</div>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" checked={includeUniform} onChange={(e)=>setIncludeUniform(e.target.checked)}/>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border rounded-3 p-2">
                      <div>Registrasi awal</div>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" checked={includeRegFee} onChange={(e)=>setIncludeRegFee(e.target.checked)}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-3 mt-4">
                <div className="col-md-4">
                  <div className="p-3 border rounded-3">
                    <div className="small text-muted">SPP per semester</div>
                    <div style={{ fontWeight:800 }}>{formatIDR(fees.spp)}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 border rounded-3">
                    <div className="small text-muted">Uang Gedung</div>
                    <div style={{ fontWeight:800 }}>{formatIDR(fees.ug)}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 border rounded-3">
                    <div className="small text-muted">Potongan Beasiswa</div>
                    <div style={{ fontWeight:800 }}>{formatIDR(-fees.bea)}</div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 border rounded-3">
                    <div className="small text-muted">Sisa UG setelah DP</div>
                    <div style={{ fontWeight:800 }}>{formatIDR(fees.ugAfterDp)}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 border rounded-3" style={{ background:"#eef2ff" }}>
                    <div className="small text-muted">Cicilan/bulan</div>
                    <div style={{ fontWeight:800, color:"#4338ca" }}>{formatIDR(fees.monthly)}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 border rounded-3" style={{ background:"#fff7ed" }}>
                    <div className="small text-muted">Total Tahun Pertama (perkiraan)</div>
                    <div style={{ fontWeight:800, color:"#b45309" }}>{formatIDR(fees.totalYear)}</div>
                  </div>
                </div>
              </div>

              <div className="row g-3 mt-3">
                <div className="col-md-4">
                  <button className="btn w-100" style={{ background:"#f59e0b", color:"#fff" }}>Lanjut Daftar Sekarang</button>
                </div>
                <div className="col-md-4">
                  <button className="btn btn-outline-secondary w-100" onClick={()=>document.getElementById("lead")?.scrollIntoView({behavior:"smooth"})}>Konsultasi dengan CS</button>
                </div>
                <div className="col-md-4">
                  <a className="btn btn-light w-100" href="#faq">Lihat FAQ</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section id="akreditasi" className="py-5" style={{ background:"#ffffff" }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            <h3 className="text-center mb-4" style={{ fontWeight:700, color:"#4f46e5" }}>Akreditasi Program Studi</h3>
            <div className="row g-3">
              {[
                { name:"Teknik Industri", acc:"Unggul" },
                { name:"Teknik Mesin", acc:"Baik Sekali" },
                { name:"Teknik Informatika", acc:"Unggul" },
                { name:"Manajemen", acc:"Unggul" },
                { name:"Akuntansi", acc:"Unggul" },
                { name:"Ilmu Hukum", acc:"Unggul" },
              ].map((p, i)=>(
                <div key={i} className="col-md-4">
                  <div className="card shadow-sm rounded-3">
                    <div className="card-body text-center">
                      <div style={{ fontWeight:700, color:"#059669" }}>{p.name}</div>
                      <span className={`badge ${p.acc==="Unggul" ? "bg-success" : "bg-warning text-dark"}`}>Akreditasi {p.acc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="lead" className="py-5">
        <div className="container">
          <div className="card shadow-sm rounded-3">
            <div className="card-body">
              <h4 style={{ fontWeight:700 }}>Simpan Hasil & Konsultasikan via WhatsApp</h4>
              <div className="row g-3 align-items-end">
                <div className="col-md-6">
                  <label className="form-label">Nama lengkap</label>
                  <input className="form-control" value={leadName} onChange={(e)=>setLeadName(e.target.value)} placeholder="contoh: Ferry Mulyanto"/>
                </div>
                <div className="col-md-3">
                  <label className="form-label">No. WhatsApp</label>
                  <input className="form-control" value={leadPhone} onChange={(e)=>setLeadPhone(e.target.value)} placeholder="08xxxxxxxxxx"/>
                </div>
                <div className="col-md-3">
                  <a className="btn w-100" style={{ background:"#059669", color:"#fff" }} href={`https://wa.me/${CS_WHATSAPP}?text=`+encodeURIComponent(`Halo UNPAS, saya ${leadName||"(Nama)"}. Mohon bantuannya untuk simulasi pembayaran prodi ${program}.`)} target="_blank" rel="noreferrer">Chat WhatsApp</a>
                  <div className="small text-muted mt-2">Jam layanan: 08.00–20.00 WIB (Senin–Sabtu)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <h4 style={{ fontWeight:700 }}>Pertanyaan yang sering ditanyakan</h4>
              <div className="accordion" id="faqAcc">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="q1"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#c1" aria-expanded="false" aria-controls="c1">Apakah angka di simulasi pasti sama saat daftar?</button></h2>
                  <div id="c1" className="accordion-collapse collapse" aria-labelledby="q1" data-bs-parent="#faqAcc"><div className="accordion-body">Angka di simulasi adalah estimasi berdasarkan data saat ini. Keputusan akhir mengikuti kebijakan universitas pada saat registrasi.</div></div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="q2"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#c2" aria-expanded="false" aria-controls="c2">Bisakah saya mengubah tenor dan DP?</button></h2>
                  <div id="c2" className="accordion-collapse collapse" aria-labelledby="q2" data-bs-parent="#faqAcc"><div className="accordion-body">Bisa. Atur ulang slider beasiswa, masukkan nominal DP yang diinginkan, lalu pilih tenor yang sesuai. Sistem akan menyesuaikan estimasi cicilan.</div></div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="q3"><button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#c3" aria-expanded="false" aria-controls="c3">Apa itu uang gedung dan kapan dibayar?</button></h2>
                  <div id="c3" className="accordion-collapse collapse" aria-labelledby="q3" data-bs-parent="#faqAcc"><div className="accordion-body">Uang gedung adalah biaya pengembangan sarana/prasarana yang umumnya dibayarkan di tahun pertama. Anda dapat mengurangi beban awal dengan DP.</div></div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card rounded-3 shadow-sm">
                <div className="card-body">
                  <h5>Butuh bantuan sekarang?</h5>
                  <p className="text-muted">Tim kami siap bantu hitungkan opsi terbaik.</p>
                  <div className="d-grid gap-2 d-md-flex">
                    <a className="btn" style={{ background:"#059669", color:"#fff" }} href={`https://wa.me/${CS_WHATSAPP}`} target="_blank" rel="noreferrer">Chat WhatsApp</a>
                    <button className="btn btn-outline-secondary">Jadwalkan Panggilan</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-top py-4" style={{ background:"rgba(255,255,255,0.6)" }}>
        <div className="container">
          <div className="row g-3">
            <div className="col-md-4">
              <p style={{ fontWeight:700 }}>PMB Universitas Pasundan</p>
              <div className="small text-muted">Jl. Setiabudi No.193, Bandung</div>
            </div>
            <div className="col-md-4">
              <p style={{ fontWeight:700 }}>Tautan</p>
              <ul className="list-unstyled small">
                <li><a href="#simulator">Simulasi Pembayaran</a></li>
                <li><a href="#akreditasi">Akreditasi</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <p style={{ fontWeight:700 }}>Legal</p>
              <ul className="list-unstyled small">
                <li><a href="#">Syarat & Ketentuan</a></li>
                <li><a href="#">Kebijakan Privasi</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PaymentSimulatorLandingBootstrap;