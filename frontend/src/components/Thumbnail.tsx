import { useState, type ReactNode, type SyntheticEvent } from "react";
import { isShorts, thumbnailUrl, youtubeId } from "../lib/youtube";
import { Icon } from "./Icon";
import "./Thumbnail.css";

type Props = {
  sourceUrl: string | null;
  className?: string;
  /** Overlays (badges, chips) positioned inside the frame. */
  children?: ReactNode;
};

/**
 * 16:9 frame for a YouTube thumbnail. hqdefault is 4:3 with black bars, so a
 * regular video is cropped to 16:9 (removing the bars); a Short shows its
 * vertical frame over a blurred copy. Falls back to a warm placeholder.
 */
export function Thumbnail({ sourceUrl, className, children }: Props) {
  const id = youtubeId(sourceUrl);
  const [failed, setFailed] = useState(false);
  const src = id && !failed ? thumbnailUrl(id) : null;
  const shorts = isShorts(sourceUrl);

  // A missing video returns a 120px grey placeholder rather than an error
  const onLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth <= 120) setFailed(true);
  };

  return (
    <div className={["thumb", className].filter(Boolean).join(" ")}>
      {src ? (
        shorts ? (
          <>
            <img className="thumb__backdrop" src={src} alt="" aria-hidden="true" onError={() => setFailed(true)} />
            <img className="thumb__vertical" src={src} alt="" loading="lazy" onLoad={onLoad} />
          </>
        ) : (
          <img className="thumb__img" src={src} alt="" loading="lazy" onLoad={onLoad} onError={() => setFailed(true)} />
        )
      ) : (
        <div className="thumb__placeholder">
          <Icon name="soup_kitchen" />
        </div>
      )}
      {children}
    </div>
  );
}
