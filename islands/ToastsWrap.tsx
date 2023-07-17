import { Toast } from "../types/Toast.type.ts";
import { MutableRef, useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Styles } from "../consts/Styles.ts";

interface Props {
  toasts: Toast[];
}
export default function ToastsWrap({ toasts = [] }: Props) {
  return (
    <div class="absolute bottom-0 left-0 w-full flex flex-col">
      {toasts.map((t) => <Toast t={t} />)}
    </div>
  );
}

function Toast({ t }: { t: Toast }) {
  const toastRef = useRef() as MutableRef<HTMLElement>;
  const interval = useSignal(5000);
  const percentage = useSignal(100);
  const toastClass = Styles[t.type];
  const removeToast = () => {
    toastRef.current?.remove();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      interval.value -= 10;
      percentage.value = (interval.value * 100) / 5000;
      if (interval.value < 10) {
        removeToast();
        clearInterval(timer);
      }
    }, 10);
    return () => clearInterval(timer);
  }, []);

  return (
    <article
      class={`toast bg-${toastClass} w-96 py-2 my-4 mx-auto flex flex-col gap-4`}
      ref={toastRef}
    >
      <small class="text-center">{t.message}</small>
      <div class="custom-progress-bar">
        <span></span>
      </div>
    </article>
  );
}
