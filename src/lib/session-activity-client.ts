"use client";

type ResumeSessionActivity = () => void;
type PrepareSessionLogout = () => Promise<ResumeSessionActivity>;

let prepareSessionLogoutHandler: PrepareSessionLogout | null = null;

export const registerSessionLogoutPreparation = (handler: PrepareSessionLogout) => {
	prepareSessionLogoutHandler = handler;

	return () => {
		if (prepareSessionLogoutHandler === handler) {
			prepareSessionLogoutHandler = null;
		}
	};
};

export const prepareSessionLogout = async (): Promise<ResumeSessionActivity> => {
	if (!prepareSessionLogoutHandler) {
		return () => undefined;
	}

	return prepareSessionLogoutHandler();
};
