export const dashboardFocusRing =
	"focus-visible:outline-2 focus-visible:outline-dashboard-white focus-visible:outline-offset-[-3px]";

export const dashboardEyebrow =
	"mb-[11px] font-dashboard-code text-[9px] font-medium tracking-[0.12em] text-dashboard-mist uppercase";

export const dashboardShimmer =
	"relative overflow-hidden bg-dashboard-line after:absolute after:inset-0 after:-translate-x-full after:animate-dashboard-shimmer after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)] after:content-[''] motion-reduce:after:animate-none";

export const dashboardOverlay =
	"border-dashboard-line rounded-[2px] bg-dashboard-night font-dashboard-body text-dashboard-white";

export const dashboardDialog = `${dashboardOverlay} [&_[data-slot=dialog-description]]:text-dashboard-mist [&_[data-slot=accordion-trigger]]:text-[13px] [&_[data-slot=accordion-trigger]]:text-dashboard-white [&_[data-slot=accordion-content]]:text-dashboard-mist [&_[data-slot=accordion-content]_ul]:text-xs [&_[data-slot=accordion-content]_ul]:leading-[1.65] [&_[data-slot=accordion-content]_ul]:font-normal [&_[data-slot=accordion-content]_ul]:text-dashboard-mist`;

export const dashboardSheet = `${dashboardOverlay} [&_[data-slot=sheet-header]]:gap-2 [&_[data-slot=sheet-title]]:text-xl [&_[data-slot=sheet-title]]:leading-tight [&_[data-slot=sheet-title]]:font-semibold [&_[data-slot=sheet-title]]:tracking-[-0.015em] [&_[data-slot=sheet-title]]:text-dashboard-white [&_[data-slot=sheet-description]]:text-sm [&_[data-slot=sheet-description]]:leading-relaxed [&_[data-slot=sheet-description]]:text-dashboard-panel`;

export const dashboardSelectContent =
	"border-dashboard-line rounded-[2px] bg-dashboard-night font-dashboard-body text-dashboard-white [&_[data-slot=select-item]:focus]:bg-dashboard-ink [&_[data-slot=select-item]:focus]:text-dashboard-white";

export const dashboardPopover =
	"border-dashboard-line rounded-[2px] bg-dashboard-night font-dashboard-body text-dashboard-white [&_button]:text-dashboard-white";

export const dashboardUtilityButton =
	"h-[34px] rounded-[2px] border-dashboard-line bg-transparent font-dashboard-code text-[10px] tracking-[0.06em] text-dashboard-white uppercase hover:bg-dashboard-panel hover:text-dashboard-night";

export const dashboardFilterForm =
	"mt-0 grid items-start gap-4 rounded-none border-0 p-[18px] [&_label]:font-dashboard-code [&_label]:text-[9px] [&_label]:tracking-[0.07em] [&_label]:text-dashboard-mist [&_label]:uppercase";

export const dashboardStickyColumn =
	"dashboard-sticky-column sticky left-0 z-12 min-w-[150px] bg-dashboard-night shadow-[10px_0_12px_-12px_rgba(0,0,0,0.95)]";

export const dashboardDataTag =
	"inline-flex w-fit items-center rounded-[2px] border border-dashboard-line bg-dashboard-ink px-[7px] py-1 font-dashboard-code text-[9px] font-medium tracking-[0.05em] text-dashboard-white uppercase";

export const dashboardDangerDataTag =
	"border-[color-mix(in_srgb,var(--color-dashboard-danger)_65%,transparent)] bg-[color-mix(in_srgb,var(--color-dashboard-danger)_12%,var(--color-dashboard-night))] text-dashboard-danger";

export const dashboardEmptyState =
	"flex min-h-[180px] items-center justify-center border border-dashboard-line bg-dashboard-ink font-dashboard-code text-[11px] tracking-[0.04em] text-dashboard-mist text-center";

export const dashboardRowAction =
	"rounded-[2px] border border-dashboard-line bg-transparent font-dashboard-code text-[9px] tracking-[0.04em] text-dashboard-white uppercase shadow-none hover:border-dashboard-mist hover:bg-dashboard-ink hover:text-dashboard-white focus-visible:border-dashboard-mist focus-visible:bg-dashboard-ink focus-visible:text-dashboard-white disabled:text-dashboard-mist disabled:opacity-40";

export const dashboardDetailSheet =
	"w-full max-w-[560px] p-[22px] [overscroll-behavior:contain] sm:max-w-[560px] max-[651px]:max-w-none max-[651px]:p-4";

