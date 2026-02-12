import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { StorageEnum } from "@/framework/types/enum";
import type { BaseUserInfo, UserToken } from "../types/entity";
import { createZustandStorage } from "@/framework/utils/storage";

export type UserStoreState<T extends BaseUserInfo> = {
	userInfo: T | null;
	userToken: UserToken | null;
	actions: {
		setUserInfo: (userInfo: T | null) => void;
		setUserToken: (token: UserToken | null) => void;
		clearUserInfoAndToken: () => void;
	};
};

/**
 * Factory to create a user store for a specific app.
 */
export const createUserStore = <T extends BaseUserInfo>() => {
	return create<UserStoreState<T>>()(
		persist(
			(set) => ({
				userInfo: null,
				userToken: null,
				actions: {
					setUserInfo: (userInfo) => set({ userInfo }),
					setUserToken: (userToken) => set({ userToken }),
					clearUserInfoAndToken: () => set({ userInfo: null, userToken: null }),
				},
			}),
			{
				name: StorageEnum.UserInfo, // The storage key will be namespaced by the storage engine
				storage: createJSONStorage(() => createZustandStorage()),
				partialize: (state) => ({
					[StorageEnum.UserInfo]: state.userInfo,
					[StorageEnum.UserToken]: state.userToken,
				}),
			},
		),
	);
};
