import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function ProblemImage({ path, alt }: { path: string; alt: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void supabase.storage
      .from("problem-images")
      .createSignedUrl(path, 3600)
      .then(({ data }) => {
        if (active) setUrl(data?.signedUrl ?? null);
      });
    return () => {
      active = false;
    };
  }, [path]);

  if (!url) {
    return <div className="h-40 w-full animate-pulse rounded-lg bg-muted sm:w-56" aria-hidden />;
  }
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      className="h-40 w-full rounded-lg border border-border object-cover sm:w-56"
    />
  );
}
