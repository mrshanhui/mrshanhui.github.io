// SSR-safe import: Astro server-renders this component before hydration.
// The /ssr subpath defers all browser-API access until client-side execution.
import Zmage from "react-zmage/ssr";
import "react-zmage/style.css";
import "./gallery.css";

export interface PhotoItem {
	/**
	 * A single optimized WebP URL — used for BOTH the grid thumbnail and
	 * the fullscreen viewer. This is intentional:
	 *
	 *   • zmage's cover geometry animation requires the cover <img> src and
	 *     the set item src to be the same URL. If they differ, zmage can't
	 *     match them and falls back to the center-open animation.
	 *
	 *   • Because the same URL is already in the browser cache from loading
	 *     the grid thumbnail, clicking opens the viewer instantly with no
	 *     additional network request.
	 *
	 * CSS scales the image down to the grid cell size; the viewer displays
	 * it at natural dimensions. Quality is set high enough to look sharp
	 * at full-screen size.
	 */
	src: string;
	alt: string;
	/** Original pixel dimensions — used by the justified-flex layout math */
	width: number;
	height: number;
	caption?: string;
}

interface GalleryProps {
	photos: PhotoItem[];
}

export default function Gallery({ photos }: GalleryProps) {
	// Build the gallery set once. Every <Zmage> instance in the grid shares
	// this same set; defaultPage={index} tells zmage which item to open.
	// Flip arrows (◀ ▶) appear automatically because the set has > 1 item.
	const gallerySet = photos.map((p) => ({
		src: p.src,
		alt: p.alt,
		caption: p.caption ?? "",
	}));

	return (
		<div className="photo-gallery">
			{photos.map((photo, index) => (
				<div
					key={photo.src}
					className="photo-item"
					style={
						{
							"--width": photo.width,
							"--height": photo.height,
						} as React.CSSProperties
					}
				>
					{/*
					 * Component mode <Zmage>:
					 *   • zmage holds a ref to this DOM element and reads its
					 *     position/size for the cover geometry animation.
					 *   • src === set[defaultPage].src → zmage matches them
					 *     and performs the "expand from origin" transition. ✓
					 *   • The viewer image is the same URL already in cache
					 *     from the thumbnail → zero additional network request. ✓
					 *
					 * controller={{ pagination: false }}
					 *   Hides the bottom dot-row while keeping flip arrows,
					 *   close button, and zoom.
					 */}
					<Zmage
						src={photo.src}
						alt={photo.alt}
						set={gallerySet}
						defaultPage={index}
						backdrop="rgba(0, 0, 0, 0.3)"
						radius={0}
						edge={40}
						controller={{ pagination: false, flip: false }}
						{...({ loading: index < 16 ? "eager" : "lazy", decoding: "async" } as object)}
					/>
				</div>
			))}
		</div>
	);
}
