import { useEffect } from "preact/hooks";

export default () => {
  let form: HTMLFormElement;
  let methodInput: HTMLInputElement;
  let dialog: HTMLDialogElement;

  useEffect(() => {
    form = document.querySelector("form")!;
    methodInput = document.querySelector("input[name='_method']")!;
  }, []);

  const toggleDialog = () => {
    dialog = document.querySelector("dialog")!;
    if (dialog.getAttributeNames().includes("open")) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  };

  const sendDelete = () => {
    methodInput.value = "DELETE";
    form.submit();
  };

  return (
    <>
      <dialog>
        <article class="w-full md:w-2/3">
          <header>Confirm deletion</header>
          <p class="my-12">Are you sure?</p>
          <footer>
            <button class="secondary" onClick={toggleDialog}>
              Cancel
            </button>
            <button onClick={sendDelete}>Confirm</button>
          </footer>
        </article>
      </dialog>
      <button
        class="outline w-full text-red-500 border-red-500"
        onClick={toggleDialog}
      >
        Delete
      </button>
    </>
  );
};
