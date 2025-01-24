import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function signJwt(userId: string | undefined | (() => string)): string {
	const currentTime = Math.floor(Date.now() / 1000);

	return jwt.sign(
		{
			sub: userId,
			iat: currentTime,
			exp: currentTime + (60 * 60 * 24 * 7), // 1 week from now
		},
		process.env.SIGNING_KEY?.replaceAll("\\n", "\n") ?? "",
		{
			algorithm: "RS256",
		},
	);
}

export function verifyUser(headers: NextRequest["headers"]): string | undefined | (() => string) {
	let user: string | undefined | (() => string) = undefined;

	if (headers.get("authorization")) {
		const token = headers.get("authorization")?.split(" ")[1];
		const verified = jwt.verify(token ?? "", process.env.SIGNING_KEY?.replaceAll("\\n", "\n") ?? "");
		user = verified.sub;
	}
	console.log("logged in user: " + user);
	if (typeof (user) === "string" && user.split("@")[1] !== (process.env.NEXT_PUBLIC_AUTHORIZED_DOMAIN ?? "useparagon.com")) {
		return "";
	}
	return user;
}
