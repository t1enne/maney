import { Toast } from "../types/Toast.type.ts";

export class Toaster {
  static toasts: Toast[] = [];

  static showToast({ message, type = "positive" }: Toast) {
    const toast = { message, type };
    Toaster.toasts.push(toast);
    setTimeout(() => {
      Toaster.toasts = Toaster.toasts.filter((t) => t !== toast);
    }, 1000);
  }
}
