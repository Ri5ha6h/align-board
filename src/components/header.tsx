import Link from "next/link";
import { HamburgerMenuComponent } from "./ham-menu";
import { NavigationMenuComponent } from "./nav-menu";
import { SignOutComponent } from "./sign-out-component";

const Header = () => {
	return (
		<header className="flex h-[70px] items-center justify-between border-b px-4">
			<div className="hidden items-center gap-4 md:flex">
				<h2 className="font-medium text-2xl tracking-wide">
					<Link href="/dashboard">ALIGNBITS</Link>
				</h2>
				<NavigationMenuComponent />
			</div>
			<div className="flex items-center gap-4 md:hidden">
				<HamburgerMenuComponent />
				<h2 className="font-medium text-2xl tracking-wide">
					<Link href="/dashboard" className="hidden sm:block">
						ALIGNBITS
					</Link>
					<Link href="/dashboard" className="block sm:hidden">
						ALIGNBITS
					</Link>
				</h2>
			</div>
			<SignOutComponent />
		</header>
	);
};

export default Header;
