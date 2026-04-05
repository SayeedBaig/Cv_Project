import { useEffect, useState } from "react";

function Navbar({ username, onLogout }) {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstalledState = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

      setIsInstalled(isStandalone);

      if (isStandalone) {
        setInstallPrompt(null);
        setShowInstallHelp(false);
      }
    };

    checkInstalledState();

    const handleBeforeInstallPrompt = (event) => {
      if (isInstalled) {
        return;
      }

      event.preventDefault();
      setInstallPrompt(event);
      setShowInstallHelp(false);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstallHelp(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", checkInstalledState);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window
        .matchMedia("(display-mode: standalone)")
        .removeEventListener("change", checkInstalledState);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      setShowInstallHelp((current) => !current);
      return;
    }

    setShowInstallHelp(false);
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-700 bg-gray-900/95 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
            Road Hazard Detection System
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            AI-powered real-time monitoring
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="flex flex-wrap items-center gap-3">
            {username ? (
              <div className="rounded-full border border-white/10 bg-gray-800/80 px-4 py-2 text-sm text-gray-300">
                Logged in as:{" "}
                <span className="font-medium text-white">{username}</span>
              </div>
            ) : null}

            {!isInstalled ? (
              <button
                type="button"
                onClick={handleInstallClick}
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-gray-950 shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-400"
              >
                Install App
              </button>
            ) : null}

            {onLogout ? (
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
              >
                Logout
              </button>
            ) : null}

            <div className="flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">
                System Active
              </span>
            </div>
          </div>

          {showInstallHelp ? (
            <p className="max-w-xs text-sm text-gray-400 sm:text-right">
              Install is available from your browser menu or address bar on this
              device. When supported, this button will open the install prompt
              directly.
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
