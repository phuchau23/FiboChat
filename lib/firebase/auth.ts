/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithRedirect,
  getRedirectResult,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account" // chọn tài khoản, không auto login
});

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return await extract(result);

  } catch (error: any) {

    // User tự đóng popup → không coi là lỗi → trả về null
    if (error.code === "auth/popup-closed-by-user") {
      return null;
    }

    //  Popup bị chặn (Safari, iOS, cài extension...) → redirect fallback
    if (error.code === "auth/popup-blocked") {
      await signInWithRedirect(auth, provider);
      return null;
    }

    // Lỗi thật → throw để xử lý ở tầng trên
    throw error;
  }
};

// fallback redirect
export const handleGoogleRedirectResult = async () => {
  const result = await getRedirectResult(auth);
  return result ? await extract(result) : null;
};

// Data chuẩn trả về
const extract = async (result: any) => {
  const idToken = await result.user.getIdToken();
  return {
    idToken,
    user: {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    },
    extra: getAdditionalUserInfo(result),
  };
};
