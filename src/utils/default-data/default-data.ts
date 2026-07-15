import { airCarriers } from "./air-data";
import { freightCarriers, loadCarriers } from "./freight-load-data";
import { oceanCarriers } from "./ocean-data";
import { roadCarriers } from "./road-data";
import { terminalCarriers } from "./terminal-data";

// carriers list
const intermodalCarriers = [
	{ value: "BERTSCHI", label: "BERTSCHI" },
	{ value: "BERTSCHI-AG", label: "BERTSCHI-AG" },
	{ value: "NORDIC-BULKERS", label: "NORDIC-BULKERS" },
];

const oceanQueue = [
	{
		label: "Normal",
		value: "NORMAL",
	},
	{
		label: "Adaptive",
		value: "ADAPTIVE",
	},
	{
		label: "Reference Not Found",
		value: "RNF",
	},
];

const commonQueue = [
	{
		label: "Normal",
		value: "NORMAL",
	},
	{
		label: "Reference Not Found",
		value: "RNF",
	},
];

const loadQueue = [
	{
		label: "Normal",
		value: "NORMAL",
	},
];

const oceanRefType = [
	{
		label: "Booking",
		value: "BOOKING",
	},
	{
		label: "BillOfLading",
		value: "BILLOFLADING",
	},
	{
		label: "Container",
		value: "CONTAINER",
	},
];

const airRefType = [
	{
		label: "AWB",
		value: "AWB",
	},
];

const terminalRefType = [
	{
		label: "Import",
		value: "IMPORT",
	},
	{
		label: "Export",
		value: "EXPORT",
	},
];

const roadRefType = [
	{
		label: "LTL",
		value: "LTL",
	},
	{
		label: "FTL",
		value: "FTL",
	},
];

const interRefType = [
	{
		label: "INTMD",
		value: "INTMD",
	},
];

const freightRefType = [
	{
		label: "HAWB",
		value: "HAWB",
	},
];

const loadRefType = [
	{
		label: "LOAD",
		value: "LOAD",
	},
];

const historyType = [
	{
		label: "ALL",
		value: "ALL",
	},
	{
		label: "DIFF",
		value: "DIFF",
	},
];

const months = [
	{
		label: "January",
		value: "January",
	},
	{
		label: "February",
		value: "February",
	},
	{
		label: "March",
		value: "March",
	},
	{
		label: "April",
		value: "April",
	},
	{
		label: "May",
		value: "May",
	},
	{
		label: "June",
		value: "June",
	},
	{
		label: "July",
		value: "July",
	},
	{
		label: "August",
		value: "August",
	},
	{
		label: "September",
		value: "September",
	},
	{
		label: "October",
		value: "October",
	},
	{
		label: "November",
		value: "November",
	},
	{
		label: "December",
		value: "December",
	},
];

const year = [
	{
		label: "2024",
		value: "2024",
	},
	{
		label: "2025",
		value: "2025",
	},
];

const days = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
	27, 28, 29, 30, 31,
];

export const getCarriersList = (mode: string) => {
	return mode === "air"
		? airCarriers
		: mode === "ocean"
			? oceanCarriers
			: mode === "terminal"
				? terminalCarriers
				: mode === "road"
					? roadCarriers
					: mode === "intermodal"
						? intermodalCarriers
						: mode === "freight"
							? freightCarriers
							: mode === "load"
								? loadCarriers
								: [];
};

export const getQueueList = (mode: string) => {
	return mode === "ocean" ? oceanQueue : mode === "load" ? loadQueue : commonQueue;
};

export const getHistoryType = () => {
	return historyType;
};

export const getRefList = (mode: string) => {
	return mode === "air"
		? airRefType
		: mode === "ocean"
			? oceanRefType
			: mode === "terminal"
				? terminalRefType
				: mode === "road"
					? roadRefType
					: mode === "intermodal"
						? interRefType
						: mode === "freight"
							? freightRefType
							: loadRefType;
};

export const getMonthList = (year: string) => {
	const currentYear = new Date().getFullYear().toString();
	const currentMonth = new Date().getMonth();
	const includeCurrentMonth = new Date().getDate() >= 2;

	if (year === currentYear) {
		return includeCurrentMonth
			? months.slice(0, currentMonth + 1)
			: months.slice(0, currentMonth);
	}

	return months;
};

export const getYearList = () => {
	return year;
};

export const getDaysList = () => {
	return days;
};
