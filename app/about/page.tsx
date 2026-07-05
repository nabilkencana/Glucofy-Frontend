"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Target,
  Sparkles,
  Users,
  Leaf,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBlur from "../components/PageBlur";

// Instagram Icon Component
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// LinkedIn Icon – modern filled brand style
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ─── Team Data (Updated from PDF) ──────────────────────────────────────────

const team = [
  {
    name: "Siana Norma Heny",
    role: "Guru Pembimbing",
    bio: "Membimbing pengembangan Glucofy dalam aspek inovasi, riset, dan kewirausahaan.",
    instagram: "https://www.instagram.com/snh_ae/",
    linkedin: "https://www.linkedin.com/in/agnetha-shiella-p-firmansyah-13a496419/",
    initials: "SN",
    color: "from-amber-400 to-orange-600",
  },
  {
    name: "Agnetha Shiella Putri Firmansyah",
    role: "Co-Founder",
    bio: "Berfokus pada strategi produk, pengembangan bisnis, serta arah inovasi Glucofy.",
    instagram: "https://www.instagram.com/keitsku/",
    linkedin: "https://www.linkedin.com/in/agnetha-shiella-p-firmansyah-13a496419/",
    initials: "AS",
    color: "from-purple-400 to-pink-600",
  },
  {
    name: "Khoirunnisa' Azzahro",
    role: "Co-Founder",
    bio: "Mengembangkan konsep, riset pengguna, teknologi, dan keberlanjutan Glucofy.",
    instagram: "https://www.instagram.com/tamagoonigirii/",
    linkedin: "https://www.linkedin.com/in/agnetha-shiella-p-firmansyah-13a496419/",
    initials: "KA",
    color: "from-blue-400 to-indigo-600",
  },
  {
    name: "Iqbal Rizqi Ramadhan",
    role: "AI Engineer & Back-end Developer",
    bio: "Mengembangkan sistem AI dan infrastruktur backend untuk menghadirkan pengalaman yang cerdas dan andal.",
    instagram: "https://www.instagram.com/theminesence/",
    linkedin: "https://www.linkedin.com/in/agnetha-shiella-p-firmansyah-13a496419/",
    initials: "IR",
    color: "from-cyan-400 to-blue-600",
  },
  {
    name: "Akira Saskara Hartono",
    role: "AI Engineer & Back-end Developer",
    bio: "Berfokus pada pengembangan model AI, integrasi sistem, dan optimasi performa platform.",
    instagram: "https://www.instagram.com/_akiraass_/",
    linkedin: "https://www.linkedin.com/in/agnetha-shiella-p-firmansyah-13a496419/",
    initials: "AH",
    color: "from-teal-400 to-emerald-600",
  },
  {
    name: "Muhammad Haikal Arrasyid",
    role: "Videographer & Front-end Developer",
    bio: "Menggabungkan kreativitas visual dan pengembangan antarmuka untuk memperkuat identitas Glucofy.",
    instagram: "https://www.instagram.com/namakuhaikall/",
    linkedin: "https://www.linkedin.com/in/agnetha-shiella-p-firmansyah-13a496419/",
    image: "/profile picture/haikal.webp",
    imageScale: 1.2,
    initials: "MH",
    color: "from-lime-400 to-green-600",
  },
  {
    name: "Mohammad Maulana Alfara Salim",
    role: "Front-end Developer",
    bio: "Membangun antarmuka web yang responsif, intuitif, dan nyaman digunakan.",
    instagram: "https://www.instagram.com/azuranyxa/",
    linkedin: "https://www.linkedin.com/in/agnetha-shiella-p-firmansyah-13a496419/",
    initials: "MM",
    color: "from-green-400 to-teal-600",
  },
  {
    name: "Mohammad Nabil Anwar Kencana",
    role: "Front-end Developer",
    bio: "Mengembangkan pengalaman pengguna yang modern dan interaktif melalui implementasi antarmuka digital.",
    instagram: "https://www.instagram.com/nabill.anwr/",
    linkedin: "https://www.linkedin.com/in/agnetha-shiella-p-firmansyah-13a496419/",
    image: "/profile picture/nabil.webp",
    imagePosition: "object-[center_60%]",
    initials: "MN",
    color: "from-emerald-400 to-green-600",
  },
  {
    name: "Mahija Abyudaya",
    role: "Graphic Designer",
    bio: "Menciptakan identitas visual, desain grafis, dan aset kreatif yang mendukung pengalaman pengguna Glucofy.",
    instagram: "https://www.instagram.com/abyonkk/",
    linkedin: "https://www.linkedin.com/in/agnetha-shiella-p-firmansyah-13a496419/",
    image: "/team/mahija.jpg",
    initials: "MA",
    color: "from-rose-400 to-pink-600",
  },
];

// ─── Values ──────────────────────────────────────────────────────────────────

