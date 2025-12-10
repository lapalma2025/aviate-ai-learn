import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

export const Footer = () => {
	return (
		<footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Plane className="h-6 w-6 text-primary" />
							<span className="font-bold text-lg">PPLA Academy</span>
						</div>
						<p className="text-sm text-muted-foreground">
							Profesjonalna platforma przygotowująca do egzaminu PPLA
						</p>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold">Dowiedz się więcej</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									to="/how-to-get-ppla"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Jak zdobyć PPL(A)?
								</Link>
							</li>
							<li>
								<Link
									to="/costs-ppla"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Koszty szkolenia PPL(A)
								</Link>
							</li>
							<li>
								<Link
									to="/faq"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									FAQ - Najczęstsze pytania
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold">Dokumenty prawne</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									to="/terms"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Regulamin
								</Link>
							</li>
							<li>
								<Link
									to="/privacy"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Polityka prywatności
								</Link>
							</li>
							<li>
								<Link
									to="/cookies-policy"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Polityka cookies
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold">Kontakt</h3>
						<p className="text-sm text-muted-foreground">
							Masz pytania? Skontaktuj się z nami:
							<br />
							<a
								href="mailto:kontakt@pplacademy.pl"
								className="text-primary hover:underline"
							>
								kontakt@pplacademy.pl
							</a>
						</p>
					</div>
				</div>

				<div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
					<p>
						&copy; {new Date().getFullYear()} PPLA Academy. Wszelkie prawa
						zastrzeżone.
					</p>
				</div>
			</div>
		</footer>
	);
};