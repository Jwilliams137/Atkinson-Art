jest.mock("../../src/data/admin.json", () => ({
    sections: [
        { key: "home", label: "Home" },
        { key: "gallery", label: "Gallery" },
        { key: "settings", label: "Settings" },
    ],
}));


import { render, screen, fireEvent } from "@testing-library/react";
import AdminSidebar from "../../src/components/AdminSidebar/AdminSidebar";
import "@testing-library/jest-dom";

const mockSidebarData = {
    sections: [
        { key: "home", label: "Home" },
        { key: "gallery", label: "Gallery" },
        { key: "settings", label: "Settings" },
    ],
};

describe("AdminSidebar", () => {
    const mockSetActiveSection = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test("renders sidebar sections correctly", () => {
        render(<AdminSidebar setActiveSection={mockSetActiveSection} />);
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Gallery")).toBeInTheDocument();
        expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    test("applies active class to the correct section", () => {
        render(<AdminSidebar setActiveSection={mockSetActiveSection} />);
        const homeItem = screen.getByText("Home");
        expect(homeItem).toHaveClass("active");
    });

    test("clicking on a section updates active section and calls setActiveSection", () => {
        render(<AdminSidebar setActiveSection={mockSetActiveSection} />);
        const galleryItem = screen.getByText("Gallery");
        fireEvent.click(galleryItem);

        expect(galleryItem).toHaveClass("active");
        expect(mockSetActiveSection).toHaveBeenCalledWith("gallery");
    });

    test("reads from localStorage on mount", () => {
        localStorage.setItem("activeSection", "settings");
        render(<AdminSidebar setActiveSection={mockSetActiveSection} />);
        const settingsItem = screen.getByText("Settings");

        expect(settingsItem).toHaveClass("active");
    });

    test("updates localStorage on section click", () => {
        render(<AdminSidebar setActiveSection={mockSetActiveSection} />);
        const galleryItem = screen.getByText("Gallery");
        fireEvent.click(galleryItem);

        expect(localStorage.getItem("activeSection")).toBe("gallery");
    });

    test("has appropriate aria roles and labels", () => {
        render(<AdminSidebar setActiveSection={mockSetActiveSection} />);
        expect(screen.getByRole("navigation", { name: /admin sidebar/i })).toBeInTheDocument();
    });

});