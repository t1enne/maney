import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Categories } from "../consts/Categories.ts";
import { Movement } from "../types/Movement.type.ts";

interface Props {
  type: keyof typeof Categories;
  movement?: Movement;
}
export default function ({ movement, type }: Props) {
  let typeInputs: HTMLInputElement[];
  const dynamicType = useSignal(type);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    switch (target.getAttribute("id")) {
      case "expense":
        dynamicType.value = "expense";
        break;
      case "gain":
        dynamicType.value = "gain";
        break;
    }
  };

  useEffect(() => {
    typeInputs = Array.from(document.querySelectorAll('input[name="type"]')!);
    console.log({ typeInputs });
    for (const input of typeInputs) {
      input?.addEventListener("change", handleChange);
    }

    return () => {
      for (const input of typeInputs) {
        input?.addEventListener("change", handleChange);
      }
    };
  }, []);
  const capType = dynamicType.value[0].toUpperCase() +
    dynamicType.value.slice(1);
  return (
    <>
      <option value="" disabled selected>
        {capType}
      </option>
      {Categories[dynamicType.value].map((category) => (
        <option selected={category === movement?.category} value={category}>
          {category}
        </option>
      ))}
    </>
  );
}
