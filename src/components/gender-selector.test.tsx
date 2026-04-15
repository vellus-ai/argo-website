import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenderSelector } from "./gender-selector";

const defaultOptions = [
  { value: "male", label: "Captain (he/him)" },
  { value: "female", label: "Captain (she/her)" },
  { value: "other", label: "Captain (they/them)" },
];

describe("GenderSelector", () => {
  it("should render all 3 radio options", () => {
    render(
      <GenderSelector
        label="How should we address you?"
        options={defaultOptions}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText("How should we address you?")).toBeInTheDocument();
    expect(screen.getByLabelText("Captain (he/him)")).toBeInTheDocument();
    expect(screen.getByLabelText("Captain (she/her)")).toBeInTheDocument();
    expect(screen.getByLabelText("Captain (they/them)")).toBeInTheDocument();
  });

  it("should render radio inputs with correct values", () => {
    render(
      <GenderSelector
        label="How should we address you?"
        options={defaultOptions}
        value=""
        onChange={() => {}}
      />
    );

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios[0]).toHaveAttribute("value", "male");
    expect(radios[1]).toHaveAttribute("value", "female");
    expect(radios[2]).toHaveAttribute("value", "other");
  });

  it("should show no option selected when value is empty", () => {
    render(
      <GenderSelector
        label="Gender"
        options={defaultOptions}
        value=""
        onChange={() => {}}
      />
    );

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).not.toBeChecked();
    });
  });

  it("should show the correct option as checked when value is set", () => {
    render(
      <GenderSelector
        label="Gender"
        options={defaultOptions}
        value="female"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Captain (he/him)")).not.toBeChecked();
    expect(screen.getByLabelText("Captain (she/her)")).toBeChecked();
    expect(screen.getByLabelText("Captain (they/them)")).not.toBeChecked();
  });

  it("should call onChange with selected value when clicking an option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <GenderSelector
        label="Gender"
        options={defaultOptions}
        value=""
        onChange={onChange}
      />
    );

    await user.click(screen.getByLabelText("Captain (they/them)"));

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith("other");
  });

  it("should call onChange when switching between options", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <GenderSelector
        label="Gender"
        options={defaultOptions}
        value="male"
        onChange={onChange}
      />
    );

    await user.click(screen.getByLabelText("Captain (she/her)"));

    expect(onChange).toHaveBeenCalledWith("female");
  });

  it("should use name='gender' for radio group", () => {
    render(
      <GenderSelector
        label="Gender"
        options={defaultOptions}
        value=""
        onChange={() => {}}
      />
    );

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute("name", "gender");
    });
  });
});