const values = [
  {
    icon: Heart,
    title: "Peduli Kesehatan",
    description:
      "Kami percaya setiap orang berhak mendapatkan akses mudah terhadap informasi gizi yang jujur dan transparan.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: Leaf,
    title: "Ramah & Alami",
    description:
      "Glucofy hadir dengan pendekatan yang hangat — tanpa menghakimi, hanya mendampingi perjalanan hidupmu.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: ShieldCheck,
    title: "Akurasi & Kepercayaan",
    description:
      "Data yang kami sajikan berbasis ilmiah dan divalidasi oleh para ahli gizi dan teknologi kesehatan.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: TrendingUp,
    title: "Inovasi Berkelanjutan",
    description:
      "Kami terus belajar dan berkembang bersama komunitas pengguna untuk menghadirkan fitur yang benar-benar bermanfaat.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PageBlur />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        {/* Background ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-green-500/8 blur-[140px]" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-emerald-400/6 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-teal-300/6 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-28">

          {/* Hero / Mission */}
          <section>
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-xs font-semibold text-green-700 mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tentang Kami</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                Dibuat dengan{" "}
                <span className="text-glucofy-gradient">semangat</span>{" "}
                untuk hidupmu yang lebih sehat
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed font-light">
                Glucofy lahir dari satu pertanyaan sederhana:{" "}
                <em>seberapa banyak gula yang kita konsumsi tanpa kita sadari?</em>{" "}
                Kami adalah tim muda yang percaya teknologi bisa menjadi teman terbaik dalam perjalanan hidup sehat.
              </p>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-5"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
            >
              {[
                { value: "17k+", label: "Pengguna Aktif" },
                { value: "31%", label: "Rata-rata penurunan konsumsi gula" },
                { value: "50k+", label: "Produk terdaftar" },
                { value: "9", label: "Anggota Tim" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-liquid-glass rounded-[24px] border border-white/40 shadow-soft p-6 text-center"
                >
                  <p className="text-3xl font-extrabold text-glucofy-gradient mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </section>

          {/* Mission & Vision */}
          <section>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Target,
                  label: "Misi Kami",
                  color: "text-green-600",
                  bg: "bg-green-50",
                  title: "Memberdayakan pilihan sehat",
                  desc: "Kami hadir untuk membantu masyarakat Indonesia membuat pilihan konsumsi yang lebih cerdas — dengan teknologi AI yang mudah diakses, kapan saja dan di mana saja.",
                },
                {
                  icon: Sparkles,
                  label: "Visi Kami",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                  title: "Indonesia bebas diabetes",
                  desc: "Kami bermimpi menjadi platform kesehatan terdepan yang secara nyata berkontribusi menurunkan angka diabetes dan penyakit metabolik di Indonesia.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="bg-liquid-glass rounded-[32px] border border-white/40 shadow-soft p-8 md:p-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                >
                  <div className={"inline-flex w-12 h-12 rounded-2xl " + item.bg + " items-center justify-center mb-6"}>
                    <item.icon className={"w-6 h-6 " + item.color} />
                  </div>
                  <span className={"text-xs font-bold uppercase tracking-widest " + item.color + " mb-2 block"}>
                    {item.label}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h2>
                  <p className="text-slate-600 leading-relaxed font-light">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Values */}
          <section>
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-green-600 mb-3 block">
                Nilai-nilai Kami
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Yang mendorong kami setiap hari
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  className="bg-liquid-glass rounded-[24px] border border-white/40 shadow-soft p-7 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i * 0.5}
                >
                  <div className={"w-11 h-11 rounded-2xl " + v.bg + " flex items-center justify-center"}>
                    <v.icon className={"w-5 h-5 " + v.color} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1.5">{v.title}</h3>
                    <p className="text-sm text-slate-500 font-light leading-relaxed">{v.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section>
            <motion.div
              className="text-center mb-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-xs font-semibold text-green-700 mb-4 shadow-sm">
                <Users className="w-3.5 h-3.5" />
                <span>The People Behind Glucofy</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                Tim yang membangun Glucofy
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
                Kami adalah tim lintas disiplin yang bersatu karena satu tujuan — membuat Indonesia lebih sehat, satu scan gula dalam satu waktu.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  className="group bg-liquid-glass rounded-[28px] border border-white/40 shadow-soft p-6 flex flex-col items-center text-center gap-5 hover:-translate-y-1.5 transition-all duration-300"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  custom={i * 0.3}
                >
                  {/* Photo — shows image if available, else gradient initials */}
                  <div
                    className={"w-full aspect-[6/7] rounded-2xl overflow-hidden shadow-lg relative bg-gradient-to-br " + member.color}
                  >
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className={"object-cover " + (member.imagePosition ?? "object-top")}
                        style={member.imageScale ? { transform: `scale(${member.imageScale})`, transformOrigin: "center" } : undefined}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                        {member.initials}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-xl text-slate-900 leading-tight">{member.name}</h3>

                  {/* Role */}
                  <p className="text-sm text-green-600 font-semibold">{member.role}</p>

                  {/* Bio */}
                  <p className="text-sm text-slate-500 font-light leading-relaxed">{member.bio}</p>

                  {/* Social Links */}
                  <div className="flex items-center gap-3 mt-auto pt-2">
                    <Link
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white hover:shadow-lg hover:scale-110 transition-all duration-200 group/ig"
                    >
                      <InstagramIcon className="w-5 h-5 group-hover/ig:scale-110 transition-transform" />
                    </Link>
                    {member.linkedin && (
                      <Link
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0077B5] text-white hover:shadow-lg hover:scale-110 transition-all duration-200 group/li"
                      >
                        <LinkedInIcon className="w-5 h-5 group-hover/li:scale-110 transition-transform" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section>
            <motion.div
              className="relative bg-glucofy-gradient rounded-[40px] overflow-hidden p-10 md:p-16 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-[60px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-[50px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">
                  Mulai Sekarang
                </p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                  Bergabunglah dan kendalikan asupan gulamu
                </h2>
                <p className="text-white/80 text-base font-light mb-8 leading-relaxed">
                  Lebih dari 17.000 pengguna sudah merasakan manfaatnya. Giliran kamu untuk hidup lebih sehat bersama Glucofy.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-green-700 font-bold text-sm hover:bg-green-50 hover:shadow-lg transition-all duration-200"
                >
                  Coba Glucofy Gratis
                </Link>
              </div>
            </motion.div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}