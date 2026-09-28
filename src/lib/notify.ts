import Swal from "sweetalert2";

const toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (el) => {
    el.addEventListener("mouseenter", Swal.stopTimer);
    el.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export function notifySuccess(message: string) {
  return toast.fire({ icon: "success", title: message });
}

export function notifyError(message: string) {
  return toast.fire({ icon: "error", title: message });
}
