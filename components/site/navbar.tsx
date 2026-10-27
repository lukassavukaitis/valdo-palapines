"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const services = [
  // Kategorijų atskirų puslapių nėra — visos veda į katalogą pagrindiniame puslapyje
  { label: "Palapinės ir paviljonai", href: "/#katalogas" },
  { label: "Baldai", href: "/#katalogas" },
  { label: "Tekstilė ir dekoras", href: "/#katalogas" },
  { label: "Apšvietimas ir šildytuvai", href: "/#katalogas" },
];

const nav = [
  { label: "Galerija", href: "/#galerija" },
  { label: "D.U.K.", href: "/#duk" },
  { label: "Straipsniai", href: "/straipsniai" },
  { label: "Kontaktai", href: "/#uzklausa" },
];

export function Navbar() {
  const [open, setOpen] = useState(false); // mobilus meniu
  const [servicesOpen, setServicesOpen] = useState(false); // desktop dropdown
  const [scrolled, setScrolled] = useState(false);

  // Glass tampa ryškesnis paslinkus žemyn
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Užrakinam scroll kai atidarytas mobilus meniu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow ${
        scrolled ? "glass shadow-sm" : "bg-ivory/40 backdrop-blur-sm"
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6"
        aria-label="Pagrindinė navigacija"
      >
        <Link href="/" className="font-display text-2xl font-semibold text-ink">
          Valdo<span className="text-forest">palapines</span>
        </Link>

        {/* Desktop nuorodos */}
        <div className="hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm text-ink/80 hover:text-forest"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Paslaugos
              <ChevronDown
                size={15}
                className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full w-64 rounded-xl2 border border-ink/5 bg-ivory p-2 shadow-lg">
                {services.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    className="block rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-sand hover:text-forest"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-full px-4 py-2 text-sm text-ink/80 hover:text-forest"
            >
              {n.label}
            </Link>
          ))}

          <Link href="/#uzklausa" className="btn-primary ml-2">
            Gauti pasiūlymą
          </Link>
        </div>

        {/* Mobilus perjungiklis */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-ink lg:hidden"
          aria-label={open ? "Uždaryti meniu" : "Atidaryti meniu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobilus meniu */}
      {open && (
        <div className="fixed inset-x-0 top-16 z-40 h-[calc(100dvh-4rem)] overflow-y-auto bg-ivory px-4 pb-10 pt-2 lg:hidden">
          <p className="px-2 pb-1 pt-3 text-xs uppercase tracking-wide text-stone">
            Paslaugos
          </p>
          {services.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-3 text-base text-ink/90"
            >
              {s.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-ink/5" />
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-3 text-base text-ink/90"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/#uzklausa"
            onClick={() => setOpen(false)}
            className="btn-primary mt-4 w-full"
          >
            Gauti pasiūlymą
          </Link>
        </div>
      )}
    </header>
  );
}
