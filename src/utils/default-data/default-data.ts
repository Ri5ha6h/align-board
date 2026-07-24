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

const year = [
	{
		label: "2024",
		value: "2024",
	},
	{
		label: "2025",
		value: "2025",
	},
	{
		label: "2026",
		value: "2026",
	},
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

export const getYearList = () => {
	return year;
};
