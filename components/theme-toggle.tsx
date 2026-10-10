"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { DropdownMenu } from "radix-ui";

const emptySubscribe = () => () => {};

const options = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // false during SSR, true after hydration — next-themes has no value on the server
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Change theme"
        className="relative flex size-9 items-center justify-center overflow-hidden border border-rule text-ink-3 transition-colors hover:border-ink hover:text-ink"
      >
        {/* Both icons always render; CSS crossfades them so SSR markup is theme-agnostic */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute size-4 transition-all duration-300 ease-out motion-reduce:transition-none dark:rotate-90 dark:scale-0 dark:opacity-0"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute size-4 -rotate-90 scale-0 opacity-0 transition-all duration-300 ease-out motion-reduce:transition-none dark:rotate-0 dark:scale-100 dark:opacity-100"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="anim-pop z-50 min-w-40 border border-rule bg-plate p-1.5 shadow-[0_18px_44px_-18px_rgb(11_31_51_/_0.45)]"
        >
          <DropdownMenu.RadioGroup
            value={mounted ? theme : undefined}
            onValueChange={setTheme}
          >
            {options.map((option) => (
              <DropdownMenu.RadioItem
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center gap-2 py-2 pl-8 pr-3 text-sm outline-none data-highlighted:bg-paper data-[state=checked]:font-semibold data-[state=checked]:text-signal"
              >
                <DropdownMenu.ItemIndicator className="absolute left-2.5">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3.5"
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </DropdownMenu.ItemIndicator>
                {option.label}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
