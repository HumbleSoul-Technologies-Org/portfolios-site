"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteSystemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => Promise<void>;
  isDeleting: boolean;
}

export function DeleteSystemDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteSystemDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [isCounting, setIsCounting] = useState(false);

  const statusColor = useMemo(() => {
    switch (countdown) {
      case 5:
        return "emerald-500";
      case 4:
        return "lime-500";
      case 3:
        return "amber-500";
      case 2:
        return "orange-500";
      case 1:
        return "rose-500";
      default:
        return "red-700";
    }
  }, [countdown]);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setError("");
      setCountdown(5);
      setIsCounting(false);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!isCounting) {
      return;
    }

    if (countdown <= 0) {
      void onConfirm(password);
      setIsCounting(false);
      return;
    }

    const interval = setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => clearTimeout(interval);
  }, [countdown, isCounting, onConfirm]);

  const handleStart = () => {
    if (password.trim().length === 0) {
      setError("Please enter the admin password to continue.");
      return;
    }

    if (!password || password.trim() === "" || password.length < 8) {
      setError("Incorrect admin password.");
      return;
    }

    setError("");
    setIsCounting(true);
  };

  const handleCancel = () => {
    setPassword("");
    setError("");
    setCountdown(5);
    setIsCounting(false);
    onOpenChange(false);
  };

  const progressValue = Math.max(0, Math.min(5, countdown));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Deleting a system profile is permanent. Enter the admin password and
            wait for the timer to reach zero to confirm.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              disabled={isCounting || isDeleting}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter your admin password to begin the delete countdown.
              </p>
            )}
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Countdown</span>
              <span className={`text-${statusColor} text-2xl`}>
                {countdown}
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full bg-${statusColor} transition-all duration-300`}
                style={{ width: `${(progressValue / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleStart}
            disabled={isCounting || isDeleting}
          >
            {isCounting ? "Deleting..." : "Start Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
