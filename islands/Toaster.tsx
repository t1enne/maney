// interface ToastProps {
//   type?: "warn" | "danger";
//   text: string;
// }

export default function () {
  // const toasts = useSignal<ToastProps[]>([]);
  return <div id="toaster" class="absolute bottom-0 h-48 w-full"></div>;
}