export const dashboardDetailHeader =
	"sticky top-[-22px] z-2 -mx-[22px] -mt-[22px] border-b border-dashboard-line bg-dashboard-night p-[22px] max-[651px]:top-[-16px] max-[651px]:-mx-4 max-[651px]:-mt-4 max-[651px]:p-[18px_16px] [&_[data-slot=sheet-title]]:text-xl [&_[data-slot=sheet-title]]:font-semibold [&_[data-slot=sheet-title]]:tracking-[-0.01em] [&_[data-slot=sheet-title]]:text-dashboard-white [&_[data-slot=sheet-description]]:mt-[5px] [&_[data-slot=sheet-description]]:text-xs [&_[data-slot=sheet-description]]:leading-normal";

export const dashboardContent =
	"mt-7 text-dashboard-white [&>div]:text-dashboard-white [&_[data-slot=tabs-content]]:border-0 [&_[data-slot=tabs-content]]:bg-transparent [&_[data-slot=tabs-content]]:p-0 [&_[data-slot=tabs-content]]:text-dashboard-white [&_form]:bg-transparent [&_[data-slot=tabs-list]]:h-auto [&_[data-slot=tabs-list]]:gap-0 [&_[data-slot=tabs-list]]:rounded-[2px] [&_[data-slot=tabs-list]]:border [&_[data-slot=tabs-list]]:border-dashboard-line [&_[data-slot=tabs-list]]:bg-transparent [&_[data-slot=tabs-list]]:p-0 [&_[data-slot=tabs-trigger]]:min-h-[38px] [&_[data-slot=tabs-trigger]]:rounded-none [&_[data-slot=tabs-trigger]]:font-dashboard-code [&_[data-slot=tabs-trigger]]:text-[10px] [&_[data-slot=tabs-trigger]]:tracking-[0.06em] [&_[data-slot=tabs-trigger]]:text-dashboard-mist [&_[data-slot=tabs-trigger]]:uppercase [&_[data-slot=tabs-trigger][data-state=active]]:bg-dashboard-panel [&_[data-slot=tabs-trigger][data-state=active]]:text-dashboard-night [&_label]:font-dashboard-code [&_label]:text-[9px] [&_label]:tracking-[0.07em] [&_label]:text-dashboard-mist [&_label]:uppercase [&_[data-slot=form-label]]:font-dashboard-code [&_[data-slot=form-label]]:text-[9px] [&_[data-slot=form-label]]:tracking-[0.07em] [&_[data-slot=form-label]]:text-dashboard-mist [&_[data-slot=form-label]]:uppercase [&_input]:rounded-[2px] [&_input]:border-dashboard-line [&_input]:bg-dashboard-night [&_input]:text-dashboard-white [&_input]:shadow-none [&_[data-slot=select-trigger]]:rounded-[2px] [&_[data-slot=select-trigger]]:border-dashboard-line [&_[data-slot=select-trigger]]:bg-dashboard-night [&_[data-slot=select-trigger]]:text-dashboard-white [&_[data-slot=select-trigger]]:shadow-none [&_form_button[type=button]]:rounded-[2px] [&_form_button[type=button]]:border-dashboard-line [&_form_button[type=button]]:bg-dashboard-night [&_form_button[type=button]]:text-dashboard-white [&_form_button[type=button]]:shadow-none [&_form_button[type=submit]]:rounded-[2px] [&_form_button[type=submit]]:bg-dashboard-panel [&_form_button[type=submit]]:font-dashboard-code [&_form_button[type=submit]]:text-[10px] [&_form_button[type=submit]]:tracking-[0.06em] [&_form_button[type=submit]]:text-dashboard-night [&_form_button[type=submit]]:uppercase [&>div>button]:rounded-[2px] [&>div>button]:bg-dashboard-panel [&>div>button]:font-dashboard-code [&>div>button]:text-[10px] [&>div>button]:tracking-[0.06em] [&>div>button]:text-dashboard-night [&>div>button]:uppercase [&_table]:font-dashboard-code [&_table]:text-[11px] [&_table_thead]:bg-dashboard-ink [&_table_th]:h-10 [&_table_th]:border-dashboard-line [&_table_th]:text-[9px] [&_table_th]:tracking-[0.06em] [&_table_th]:text-dashboard-mist [&_table_th]:uppercase [&_table_td]:h-[54px] [&_table_td]:border-dashboard-line [&_table_td]:text-dashboard-white [&_table_tr]:border-dashboard-line [&_table_tbody_tr:hover]:bg-dashboard-ink [&_table_button]:rounded-[2px] [&_table_button]:border-dashboard-line [&_table_button]:font-dashboard-code [&_table_button]:text-[9px] [&_table_button]:tracking-[0.04em] [&_table_button]:text-inherit [&_table_button]:uppercase [&_table_button:disabled]:text-dashboard-mist [&_table_button:disabled]:opacity-40 [&_.bg-white]:bg-transparent [&_.text-red-500]:text-dashboard-danger [&_.text-primary]:text-dashboard-mist [&_.text-muted-foreground]:text-dashboard-mist";
