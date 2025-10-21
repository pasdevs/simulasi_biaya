
// ================================
// PaymentSimulatorLandingBootstrap.jsx
// Versi: React + Bootstrap 5
// Deskripsi: Halaman simulasi biaya kuliah UNPAS
// dengan tampilan dua kolom, animasi framer-motion,
// dan warna identik versi Tailwind (indigo–emerald)
// ================================

import React, { useState } from "react";
import { motion } from "framer-motion";
import "../App.css";

function PaymentSimulatorLandingBootstrap() {
  // ---------------------------
  // STATE: Data simulasi biaya
  // ---------------------------
  const [fakultas, setFakultas] = useState("");
  const [prodi, setProdi] = useState("");
  const [jenjang, setJenjang] = useState("");
  const [sistem, setSistem] = useState("");
  const [hasil, setHasil] = useState(null);

  // Data fakultas dan prodi
  const dataProdi = {
    "Fakultas Teknik": ["Teknik Industri", "Teknik Mesin", "Teknik Informatika"],
    "Fakultas Hukum": ["Ilmu Hukum"],
    "Fakultas Ekonomi & Bisnis": ["Manajemen", "Akuntansi", "Ekonomi Pembangunan"],
  };

  // ---------------------------
  // FUNGSI: Hitung total biaya
  // ---------------------------
  const hitungBiaya = () => {
    if (!fakultas || !prodi || !jenjang || !sistem) return;

    // Simulasi perhitungan sederhana
    const spp = jenjang === "S2" ? 7000000 : jenjang === "D3" ? 4000000 : 5000000;
    const sks = jenjang === "S2" ? 3000000 : 2000000;
    const lab = fakultas === "Fakultas Teknik" ? 1500000 : 1000000;
    const uangPangkal = sistem === "Cicilan" ? 2000000 : 3000000;

    const total = spp + sks + lab + uangPangkal;

    setHasil({ spp, sks, lab, uangPangkal, total });
  };

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-5"
    >
      {/* HERO SECTION */}
      <motion.div
        className="text-center mb-5 p-4 rounded-4 text-white"
        style={{ backgroundColor: "#4f46e5" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="fw-bold mb-3">
          Simulasi Biaya Kuliah Universitas Pasundan
        </h1>
        <p className="lead mb-0">
          Hitung estimasi biaya kuliah berdasarkan program studi, jenjang, dan sistem pembayaran.
        </p>
      </motion.div>

      {/* FORM + HASIL (2 KOLOM) */}
      <div className="row g-4">
        {/* KIRI: FORM */}
        <motion.div
          className="col-lg-6"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h4 className="mb-4 fw-bold text-indigo" style={{ color: "#4f46e5" }}>
                Form Simulasi Biaya
              </h4>

              {/* Fakultas */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Fakultas</label>
                <select
                  className="form-select"
                  value={fakultas}
                  onChange={(e) => {
                    setFakultas(e.target.value);
                    setProdi("");
                  }}
                >
                  <option value="">-- Pilih Fakultas --</option>
                  {Object.keys(dataProdi).map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Program Studi */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Program Studi</label>
                <select
                  className="form-select"
                  value={prodi}
                  onChange={(e) => setProdi(e.target.value)}
                  disabled={!fakultas}
                >
                  <option value="">-- Pilih Program Studi --</option>
                  {fakultas &&
                    dataProdi[fakultas].map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                </select>
              </div>

              {/* Jenjang */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Jenjang</label>
                <select
                  className="form-select"
                  value={jenjang}
                  onChange={(e) => setJenjang(e.target.value)}
                >
                  <option value="">-- Pilih Jenjang --</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                </select>
              </div>

              {/* Sistem Pembayaran */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Sistem Pembayaran</label>
                <select
                  className="form-select"
                  value={sistem}
                  onChange={(e) => setSistem(e.target.value)}
                >
                  <option value="">-- Pilih Sistem --</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Cicilan">Cicilan</option>
                </select>
              </div>

              <div className="d-grid">
                <button
                  onClick={hitungBiaya}
                  className="btn btn-lg text-white fw-semibold"
                  style={{ backgroundColor: "#10b981" }}
                >
                  Hitung Biaya
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* KANAN: HASIL SIMULASI */}
        <motion.div
          className="col-lg-6"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card shadow border-0 rounded-4">
            <div className="card-header bg-indigo text-white fw-semibold text-center rounded-top-4">
              Hasil Simulasi Biaya
            </div>
            <div className="card-body">
              {hasil ? (
                <>
                  <h5 className="text-center mb-3 text-emerald fw-bold">
                    Total: Rp {hasil.total.toLocaleString("id-ID")}
                  </h5>

                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>SPP</span>
                      <strong>Rp {hasil.spp.toLocaleString("id-ID")}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Biaya SKS</span>
                      <strong>Rp {hasil.sks.toLocaleString("id-ID")}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Biaya Lab</span>
                      <strong>Rp {hasil.lab.toLocaleString("id-ID")}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Uang Pangkal</span>
                      <strong>Rp {hasil.uangPangkal.toLocaleString("id-ID")}</strong>
                    </li>
                  </ul>
                </>
              ) : (
                <p className="text-muted text-center">
                  Silakan isi form untuk melihat hasil simulasi.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* PANEL AKREDITASI */}
      <div className="container mt-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center mb-4 fw-bold text-indigo">
            Akreditasi Program Studi
          </h2>

          <div className="row g-3">
            {[
              { prodi: "Teknik Informatika", akreditasi: "A" },
              { prodi: "Manajemen", akreditasi: "A" },
              { prodi: "Akuntansi", akreditasi: "B" },
              { prodi: "Hukum", akreditasi: "A" },
              { prodi: "Ilmu Komunikasi", akreditasi: "A" },
              { prodi: "Teknik Sipil", akreditasi: "B" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="col-md-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="card shadow-sm border-0 rounded-4">
                  <div className="card-body text-center">
                    <h5 className="fw-bold text-emerald">{item.prodi}</h5>
                    <span
                      className={`badge ${
                        item.akreditasi === "A"
                          ? "bg-emerald"
                          : "bg-indigo text-white"
                      }`}
                    >
                      Akreditasi {item.akreditasi}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default PaymentSimulatorLandingBootstrap;
