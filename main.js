// Fills the page from config.js (prices, links) and downloads/firmware/latest.js (release info).
(function () {
  const cfg = window.ZAKU_CONFIG || {};
  const fw = window.ZAKU_LATEST || null;
  const $$ = (sel) => document.querySelectorAll(sel);
  const setText = (sel, text) => $$(sel).forEach((el) => { el.textContent = text; });

  // ---- firmware release
  if (fw) {
    $$(".js-fw-download").forEach((a) => {
      a.href = fw.file;
      a.setAttribute("download", "");
    });
    setText(".js-fw-meta", `Latest: ${fw.version} · ${fw.size_mb} MB · released ${fw.date}`);
    setText(".js-fw-file", `${fw.version} · ${fw.size_mb} MB`);
    setText(".js-fw-sha", fw.sha256);
    setText(".js-fw-version", fw.version);
    const notes = document.querySelector(".js-fw-notes");
    (fw.notes || []).forEach((n) => {
      const li = document.createElement("li");
      li.textContent = n;
      notes.appendChild(li);
    });
  } else {
    setText(".js-fw-meta", "Firmware download coming soon.");
  }

  $$(".js-copy-sha").forEach((btn) => btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(fw ? fw.sha256 : "");
      btn.textContent = "Copied";
    } catch (e) {
      btn.textContent = "Select & copy";
    }
    setTimeout(() => { btn.textContent = "Copy"; }, 1500);
  }));

  // ---- paid tool
  const buy = document.querySelector(".js-tool-buy");
  if (cfg.toolBuyUrl) {
    buy.href = cfg.toolBuyUrl;
    buy.removeAttribute("aria-disabled");
    buy.textContent = cfg.toolPrice ? `Buy for ${cfg.toolPrice}` : "Buy the tool";
    buy.rel = "noopener";
  } else {
    buy.addEventListener("click", (e) => e.preventDefault());
  }
  setText(".js-tool-price", cfg.toolPrice || "Coming soon");

  // ---- footer links
  const links = [
    ["toolSourceUrl", "Tool source"],
    ["firmwareSourceUrl", "Firmware source"],
  ].filter(([k]) => cfg[k]);
  const src = document.querySelector(".js-source-links");
  links.forEach(([k, label], i) => {
    const a = document.createElement("a");
    a.href = cfg[k];
    a.textContent = label;
    a.rel = "noopener";
    src.append(i ? " · " : " ", a);
  });

  const socials = [
    ["discordUrl", "Discord"], ["youtubeUrl", "YouTube"], ["xUrl", "X"],
    ["tiktokUrl", "TikTok"], ["instagramUrl", "Instagram"],
  ];
  const box = document.querySelector(".js-socials");
  socials.filter(([k]) => cfg[k]).forEach(([k, label]) => {
    const a = document.createElement("a");
    a.href = cfg[k];
    a.textContent = label;
    a.rel = "noopener";
    box.appendChild(a);
  });
  if (cfg.contactEmail) {
    const a = document.createElement("a");
    a.href = `mailto:${cfg.contactEmail}`;
    a.textContent = "Contact";
    box.appendChild(a);
  }
})();
