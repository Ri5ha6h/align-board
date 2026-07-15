"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export default function QueryProviderWrapper({ children }: { children: React.ReactNode }) {
	//const queryClient = new QueryClient();
	const [queryClient] = React.useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						//staleTime: 6 * 1000,
						//refetchInterval: 6 * 1000,
					},
				},
			}),
	);
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
