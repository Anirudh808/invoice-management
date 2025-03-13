"use client";

import MainLoader from "@/components/ui/MainLoader";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  return <Move />;
};

const Move = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/console/dashboard");
    }, 2000);
  }, [router]);
  return (
    <div>
      <MainLoader />
    </div>
  );
};

export default page;
