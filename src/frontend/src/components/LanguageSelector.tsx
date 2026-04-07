import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe } from "lucide-react";
import { LANGUAGE_OPTIONS } from "../contexts/LanguageContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const currentOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === language) ??
    LANGUAGE_OPTIONS[0];

  // Abbreviate native name to fit compact button
  const displayName =
    currentOption.nativeName.length > 6
      ? `${currentOption.nativeName.slice(0, 5)}…`
      : currentOption.nativeName;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 text-white/80 hover:text-white hover:bg-white/10 border border-white/20 rounded-md px-2 py-1 h-7 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          data-ocid="header.language_selector"
          aria-label={`Language: ${currentOption.name}`}
        >
          <Globe className="w-3 h-3 shrink-0" />
          <span className="max-w-[52px] truncate">{displayName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 p-0" sideOffset={6}>
        <ScrollArea className="h-80">
          <div className="py-1">
            {LANGUAGE_OPTIONS.map((opt, index) => (
              <DropdownMenuItem
                key={opt.code}
                onClick={() => setLanguage(opt.code)}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
                  language === opt.code
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-muted"
                }`}
                data-ocid={`header.language_option.${index + 1}`}
              >
                <span className="text-sm font-medium">{opt.nativeName}</span>
                <span className="text-xs text-muted-foreground ml-2 shrink-0">
                  {opt.name}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
