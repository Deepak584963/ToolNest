export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var stored = localStorage.getItem("tn-theme") || "system";
                var isDark = stored === "dark" || (stored === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
                if (isDark) {
                  document.documentElement.classList.add("dark");
                  document.documentElement.style.colorScheme = "dark";
                } else {
                  document.documentElement.classList.remove("dark");
                  document.documentElement.style.colorScheme = "light";
                }
              } catch (e) {}
            })();
          `,
        }}
      />
      {children}
    </>
  );
}
