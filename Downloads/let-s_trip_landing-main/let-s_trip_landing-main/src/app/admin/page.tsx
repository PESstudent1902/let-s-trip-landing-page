"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  verifyAdminPassword,
  isAdminAuthenticated,
  logoutAdmin,
  AVAILABLE_IMAGES,
  PACKAGE_SECTIONS,
  slugifyDestinationName,
  type Destination,
  type Package,
} from "@/lib/packageStore";
import {
  fetchDestinations,
  fetchPackages,
  saveDestination,
  updateDestination,
  deleteDestinationAction,
  savePackage,
  updatePackage,
  deletePackageAction,
} from "@/app/actions";
import { LogOut, Plus, Pencil, Trash2, X, MapPin, Briefcase, Lock, Eye, EyeOff, Check, AlertTriangle } from "lucide-react";

type Tab = "destinations" | "packages";
type ModalMode = "add" | "edit";

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl animate-[slideDown_0.3s_ease] ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
      {message}
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await verifyAdminPassword(password);
    if (ok) onLogin();
    else setError("Incorrect password. Please try again.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #050B1F 0%, #0A1628 50%, #0D1515 100%)" }}>
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-headline)" }}>
            <span className="text-cyan-400">Lets</span>Trip Admin
          </h1>
          <p className="text-gray-400 text-sm">Enter your password to continue</p>
        </div>

        <div className="relative mb-4">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all"
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4 flex items-center gap-2"><AlertTriangle size={14} />{error}</p>}

        <button type="submit" disabled={loading || !password} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Verifying..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm p-6 rounded-2xl bg-[#192122] border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-500/10"><AlertTriangle size={20} className="text-red-400" /></div>
          <h3 className="text-white font-bold">Are you sure?</h3>
        </div>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/10 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

function DestinationModal({ mode, initial, onSave, onClose }: { mode: ModalMode; initial?: Destination; onSave: (d: Omit<Destination, "id">) => void; onClose: () => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [image, setImage] = useState(initial?.image || AVAILABLE_IMAGES[0].value);
  const [duration, setDuration] = useState(initial?.duration || "");
  const [price, setPrice] = useState(initial?.price || "");
  const [tags, setTags] = useState(initial?.tags.join(", ") || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [bestTimeToVisit, setBestTimeToVisit] = useState(initial?.bestTimeToVisit || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, image, duration, price, tags: tags.split(",").map((t) => t.trim()).filter(Boolean), description, bestTimeToVisit });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 rounded-2xl bg-[#192122] border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg">{mode === "add" ? "➕ Add Destination" : "✏️ Edit Destination"}</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <Field label="Destination Name" value={name} onChange={setName} placeholder="e.g. Thailand" required />
          <ImageField label="Image" value={image} onChange={setImage} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duration" value={duration} onChange={setDuration} placeholder="e.g. 7N" required />
            <Field label="Price" value={price} onChange={setPrice} placeholder="e.g. ₹62,000" required />
          </div>
          <Field label="Tags (comma-separated)" value={tags} onChange={setTags} placeholder="e.g. Adventure, Culture" />
          <Field label="Best Time to Visit" value={bestTimeToVisit} onChange={setBestTimeToVisit} placeholder="e.g. Nov - Feb" />
          <Field label="Description" value={description} onChange={setDescription} placeholder="Short description..." required />
        </div>

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/10 transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold hover:opacity-90 transition-opacity">
            {mode === "add" ? "Add Destination" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Package Form Modal ───
function PackageModal({ mode, initial, destinations, onSave, onClose }: { mode: ModalMode; initial?: Package; destinations: Destination[]; onSave: (p: Omit<Package, "id">) => void; onClose: () => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [image, setImage] = useState(initial?.image || AVAILABLE_IMAGES[0].value);
  const [price, setPrice] = useState(initial?.price || "");
  const [highlights, setHighlights] = useState(initial?.highlights.join(", ") || "");
  const [destinationId, setDestinationId] = useState(initial?.destinationId || destinations[0]?.id || "");
  const [durationNights, setDurationNights] = useState<string>(typeof initial?.durationNights === "number" ? String(initial.durationNights) : "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") || "");
  const [selectedSections, setSelectedSections] = useState<string[]>(initial?.sections || []);
  const [itinerary, setItinerary] = useState<Package["itinerary"]>(
    initial?.itinerary?.length
      ? initial.itinerary
      : [
          { day: 1, title: "Arrival & Check-in", details: ["Pickup", "Hotel check-in", "Leisure time"] },
          { day: 2, title: "Sightseeing", details: ["Guided tour", "Optional activities"] },
        ]
  );

  const addDay = () => {
    setItinerary([...(itinerary || []), { day: (itinerary?.length || 0) + 1, title: "", details: [""] }]);
  };

  const removeDay = (index: number) => {
    const newItinerary = [...(itinerary || [])];
    newItinerary.splice(index, 1);
    newItinerary.forEach((day, i) => (day.day = i + 1));
    setItinerary(newItinerary);
  };

  const updateDayTitle = (index: number, title: string) => {
    const newItinerary = [...(itinerary || [])];
    newItinerary[index].title = title;
    setItinerary(newItinerary);
  };

  const updateDayDetail = (dayIndex: number, detailIndex: number, text: string) => {
    const newItinerary = [...(itinerary || [])];
    newItinerary[dayIndex].details[detailIndex] = text;
    setItinerary(newItinerary);
  };

  const addDetail = (dayIndex: number) => {
    const newItinerary = [...(itinerary || [])];
    newItinerary[dayIndex].details.push("");
    setItinerary(newItinerary);
  };

  const removeDetail = (dayIndex: number, detailIndex: number) => {
    const newItinerary = [...(itinerary || [])];
    newItinerary[dayIndex].details.splice(detailIndex, 1);
    setItinerary(newItinerary);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nights =
      durationNights.trim() === ""
        ? undefined
        : Number.isFinite(Number(durationNights))
          ? Number(durationNights)
          : undefined;

    onSave({
      name,
      image,
      price,
      highlights: highlights.split(",").map((h) => h.trim()).filter(Boolean),
      destinationId,
      durationNights: nights,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      sections: selectedSections,
      itinerary,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto py-6">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl p-5 sm:p-6 rounded-2xl bg-[#192122] border border-white/10 my-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg">{mode === "add" ? "➕ Add Package" : "✏️ Edit Package"}</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <Field label="Package Name" value={name} onChange={setName} placeholder="e.g. 5N Dubai" required />
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1.5">Destination</label>
            <select value={destinationId} onChange={(e) => setDestinationId(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 transition-all appearance-none" required>
              {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nights (optional)" value={durationNights} onChange={setDurationNights} placeholder="e.g. 5" />
            <Field label="Tags (optional, comma-separated)" value={tags} onChange={setTags} placeholder="e.g. Family, Luxury" />
          </div>

          {/* Section Assignment */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Website Sections</label>
            <p className="text-[11px] text-gray-500 mb-3">Select which sections this package appears in. A package can appear in multiple sections.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PACKAGE_SECTIONS.map((section) => (
                <label key={section.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedSections.includes(section.id) ? "bg-cyan-500/10 border-cyan-400/30" : "bg-white/5 border-white/10 hover:border-white/20"}`}>
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSections([...selectedSections, section.id]);
                      } else {
                        setSelectedSections(selectedSections.filter((s) => s !== section.id));
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedSections.includes(section.id) ? "bg-cyan-500 border-cyan-500" : "border-white/20"}`}>
                    {selectedSections.includes(section.id) && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-sm">{section.icon} {section.label}</span>
                </label>
              ))}
            </div>
          </div>

          <ImageField label="Image" value={image} onChange={setImage} />
          
          <Field label="Price" value={price} onChange={setPrice} placeholder="e.g. ₹81,500" required />
          <Field label="Highlights (comma-separated)" value={highlights} onChange={setHighlights} placeholder="e.g. 5-Star Hotel, Return Flights" required />
          
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold">Itinerary</label>
              <button type="button" onClick={addDay} className="flex items-center gap-1 text-[11px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded hover:bg-cyan-500/30 transition-colors">
                <Plus size={12} /> Add Day
              </button>
            </div>
            
            <div className="space-y-4">
              {itinerary?.map((day, dIdx) => (
                <div key={dIdx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded">Day {day.day}</span>
                    <input 
                      type="text" 
                      value={day.title} 
                      onChange={(e) => updateDayTitle(dIdx, e.target.value)} 
                      placeholder="Day Title (e.g. Arrival in Dubai)" 
                      className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-gray-600 font-semibold"
                      required
                    />
                    <button type="button" onClick={() => removeDay(dIdx)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                  </div>
                  
                  <div className="space-y-2 pl-2 border-l border-white/10 ml-3">
                    {day.details.map((detail, detIdx) => (
                      <div key={detIdx} className="flex items-start gap-2 relative group">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 mt-1.5 flex-shrink-0" />
                        <input 
                          type="text" 
                          value={detail} 
                          onChange={(e) => updateDayDetail(dIdx, detIdx, e.target.value)} 
                          placeholder="Activity detail..." 
                          className="flex-1 bg-transparent text-sm text-gray-300 focus:outline-none focus:text-white placeholder:text-gray-600"
                          required
                        />
                        <button type="button" onClick={() => removeDetail(dIdx, detIdx)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addDetail(dIdx)} className="text-[11px] text-gray-500 hover:text-cyan-400 flex items-center gap-1 mt-2">
                      <Plus size={10} /> Add Activity
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/10 transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold hover:opacity-90 transition-opacity">
            {mode === "add" ? "Add Package" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all"
      />
    </div>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{label}</label>
        <button type="button" onClick={() => setMode(mode === "preset" ? "custom" : "preset")} className="text-[10px] text-cyan-400 hover:text-cyan-300">
          {mode === "preset" ? "Use Custom URL" : "Use Preset"}
        </button>
      </div>
      {mode === "preset" ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 transition-all appearance-none">
          {AVAILABLE_IMAGES.map((img) => <option key={img.value} value={img.value}>{img.label}</option>)}
        </select>
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all" />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 transition-all appearance-none">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<Tab>("destinations");

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageDestinationFilter, setPackageDestinationFilter] = useState<string>("all");
  const [packageSectionFilter, setPackageSectionFilter] = useState<string>("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [destModal, setDestModal] = useState<{ mode: ModalMode; item?: Destination } | null>(null);
  const [pkgModal, setPkgModal] = useState<{ mode: ModalMode; item?: Package } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "dest" | "pkg"; id: string; name: string } | null>(null);

  const refreshData = useCallback(async () => {
    const [dests, pkgs] = await Promise.all([fetchDestinations(), fetchPackages()]);
    setDestinations(dests);
    setPackages(pkgs);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthenticated(isAdminAuthenticated());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const loadInitialData = async () => {
      const [dests, pkgs] = await Promise.all([fetchDestinations(), fetchPackages()]);
      if (!active) return;
      setDestinations(dests);
      setPackages(pkgs);
    };
    void loadInitialData();
    return () => {
      active = false;
    };
  }, []);

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  const destinationMap = useMemo(() => new Map(destinations.map((d) => [d.id, d.name])), [destinations]);

  const filteredPackages = useMemo(() => {
    let result = packages;
    if (packageDestinationFilter !== "all") {
      result = result.filter((pkg) => pkg.destinationId === packageDestinationFilter);
    }
    if (packageSectionFilter !== "all") {
      result = result.filter((pkg) => pkg.sections?.includes(packageSectionFilter));
    }
    return result;
  }, [packages, packageDestinationFilter, packageSectionFilter]);

  const handleSaveDest = async (data: Omit<Destination, "id">) => {
    if (destModal?.mode === "edit" && destModal.item) {
      const res = await updateDestination({ ...data, id: destModal.item.id });
      if (res.success) showToast(`"${data.name}" updated successfully!`, "success");
      else showToast(res.error || "Failed", "error");
    } else {
      const id = slugifyDestinationName(data.name);
      if (!id) {
        showToast("Destination name must contain letters or numbers.", "error");
        return;
      }
      if (destinations.some((destination) => destination.id === id)) {
        showToast("A destination with this name already exists.", "error");
        return;
      }
      const res = await saveDestination({ ...data, id });
      if (res.success) showToast(`"${data.name}" added successfully!`, "success");
      else showToast(res.error || "Failed", "error");
    }

    setDestModal(null);
    refreshData();
  };

  const handleDeleteDest = async () => {
    if (!confirmDelete || confirmDelete.type !== "dest") return;
    const res = await deleteDestinationAction(confirmDelete.id);
    if (res.success) showToast(`"${confirmDelete.name}" deleted.`, "success");
    else showToast(res.error || "Failed", "error");
    setConfirmDelete(null);
    refreshData();
  };

  const handleSavePkg = async (data: Omit<Package, "id">) => {
    if (pkgModal?.mode === "edit" && pkgModal.item) {
      const res = await updatePackage({ ...data, id: pkgModal.item.id });
      if (res.success) showToast(`"${data.name}" updated successfully!`, "success");
      else showToast(res.error || "Failed", "error");
    } else {
      const res = await savePackage({ ...data, id: crypto.randomUUID() });
      if (res.success) showToast(`"${data.name}" added successfully!`, "success");
      else showToast(res.error || "Failed", "error");
    }

    setPkgModal(null);
    refreshData();
  };

  const handleDeletePkg = async () => {
    if (!confirmDelete || confirmDelete.type !== "pkg") return;
    const res = await deletePackageAction(confirmDelete.id);
    if (res.success) showToast(`"${confirmDelete.name}" deleted.`, "success");
    else showToast(res.error || "Failed", "error");
    setConfirmDelete(null);
    refreshData();
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthenticated(false);
  };

  if (!authenticated) return <LoginScreen onLogin={() => setAuthenticated(true)} />;

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(180deg, #050B1F 0%, #0A1628 100%)", fontFamily: "var(--font-body)" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {destModal && <DestinationModal mode={destModal.mode} initial={destModal.item} onSave={handleSaveDest} onClose={() => setDestModal(null)} />}
      {pkgModal && <PackageModal mode={pkgModal.mode} initial={pkgModal.item} destinations={destinations} onSave={handleSavePkg} onClose={() => setPkgModal(null)} />}
      {confirmDelete && <ConfirmDialog message={`This will permanently delete "${confirmDelete.name}". This action cannot be undone.`} onConfirm={confirmDelete.type === "dest" ? handleDeleteDest : handleDeletePkg} onCancel={() => setConfirmDelete(null)} />}

      <header className="sticky top-0 z-50 bg-[#050B1F]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
            <span className="text-cyan-400">Lets</span>Trip <span className="text-gray-500 font-normal text-sm">Admin</span>
          </h1>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm hover:bg-white/10 hover:text-white transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
          <button onClick={() => setTab("destinations")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "destinations" ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <MapPin size={16} /> Destinations ({destinations.length})
          </button>
          <button onClick={() => setTab("packages")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "packages" ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <Briefcase size={16} /> Packages ({packages.length})
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {tab === "destinations" ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-headline)" }}>Manage Destinations</h2>
              <button onClick={() => setDestModal({ mode: "add" })} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold hover:opacity-90 transition-opacity">
                <Plus size={16} /> Add Destination
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations.map((d) => (
                <div key={d.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-gray-800">
                    <Image src={d.image} alt={d.name} fill className="object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setDestModal({ mode: "edit", item: d })} className="p-2 rounded-lg bg-black/60 backdrop-blur text-white hover:bg-cyan-500/40 transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => setConfirmDelete({ type: "dest", id: d.id, name: d.name })} className="p-2 rounded-lg bg-black/60 backdrop-blur text-white hover:bg-red-500/40 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-1" style={{ fontFamily: "var(--font-headline)" }}>{d.name}</h3>
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">{d.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold text-sm">{d.price}</span>
                    <span className="text-gray-500 text-xs">{d.duration}</span>
                  </div>
                  {d.bestTimeToVisit && (
                    <div className="mt-2 text-[11px] text-orange/80 font-medium">Best Time: {d.bestTimeToVisit}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-headline)" }}>Manage Packages</h2>
                <button onClick={() => setPkgModal({ mode: "add" })} disabled={!destinations.length} aria-label={!destinations.length ? "Add a destination first to create packages" : "Add package"} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
                  <Plus size={16} /> Add Package
                </button>
              </div>
              {!destinations.length && (
                <p className="text-xs text-amber-300/80">Add at least one destination before creating packages.</p>
              )}

              <div className="flex flex-wrap gap-2">
                <button onClick={() => setPackageDestinationFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${packageDestinationFilter === "all" ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"}`}>
                  All Destinations
                </button>
                {destinations.map((d) => (
                  <button key={d.id} onClick={() => setPackageDestinationFilter(d.id)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${packageDestinationFilter === d.id ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"}`}>
                    {d.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => setPackageSectionFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${packageSectionFilter === "all" ? "bg-violet-500/20 border-violet-400/40 text-violet-300" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"}`}>
                  All Sections
                </button>
                {PACKAGE_SECTIONS.map((s) => (
                  <button key={s.id} onClick={() => setPackageSectionFilter(s.id)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${packageSectionFilter === s.id ? "bg-violet-500/20 border-violet-400/40 text-violet-300" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"}`}>
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPackages.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-white text-sm" style={{ fontFamily: "var(--font-headline)" }}>{p.name}</h3>
                          <p className="text-cyan-400 font-bold mt-0.5">{p.price}</p>
                          <p className="text-gray-500 text-[11px]">{p.destinationId ? destinationMap.get(p.destinationId) : "General"}</p>
                        </div>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setPkgModal({ mode: "edit", item: p })} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => setConfirmDelete({ type: "pkg", id: p.id, name: p.name })} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      {p.sections && p.sections.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {p.sections.map((sId) => {
                            const sec = PACKAGE_SECTIONS.find((s) => s.id === sId);
                            return sec ? <span key={sId} className="px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 text-[9px] font-medium">{sec.icon} {sec.label}</span> : null;
                          })}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.highlights.map((h) => <span key={h} className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[10px]">{h}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
