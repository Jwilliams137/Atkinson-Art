import { render, screen } from "@testing-library/react";
import AdminNotes from "../../src/components/AdminNotes/AdminNotes";
import "@testing-library/jest-dom";

describe("AdminNotes", () => {
  test("renders notes when available", () => {
    const fieldsForPage = {
      gallery: [
        { notes: "Note 1" },
        { notes: "Note 2" },
      ],
    };

    render(<AdminNotes section="gallery" fieldsForPage={fieldsForPage} />);

    expect(screen.getByText("Note 1")).toBeInTheDocument();
    expect(screen.getByText("Note 2")).toBeInTheDocument();
  });

  test("renders nothing when no notes are present", () => {
    const fieldsForPage = {
      gallery: [
        { notes: "" },
        { notes: null },
      ],
    };

    const { container } = render(<AdminNotes section="gallery" fieldsForPage={fieldsForPage} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders nothing if section is missing or invalid", () => {
    const fieldsForPage = {};
    const { container } = render(<AdminNotes section="nonExistent" fieldsForPage={fieldsForPage} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders nothing if fieldsForPage is missing", () => {
    const { container } = render(<AdminNotes section="gallery" fieldsForPage={null} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders nothing if section is not provided", () => {
    const fieldsForPage = { gallery: [{ notes: "Note 1" }] };
    const { container } = render(<AdminNotes fieldsForPage={fieldsForPage} />);
    expect(container.firstChild).toBeNull();
  });
});