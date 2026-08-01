import { useRef, useState } from "react";

export default function AddLayerMenu({ onAddFiles, onAddText, onOpenPresets }) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);

  const choose = (action) => () => {
    setOpen(false);
    action();
  };

  const items = [
    { label: "Image layer", icon: "▧", iconClass: "rounded-sm border border-current text-[10px]", onClick: choose(() => fileInputRef.current?.click()) },
    { label: "Text layer", icon: "T", iconClass: "rounded-sm border border-current text-xs font-semibold", onClick: choose(onAddText) },
    { label: "OpenMoji", icon: "🙂", iconClass: "text-base", onClick: choose(onOpenPresets) },
  ];

  return (
    <nav className="relative flex h-16 shrink-0 flex-row items-center justify-center gap-2 border-b border-[#dfe2e7] bg-[#ffffff] px-3 md:h-auto md:w-16 md:flex-col md:justify-start md:border-r md:border-b-0 md:px-0 md:py-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          onAddFiles(Array.from(e.target.files || []));
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Add a layer"
        className={`flex w-20 flex-col items-center gap-1 rounded-lg py-2 transition-colors md:w-12 ${
          open ? "bg-[#0d8163] text-white" : "bg-[#0d8163]/15 text-[#0d8163] hover:bg-[#0d8163]/25"
        }`}
      >
        <span className="flex h-5 w-5 items-center justify-center text-2xl font-light leading-none">+</span>
        <span className="text-[10px] font-semibold">
          <span className="md:hidden">Add layer</span>
          <span className="hidden md:inline">Add</span>
        </span>
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Choose layer type"
          className="absolute left-1/2 top-full z-30 mt-2 flex w-44 -translate-x-1/2 flex-col gap-1 rounded-xl border border-[#dfe2e7] bg-white p-2 shadow-[0_12px_30px_rgba(0,0,0,0.18)] md:left-full md:top-2 md:mt-0 md:ml-2 md:translate-x-0"
        >
          <p className="px-2 pb-1 pt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#63666f]">Add layer</p>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={item.onClick}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[#3f4147] hover:bg-[#eef0f3]"
            >
              <div className={`flex h-5 w-5 items-center justify-center ${item.iconClass}`}>{item.icon}</div>
              <span className="text-[12px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
