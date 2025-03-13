"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import DashboardIcon from "./icons/DashboardIcon";
import Client from "./icons/ClientIcon";
import Projects from "./icons/Projects";
import Invoice from "./icons/Invoice";
import { Session } from "next-auth";

export function AppSidebar({ session }: { session: Session }) {
  const links = [
    {
      label: "Dashboard",
      href: "/console/dashboard",
      icon: <DashboardIcon className="stroke-purple-950 size-7" />,
    },
    {
      label: "Clients",
      href: "/console/clients",
      icon: <Client className="stroke-purple-950 size-7" />,
    },
    {
      label: "Projects",
      href: "/console/projects",
      icon: <Projects className="stroke-purple-950 size-7" />,
    },
    {
      label: "Invoice",
      href: "invoices",
      icon: <Invoice className="stroke-purple-950 size-7" />,
    },
  ];
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div key={idx} onClick={() => setActiveTab(idx)}>
                  <SidebarLink link={link} activeTab={activeTab} index={idx} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: session?.user?.name as string,
                href: "#",
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/console"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src={"/logo-secondary.svg"}
        alt="Logo of Invoyce"
        width={50}
        height={50}
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl text-[#AD46FF] font-bold"
      >
        Invoyce
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link href="/console" className=" relative z-20">
      <Image
        src={"/logo-secondary.svg"}
        alt="Logo of Invoyce"
        width={50}
        height={50}
        className="size-7"
      />
    </Link>
  );
};
