// ************* param types start ****************

export type ParamType = {
	mode: string;
	env: string;
	dash: string;
};

// ************* param types end ****************

// ************* auth types start ****************

export type AuthType = {
	username: string;
	password: string;
};

// ************* auth types end ****************

// ************* dashboard types start ****************

// status related types
export type StatusColumnType = {
	statusKey: string;
	value: StatusValue;
	created_at: string | number;
	modified_at: string | number;
};

export type StatusValue = {
	statusKey: string;
	carrier: string;
	status: string;
	statusType: string;
	issue: string;
	impact: string;
	jiraLink: string;
	expectedResolutionDate: string;
	resolution: string;
	closedAt: string;
};

export type StatusValueInternal = {
	type: string;
	env: string;
	mode: string;
	statusKey: string;
	carrier: string;
	status: string;
	statusType: string;
	issue: string;
	impact: string;
	jiraLink: string;
	expectedResolutionDate: string;
	resolution: string;
};

// summary related types

export type SummaryType = {
	key: React.Key;
	jtCarrierCode: string;
	total_shipments: number;
	jtCrawledTotal: number;
	successCount: number;
	failCount: number;
	getTotalDiffFound: number;
	getTotalNODiffFound: number;
	getSentToFK: number;
	getNotSentToFK: number;
	getReferenceNotFound: number;
	getReferenceNotFoundPercentage: number;
	skipped404: number;
	successRatio: number;
	failureRatio: number;
	diffRatio: number;
	start_time: string;
	end_time: string;
	durationToLaunch: number;
	schedulerId: number;
	timeDiffMinutes: number;
	timeDiffInFk: string;
	lastRunStartAt: string;
	delayTime: number;
	lastRunStartTime: string;
	threadPoolSize: number;
	deliverCount: number;
	closeCount: number;
	queueType: string;
	hitRateCount: number;
	hitRatePer: number;
	toFKFailedScraping: number;
	toFKFailedValidation: number;
	toFKFailedNotSent: number;
	toFKFailedMapping: number;
	crawlFrequency: string;
	referenceNotFound: number;
	refPercentage: number;
	diffRateCountWithInCron: number;
	diffRateCountAboveCron: number;
	diffHitRateCountWithInCron: number;
	diffHitRateCountAboveCron: number;
	AvgAge: number;
};

// history related types

export type HistoryType = {
	k: string;
	v: InnerValue;
};

type InnerValue = {
	error: string;
	errorMsg: ErrorMsg;
	failures: string;
	errorCode: string;
	QueueName: string;
	transactionId: string;
	apiHitCount: string;
	crawl_status: string;
	insertion_time: string;
	jtLatencyInMinutes: string;
	ageDifferenceInDays: string;
	crawledJsonResourceId: string;
	fkMappedJsonResourceId: string;
	latestFKMappedJsonResourceId: string;
};

type ErrorMsg = {
	ip: string;
	host: string;
	error: string;
	errorHtml: null;
	errorScreenshot: null;
};

// latency related types
export type LatencyTableType = {
	carrier: string;
	queue: string;
	refType: string;
	first: number;
	second: number;
	third: number;
	fourth: number;
	fifth: number;
	sixth: number;
	seventh: number;
	eight: number;
	ninth: number;
	tenth: number;
};

// reference related types
export type ReferenceTableType = {
	subscriptionId: string;
	carrier: string;
	referenceNumber: string;
	referenceType: string;
	createdAt: string;
	updatedAt: string;
	lastCrawledAt: string;
	queue: string;
	status: string;
	error: string;
};

// induced related types
export type InducedChartType = {
	date: string;
} & Record<string, string | number | null | undefined>;

// ************* dashboard types end ****************
