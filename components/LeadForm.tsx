"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState<string>("");
  const [issues, setIssues] = useState<Record<string, string[]>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrMsg("");
    setIssues({});

    const fd = new FormData(e.currentTarget);
    const payload = {
      nome: String(fd.get("nome") || ""),
      email: String(fd.get("email") || ""),
      empresa: String(fd.get("empresa") || ""),
      cargo: String(fd.get("cargo") || ""),
      dor: String(fd.get("dor") || ""),
      url_site: String(fd.get("url_site") || ""),
      _hp: String(fd.get("_hp") || ""),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setErrMsg(data.error || "Falha desconhecida");
        if (data.issues) setIssues(data.issues);
        return;
      }
      setStatus("success");
      track("lead_form_submit_success", { leadId: data.leadId });
    } catch (err) {
      setStatus("error");
      setErrMsg(err instanceof Error ? err.message : "Erro de rede");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-hzn-brand-400 bg-hzn-bg-base p-8 text-center">
        <CheckCircle2
          size={48}
          className="mx-auto text-hzn-brand-400"
          aria-hidden
        />
        <h3 className="mt-4 text-xl font-bold">Recebi seu pedido.</h3>
        <p className="mt-2 text-sm text-hzn-text-secondary">
          Vou revisar pessoalmente nas próximas horas e responder direto pro seu email.
          Se for urgente, agenda um diagnóstico no link da call.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-hzn-border-default bg-hzn-bg-base p-6 md:p-8 space-y-4"
      noValidate
      aria-label="Formulário de auditoria-isca"
    >
      <h3 className="text-xl font-bold">Quero a auditoria</h3>

      <Field
        label="Nome *"
        name="nome"
        type="text"
        autoComplete="name"
        required
        issue={issues.nome?.[0]}
      />
      <Field
        label="Email *"
        name="email"
        type="email"
        autoComplete="email"
        required
        issue={issues.email?.[0]}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Empresa *"
          name="empresa"
          type="text"
          autoComplete="organization"
          required
          issue={issues.empresa?.[0]}
        />
        <Field
          label="Cargo *"
          name="cargo"
          type="text"
          autoComplete="organization-title"
          required
          issue={issues.cargo?.[0]}
        />
      </div>
      <Field
        label="URL do produto/site (opcional)"
        name="url_site"
        type="url"
        autoComplete="url"
        placeholder="https://"
        issue={issues.url_site?.[0]}
      />

      <label className="block">
        <span className="text-sm font-medium text-hzn-text-primary">
          Descreva sua dor * <span className="text-hzn-text-muted font-normal">(min 80 caracteres)</span>
        </span>
        <textarea
          name="dor"
          rows={4}
          required
          minLength={80}
          className="mt-1 w-full rounded-lg border border-hzn-border-default bg-hzn-bg-raised px-3 py-2 text-sm text-hzn-text-primary placeholder:text-hzn-text-muted focus:border-hzn-brand-400 focus:outline-none focus:ring-2 focus:ring-hzn-brand-400/30"
          placeholder="Ex.: Nosso CAC subiu 40% no Q1 e o time de SDR não escala. Tentei contratar dois mas churnaram em 3 meses..."
        />
        {issues.dor?.[0] && (
          <span className="mt-1 block text-xs text-red-400">{issues.dor[0]}</span>
        )}
      </label>

      {/* Honeypot — hidden to humans, bots fill it */}
      <input
        type="text"
        name="_hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] opacity-0 pointer-events-none"
      />

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
          <AlertCircle size={18} aria-hidden className="shrink-0 mt-0.5" />
          <span>{errMsg || "Algo deu errado. Tenta de novo em alguns segundos."}</span>
        </div>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full">
        {status === "submitting" ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden /> Enviando…
          </>
        ) : (
          <>Quero o relatório acionável</>
        )}
      </button>

      <p className="text-xs text-hzn-text-muted">
        Não enviamos newsletter. Resposta em até 24h.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
  placeholder,
  issue,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  issue?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-hzn-text-primary">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-hzn-border-default bg-hzn-bg-raised px-3 py-2 text-sm text-hzn-text-primary placeholder:text-hzn-text-muted focus:border-hzn-brand-400 focus:outline-none focus:ring-2 focus:ring-hzn-brand-400/30"
      />
      {issue && <span className="mt-1 block text-xs text-red-400">{issue}</span>}
    </label>
  );
}
