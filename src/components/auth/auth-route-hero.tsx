import Image from "next/image";

interface AuthRouteHeroProps {
	heroDescription: string;
	heroTitle: readonly [firstLine: string, secondLine: string];
}

export function AuthRouteHero({ heroDescription, heroTitle }: AuthRouteHeroProps) {
	return (
		<section
			aria-label="Alignbits route network"
			className="relative flex min-h-[300px] flex-col overflow-hidden border-b border-[#444449] p-6 min-[851px]:min-h-screen min-[851px]:border-r min-[851px]:border-b-0 min-[851px]:px-[46px] min-[851px]:pt-[34px] min-[851px]:pb-[42px]"
		>
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,#000,transparent_76%)] bg-[size:48px_48px]" />
			<div className="relative z-10 flex items-center gap-3 [font-family:var(--font-auth-mono)] text-[13px] font-medium tracking-[0.14em] uppercase">
				<Image
					alt=""
					aria-hidden="true"
					className="size-7 object-cover"
					height={28}
					priority
					src="/alignbits-logo.jpg"
					width={28}
				/>
				<strong>Alignbits</strong>
				<span className="ml-auto hidden text-[10px] text-[#a1a1aa] min-[851px]:block">
					Tracking network / live
				</span>
			</div>
			<div aria-hidden="true" className="pointer-events-none absolute inset-[12%_3%_5%_9%]">
				<svg className="h-full w-full overflow-visible" viewBox="0 0 800 650">
					<path
						d="M20 512 C170 300 270 580 420 336 S650 170 790 225"
						fill="none"
						stroke="#444449"
						strokeWidth="1"
					/>
					<path
						className="animate-[auth-route-flow_10s_linear_infinite] motion-reduce:animate-none"
						d="M34 540 C145 430 186 316 302 354 S436 454 523 317 S664 136 774 190"
						fill="none"
						stroke="#f4f4f5"
						strokeDasharray="8 10"
						strokeWidth="2"
					/>
					{[
						[34, 540],
						[302, 354],
						[774, 190],
					].map(([cx, cy]) => (
						<circle
							cx={cx}
							cy={cy}
							fill="#202023"
							key={`${cx}-${cy}`}
							r="7"
							stroke="#f4f4f5"
							strokeWidth="2"
						/>
					))}
					<circle
						cx="523"
						cy="317"
						fill="#a1a1aa"
						r="8"
						stroke="#202023"
						strokeWidth="5"
					/>
				</svg>
			</div>
			<div className="relative z-10 mt-[62px] mb-[34px] max-w-[710px] min-[851px]:my-auto">
				<p className="[font-family:var(--font-auth-mono)] text-[11px] font-medium tracking-[0.17em] text-[#f4f4f5] uppercase">
					One network. Every movement.
				</p>
				<h1 className="mt-[18px] mb-[22px] text-[54px] leading-[0.93] font-medium tracking-[-0.065em] min-[851px]:text-[clamp(54px,7vw,104px)]">
					{heroTitle[0]}
					<br />
					{heroTitle[1]}
				</h1>
				<p className="hidden max-w-[480px] text-[17px] leading-[1.7] text-[#a1a1aa] min-[851px]:block">
					{heroDescription}
				</p>
			</div>
			<div className="relative z-10 hidden gap-[26px] [font-family:var(--font-auth-mono)] text-[10px] tracking-[0.1em] text-[#a1a1aa] uppercase min-[851px]:flex">
				<span>
					<i className="mr-2 inline-block size-1.5 rounded-full bg-[#f4f4f5]" />
					Route confirmed
				</span>
				<span>
					<i className="mr-2 inline-block size-1.5 rounded-full bg-[#a1a1aa]" />
					Attention point
				</span>
			</div>
		</section>
	);
}
