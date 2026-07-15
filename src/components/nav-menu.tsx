"use client";

import Link from "next/link";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function NavigationMenuComponent() {
	const components: {
		title: string;
		path: string;
		description: string;
	}[] = [
		{
			title: "OCEAN",
			path: "/dashboard/tracking/ocean/prod/status",
			description: "Visit ocean dashboard to view metrics.",
		},
		{
			title: "AIR",
			path: "/dashboard/tracking/air/prod/status",
			description: "Visit air dashboard to view metrics.",
		},
		{
			title: "TERMINAL",
			path: "/dashboard/tracking/terminal/prod/status",
			description: "Visit terminal dashboard to view metrics.",
		},
		{
			title: "ROAD",
			path: "/dashboard/tracking/road/prod/status",
			description: "Visit road dashboard to view metrics.",
		},
		{
			title: "INTERMODAL",
			path: "/dashboard/tracking/intermodal/prod/status",
			description: "Visit intermodal dashboard to view metrics.",
		},
		{
			title: "FREIGHT",
			path: "/dashboard/tracking/freight/prod/status",
			description: "Visit freight dashboard to view metrics.",
		},
		{
			title: "LOAD",
			path: "/dashboard/tracking/load/prod/status",
			description: "Visit load dashboard to view metrics.",
		},
	];

	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Tracking</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{components.map((component) => (
								<li key={component.title}>
									<Link
										href={component.path}
										className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
									>
										<div className="font-medium text-sm leading-none">
											{component.title}
										</div>
										<p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
											{component.description}
										</p>
									</Link>
								</li>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
