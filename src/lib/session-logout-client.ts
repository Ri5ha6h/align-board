"use client";

let logoutQuarantined = false;

export const markSessionLogoutQuarantined = () => {
	logoutQuarantined = true;
};

export const isSessionLogoutQuarantined = () => logoutQuarantined;
