import { useState, useEffect } from "react";

export type CookiePreferences = {
	necessary: boolean;
	analytics: boolean;
	marketing: boolean;
};

const COOKIE_CONSENT_KEY = "cookie-consent";
const COOKIE_PREFERENCES_KEY = "cookie-preferences";

export const useCookieConsent = () => {
	const [showBanner, setShowBanner] = useState(false);
	const [preferences, setPreferences] = useState<CookiePreferences>({
		necessary: true,
		analytics: false,
		marketing: false,
	});

	// 🔥 GLOBALNY EVENT — nasłuch w App.tsx
	useEffect(() => {
		const handler = () => setShowBanner(true);
		window.addEventListener("show-cookie-banner", handler);
		return () => window.removeEventListener("show-cookie-banner", handler);
	}, []);

	useEffect(() => {
		const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
		const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

		if (!consent) {
			setShowBanner(true);
		} else if (savedPreferences) {
			setPreferences(JSON.parse(savedPreferences));
		}
	}, []);

	const acceptAll = () => {
		const allAccepted = {
			necessary: true,
			analytics: true,
			marketing: true,
		};
		setPreferences(allAccepted);
		localStorage.setItem(COOKIE_CONSENT_KEY, "true");
		localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted));
		setShowBanner(false);
	};

	const rejectAll = () => {
		const onlyNecessary = {
			necessary: true,
			analytics: false,
			marketing: false,
		};
		setPreferences(onlyNecessary);
		localStorage.setItem(COOKIE_CONSENT_KEY, "true");
		localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(onlyNecessary));
		setShowBanner(false);
	};

	const savePreferences = (newPreferences: CookiePreferences) => {
		const updated = { ...newPreferences, necessary: true };
		setPreferences(updated);
		localStorage.setItem(COOKIE_CONSENT_KEY, "true");
		localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(updated));
		setShowBanner(false);
	};

	const resetConsent = () => {
		localStorage.removeItem(COOKIE_CONSENT_KEY);
		localStorage.removeItem(COOKIE_PREFERENCES_KEY);
		setShowBanner(true);
		setPreferences({
			necessary: true,
			analytics: false,
			marketing: false,
		});
	};

	return {
		showBanner,
		setShowBanner,
		preferences,
		acceptAll,
		rejectAll,
		savePreferences,
		resetConsent,
	};
};

export const forceShowCookieBanner = () => {
	window.dispatchEvent(new Event("show-cookie-banner"));
};
