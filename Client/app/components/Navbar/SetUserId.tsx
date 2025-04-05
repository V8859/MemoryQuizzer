"use client";
import { useEffect } from "react";
const SetUserId = ({
  userId,
  remove,
}: {
  userId: string | null;
  remove: boolean;
}) => {
  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
      // console.log("User ID stored in localStorage:", userId);
    }
    if (remove) {
      if (localStorage.getItem("userId")) {
        localStorage.removeItem("userId");
      }
    }
  }, [userId, remove]);

  return null;
};

export default SetUserId;
