import { useState, useEffect } from "react";

export type CookiePreferences = {
	necessary: boolean;
	analytics: boolean;
	marketing: boolean;
};

const COOKIE_CONSENT_KEY = "cookie-consent";
const COOKIE_PREFERENCES_KEY = "cookie-preferences";

// Deklaracja Google Analytics (gtag) dla TypeScript
declare global {
	interface Window {
		gtag?: (
			command: string,
			targetId: string,
			config?: Record<string, any>
		) => void;
		dataLayer?: any[];
	}
}

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
			const prefs = JSON.parse(savedPreferences);
			setPreferences(prefs);
			// Zastosuj zapisane preferencje
			applyPreferences(prefs);
		}
	}, []);

	// Funkcja stosująca preferencje cookies
	const applyPreferences = (prefs: CookiePreferences) => {
		// 1. Google Analytics
		if (prefs.analytics) {
			enableGoogleAnalytics();
		} else {
			disableGoogleAnalytics();
		}

		// 2. Marketing (Google Ads, remarketing)
		if (prefs.marketing) {
			enableMarketingCookies();
		} else {
			disableMarketingCookies();
		}

		// 3. Wyślij zgodę do Google Consent Mode v2
		updateGoogleConsentMode(prefs);
	};

	const acceptAll = () => {
		const allAccepted = {
			necessary: true,
			analytics: true,
			marketing: true,
		};
		setPreferences(allAccepted);
		localStorage.setItem(COOKIE_CONSENT_KEY, "true");
		localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted));
		applyPreferences(allAccepted);
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
		applyPreferences(onlyNecessary);
		setShowBanner(false);
	};

	const savePreferences = (newPreferences: CookiePreferences) => {
		const updated = { ...newPreferences, necessary: true };
		setPreferences(updated);
		localStorage.setItem(COOKIE_CONSENT_KEY, "true");
		localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(updated));
		applyPreferences(updated);
		setShowBanner(false);
	};

	const resetConsent = () => {
		localStorage.removeItem(COOKIE_CONSENT_KEY);
		localStorage.removeItem(COOKIE_PREFERENCES_KEY);

		// Wyłącz wszystko poza niezbędnymi
		const onlyNecessary = {
			necessary: true,
			analytics: false,
			marketing: false,
		};
		applyPreferences(onlyNecessary);

		setShowBanner(true);
		setPreferences(onlyNecessary);
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

// ============================================================
// GOOGLE ANALYTICS (GA4)
// ============================================================

const GA_MEASUREMENT_ID =
	import.meta.env.VITE_GA_MEASUREMENT_ID || "G-D5KL029XMJ";

export const enableGoogleAnalytics = () => {
	// Sprawdź czy GA jest już załadowane
	if (window.gtag) {
		window.gtag("consent", "update", {
			analytics_storage: "granted",
		});
		return;
	}

	// Załaduj skrypt Google Analytics
	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
	document.head.appendChild(script);

	// Inicjalizacja gtag
	window.dataLayer = window.dataLayer || [];
	window.gtag = function () {
		window.dataLayer?.push(arguments);
	};
	window.gtag("js", new Date());
	window.gtag("config", GA_MEASUREMENT_ID, {
		anonymize_ip: true,
		cookie_flags: "SameSite=None;Secure",
	});
};

export const disableGoogleAnalytics = () => {
	if (window.gtag) {
		window.gtag("consent", "update", {
			analytics_storage: "denied",
		});
	}

	// Usuń cookies Google Analytics
	deleteCookie("_ga");
	deleteCookie("_gat");
	deleteCookie("_gid");
};

// ============================================================
// MARKETING COOKIES (Google Ads, Remarketing)
// ============================================================

export const enableMarketingCookies = () => {
	// Google Consent Mode dla marketingu/reklam
	if (window.gtag) {
		window.gtag("consent", "update", {
			ad_storage: "granted",
			ad_user_data: "granted",
			ad_personalization: "granted",
		});
	}
};

export const disableMarketingCookies = () => {
	// Google Consent Mode - wyłącz reklamy
	if (window.gtag) {
		window.gtag("consent", "update", {
			ad_storage: "denied",
			ad_user_data: "denied",
			ad_personalization: "denied",
		});
	}
};

// ============================================================
// GOOGLE CONSENT MODE V2
// ============================================================

export const updateGoogleConsentMode = (prefs: CookiePreferences) => {
	if (!window.gtag) return;

	window.gtag("consent", "update", {
		analytics_storage: prefs.analytics ? "granted" : "denied",
		ad_storage: prefs.marketing ? "granted" : "denied",
		ad_user_data: prefs.marketing ? "granted" : "denied",
		ad_personalization: prefs.marketing ? "granted" : "denied",
		functionality_storage: "granted", // Zawsze (niezbędne)
		security_storage: "granted", // Zawsze (niezbędne)
	});
};

// ============================================================
// POMOCNICZE FUNKCJE
// ============================================================

const deleteCookie = (name: string) => {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
};

// Inicjalizacja domyślna Google Consent Mode (przed zgodą użytkownika)
export const initGoogleConsentMode = () => {
	window.dataLayer = window.dataLayer || [];
	window.gtag =
		window.gtag ||
		function () {
			window.dataLayer?.push(arguments);
		};

	window.gtag("consent", "default", {
		analytics_storage: "denied",
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
		functionality_storage: "granted",
		security_storage: "granted",
		wait_for_update: 500,
	});
};
