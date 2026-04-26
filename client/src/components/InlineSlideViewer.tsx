/**
 * InlineSlideViewer - Renders PPTX slides inline within lecture content
 * using Microsoft Office Online viewer. Includes audio player alongside.
 */
import { useState } from "react";
import { Presentation, Volume2, ChevronDown, ChevronUp, ExternalLink, Download } from "lucide-react";

interface InlineSlideViewerProps {
  slideUrl: string;
  audioUrl?: string | null;
  title: string;
}

export default function InlineSlideViewer({ slideUrl, audioUrl, title }: InlineSlideViewerProps) {
  const [expanded, setExpanded] = useState(false);

  // Use Microsoft Office Online viewer to render PPTX
  const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(slideUrl)}`;

  return (
    <div className="my-8 border border-[#D4AF37]/30 bg-[#F5F0E8]/80 overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-[#164A4A]/40 hover:bg-[#164A4A]/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
            <Presentation className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-left">
            <div className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold tracking-wide uppercase">
              Interactive Slide Deck
            </div>
            <div className="text-[#1A5C5C] font-['Work_Sans'] text-xs mt-0.5">
              {title} slides — click to view
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {audioUrl && (
            <Volume2 className="w-4 h-4 text-[#227C82]" />
          )}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-[#D4AF37]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#D4AF37]" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Slide viewer iframe */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={viewerUrl}
              className="absolute inset-0 w-full h-full border border-[#D4CBBA]"
              allowFullScreen
              title={`${title} slides`}
            />
          </div>

          {/* Audio player + download link */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {audioUrl && (
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                    Listen while viewing
                  </span>
                </div>
                <audio controls className="w-full h-9" style={{ filter: 'sepia(20%) saturate(70%) brightness(90%)' }}>
                  <source src={audioUrl} type="audio/mpeg" />
                </audio>
              </div>
            )}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={slideUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#227C82]/40 text-[#1A5C5C] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 font-['Montserrat'] text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
              <a
                href={viewerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#227C82]/40 text-[#1A5C5C] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 font-['Montserrat'] text-xs font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
