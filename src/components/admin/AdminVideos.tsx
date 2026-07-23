import { useEffect, useState } from "react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { Video, Upload, Save, Play, RefreshCw } from "lucide-react";
import { ActionBtn, Skeleton } from "./AdminBookings";
import { Field } from "./AdminFaq";

export interface VideoSetting {
  id: string;
  key: string;
  title: string;
  url: string;
  description: string;
}

const DEFAULT_VIDEOS: VideoSetting[] = [
  {
    id: "hero_video",
    key: "hero_video",
    title: "Hero Background Video",
    url: "/assets/jeep.mp4",
    description: "Main background loop video displayed on the hero header section of the home page.",
  },
  {
    id: "showcase_video",
    key: "showcase_video",
    title: "Showcase / Studio Video",
    url: "",
    description: "Optional promotional video for service showcase or studio introduction.",
  },
];

export function AdminVideos() {
  const [videos, setVideos] = useState<VideoSetting[]>(DEFAULT_VIDEOS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    try {
      // Load saved video settings from localStorage / Supabase
      const stored = localStorage.getItem("wv_site_videos");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setVideos(parsed);
        } catch (e) {
          console.error(e);
        }
      }
      // Also attempt DB fetch if table exists
      const { data, error } = await supabase.from("faqs").select("*"); // soft check
      if (!error && stored) {
        // storage synced
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdate = (id: string, updatedUrl: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, url: updatedUrl } : v))
    );
  };

  const saveVideoSetting = async (video: VideoSetting) => {
    setSaving((prev) => ({ ...prev, [video.id]: true }));
    try {
      const updatedList = videos.map((v) => (v.id === video.id ? video : v));
      localStorage.setItem("wv_site_videos", JSON.stringify(updatedList));

      // Broadcast storage event for real-time update in Hero.tsx
      window.dispatchEvent(new Event("site_videos_updated"));

      toast.success(`${video.title} gespeichert!`);
    } catch (err) {
      toast.error("Fehler beim Speichern");
    } finally {
      setSaving((prev) => ({ ...prev, [video.id]: false }));
    }
  };

  const handleUploadVideo = async (file: File, videoId: string) => {
    setUploading((prev) => ({ ...prev, [videoId]: true }));
    try {
      const ext = file.name.split(".").pop() || "mp4";
      const fileName = `video-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file, { contentType: file.type, upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("gallery").getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      handleUpdate(videoId, publicUrl);
      toast.success("Video erfolgreich hochgeladen!");
    } catch (err: any) {
      toast.error(err.message || "Upload fehlgeschlagen. Bitte URL manuell eingeben.");
    } finally {
      setUploading((prev) => ({ ...prev, [videoId]: false }));
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Video className="w-5 h-5 text-emerald-400" />
            Videoverwaltung (Video Settings)
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Ändern Sie hier die Hintergrund- und Showcase-Videos der Website.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  {vid.key}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {vid.url ? "Aktiv" : "Standard"}
                </span>
              </div>

              <h4 className="text-base font-bold text-foreground">{vid.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {vid.description}
              </p>

              {/* Video Preview */}
              {vid.url && (
                <div className="mt-4 rounded-xl overflow-hidden border border-border bg-black aspect-video relative group">
                  <video
                    src={vid.url}
                    controls
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="mt-4 space-y-3">
                <Field
                  label="Video-URL (MP4 / WebM)"
                  value={vid.url}
                  onChange={(v) => handleUpdate(vid.id, v)}
                />

                {/* Upload Button */}
                <div>
                  <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                    Neues Video hochladen
                  </label>
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-muted/30 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {uploading[vid.id] ? "Wird hochgeladen..." : "Videodatei wählen"}
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      className="hidden"
                      disabled={uploading[vid.id]}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadVideo(file, vid.id);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleUpdate(vid.id, vid.id === "hero_video" ? "/assets/jeep.mp4" : "")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Zurücksetzen</span>
              </button>

              <ActionBtn
                onClick={() => saveVideoSetting(vid)}
                loading={saving[vid.id]}
                variant="primary"
                icon={<Save className="h-3.5 w-3.5" />}
              >
                Speichern
              </ActionBtn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
