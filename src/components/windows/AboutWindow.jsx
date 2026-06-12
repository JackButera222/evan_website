import Window from "../Window";
import tripodVawnLogo from "../../assets/TRIPOD VAWN LOGO V3.png";

const SPECS = [
  ["Operator", "Evan — videographer & photographer"],
  ["Processor", "Dual-eye 24fps Cinematic Engine"],
  ["Memory", "Thousands of frames, zero forgettable ones"],
  ["Graphics", "Music videos, short-form content, portraits"],
  ["Serial Number", "NYC-AVAILABLE-TO-TRAVEL"],
];

function AboutWindow({ windowProps, onBook }) {
  return (
    <Window title="" {...windowProps}>
      <div className="flex min-h-0 flex-1 flex-col items-center gap-4 overflow-auto bg-gradient-to-b from-[#fafafa] to-[#ececec] px-7 py-7 text-center text-zinc-800">
        <img
          src={tripodVawnLogo}
          alt="Tripod Vawn"
          className="h-24 w-24 object-contain mix-blend-multiply drop-shadow-sm"
        />
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Tripod Vawn</h1>
          <p className="mt-0.5 text-[13px] text-zinc-500">
            OS X Snap Leopard &nbsp;Version 10.0 (Build EVN2026)
          </p>
        </div>

        <dl className="w-full max-w-sm space-y-1.5 text-left text-[13px]">
          {SPECS.map(([key, value]) => (
            <div key={key} className="grid grid-cols-[110px_1fr] gap-2">
              <dt className="text-right font-bold text-zinc-600">{key}</dt>
              <dd className="text-zinc-700">{value}</dd>
            </div>
          ))}
        </dl>

        <button type="button" className="aqua-button mt-1" onClick={onBook}>
          Book a Shoot…
        </button>

        <p className="text-[11px] text-zinc-400">
          TM and © Tripod Vawn. All frames reserved.
        </p>
      </div>
    </Window>
  );
}

export default AboutWindow;
