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
    // ✅ tránh tự login acc cũ
    await signOut(auth);

    const result = await signInWithPopup(auth, provider);
    return await extract(result);
  } catch (error: any) {
    // ✅ fallback nếu popup bị chặn
    if (error.code === "auth/popup-blocked") {
      await signInWithRedirect(auth, provider);
      return null;
    }
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
