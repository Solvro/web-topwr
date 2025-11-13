import { getAuthStateNode } from "@/features/authentication/node";

export const getAccessToken = () => getAuthStateNode()?.accessToken;
