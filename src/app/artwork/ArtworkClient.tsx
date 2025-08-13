"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { cld } from "@/utils/cdn";
import usePageImages from "@/hooks/usePageImages";

type Variant = { url: string; width?: number; height?: number; detailOrder?: number };
type Item = {
  id?: string;
  title?: string;
  description?: string;
  dimensions?: string;
  price?: string;
  imageUrl?: string;   // legacy single-image support
  width?: number;
  height?: number;
  imageUrls?: Variant[];
  href?: string;       // expected link field (use your field name)
  link?: string;       // alt field name, just in case
};

type Props = { initialImages?: Item[] };

/** Tiny Cloudinary optimizer: autorotate + modern format + smart quality + DPR + cap width */
const optimize = (url: string, w: number): string => {
  if (!url) return url;
  if (!url.includes("/upload/")) return url;
  return url.replace(
    "/upload/",
    `/upload/a_exif,f_auto,q_auto,dpr_auto,c_limit,w_${w}/`
  );
};

export default function ArtworkClient({ initialImages = [] }: Props) {
  const PAGE_SIZE = 12; // keep in sync with your artworkInitialServer count
  const { images } = usePageImages("artwork", PAGE_SIZE);

  // Mobile toggle (restores mobile thumbnails behavior)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1000);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Which thumbnail is selected on mobile for each card
  const [selectedMobile, setSelectedMobile] = useState<Record<number, Variant>>({});

  // Use SSR data first, then swap to client data (same order/page size => no flash)
  const items = images.length ? images : initialImages;

  return (
    <div className={styles.artworkPage}>
      <h1 className={styles.visuallyHidden}>Artwork</h1>

      <div className={styles.artworkContainer}>
        {items.map((item, index) => {
          // Normalize + sort per doc so "top" image is deterministic
          const set: Variant[] = Array.isArray(item.imageUrls)
            ? [...item.imageUrls]
                .filter((v) => !!v?.url)
                .sort((a, b) => (a.detailOrder ?? 0) - (b.detailOrder ?? 0))
            : [];

          const top =
            set[0] ||
            (item.imageUrl
              ? { url: item.imageUrl, width: item.width, height: item.height }
              : undefined);

          const display = isMobile ? selectedMobile[index] || top : top;
          const src = display?.url ?? "";
          const w = display?.width || 600;
          const h = display?.height || 450;

          // Speed: ONLY first card is high priority; others explicitly low
          const prioritize = index === 0;

          // Your link field (use whichever your docs have)
          const href = (item as any).href || (item as any).link || undefined;

          // Inner card with front/back faces (keeps your flip structure/classes)
          const CardInner = (
            <div className={styles.flipCard}>
              <div className={styles.flipCardInner}>
                <div className={styles.flipCardFront}>
                  {src ? (
                    <Image
                      className={styles.artworkImage}
                      // ⬇️ Optimized Cloudinary URL (bytes down, faster paint)
                      src={optimize(src, prioritize ? 800 : 600)}
                      alt={item.title || "Artwork"}
                      width={w}
                      height={h}
                      priority={prioritize}
                      fetchPriority={prioritize ? "high" : "low"}
                      loading={prioritize ? undefined : "lazy"}
                      decoding={prioritize ? "sync" : "async"}
                      unoptimized
                      sizes="(max-width: 1000px) 100vw, 300px"
                    />
                  ) : (
                    <div className={styles.artworkImage} />
                  )}
                </div>

                {/* Back face: color + clickability intact */}
                <div
                  className={styles.flipCardBack}
                  style={{
                    background: "var(--artwork-back, #2e2c2e)",
                    pointerEvents: "auto",
                    zIndex: 2,
                  }}
                >
                  {href ? (
                    <Link
                      prefetch={false}
                      href={href}
                      className={styles.cardLink}
                      style={{ position: "relative", zIndex: 3 }}
                    >
                      {item.title || "View"}
                    </Link>
                  ) : (
                    <span>{item.title || ""}</span>
                  )}
                </div>
              </div>
            </div>
          );

          return (
            <div key={item.id || index} className={styles.artworkItem}>
              {/* If you want the whole card clickable on the FRONT too, keep this outer Link.
                  Otherwise, remove this outer Link and let only the back-face link be clickable. */}
              {href ? (
                <Link
                  prefetch={false}
                  href={href}
                  className={styles.cardWrapper}
                  aria-label={item.title || "Open"}
                >
                  {CardInner}
                </Link>
              ) : (
                CardInner
              )}

              {/* Mobile thumbnails (shown when multiple variants exist) */}
              {isMobile && set.length > 1 && (
                <div className={styles.mobileThumbnails}>
                  {set.map((thumb, tIdx) => (
                    <Image
                      key={thumb.url + tIdx}
                      src={cld(thumb.url, { width: 120 })}
                      alt={`Thumbnail ${tIdx + 1}`}
                      width={60}
                      height={60}
                      className={`${styles.thumbnail} ${
                        selectedMobile[index]?.url === thumb.url
                          ? styles.activeThumbnail
                          : ""
                      }`}
                      loading="lazy"
                      fetchPriority="low"
                      decoding="async"
                      unoptimized
                      onClick={() =>
                        setSelectedMobile((prev) => ({ ...prev, [index]: thumb }))
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}