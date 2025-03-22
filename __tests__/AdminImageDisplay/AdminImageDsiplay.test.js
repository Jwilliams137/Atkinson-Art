import { render, screen, fireEvent, act } from "@testing-library/react";
import { writeBatch } from "firebase/firestore";
import { waitFor } from "@testing-library/react";
import AdminImageDisplay from "../../src/components/AdminImageDisplay/AdminImageDisplay";
import "@testing-library/jest-dom";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  writeBatch: jest.fn(() => ({
    update: jest.fn(),
    commit: jest.fn(),
  })),
  doc: jest.fn(),
}));

const mockSetImages = jest.fn();
const mockImages = [
  { id: "1", imageUrl: "/img1.jpg", title: "Image 1", order: 0, color: "red" },
  { id: "2", imageUrl: "/img2.jpg", title: "Image 2", order: 1, color: "blue" },
];

describe("AdminImageDisplay", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  test("renders images correctly", () => {
    render(<AdminImageDisplay images={mockImages} setImages={mockSetImages} isAdmin={true} activeSection="gallery" />);
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
    expect(screen.getByAltText("Image 2")).toBeInTheDocument();
    expect(screen.getByText("Image 1")).toBeInTheDocument();
    expect(screen.getByText("Image 2")).toBeInTheDocument();
  });

  test("admin sees delete button", () => {
    render(<AdminImageDisplay images={mockImages} setImages={mockSetImages} isAdmin={true} activeSection="gallery" />);
    expect(screen.getAllByText("Delete").length).toBe(2);
  });

  test("non-admin does not see delete button", () => {
    render(<AdminImageDisplay images={mockImages} setImages={mockSetImages} isAdmin={false} activeSection="gallery" />);
    expect(screen.queryAllByText("Delete")).toHaveLength(0);
  });  

  test("calls setImages after deleting an image", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  
    render(<AdminImageDisplay images={mockImages} setImages={mockSetImages} isAdmin={true} activeSection="gallery" />);
  
    const deleteButton = screen.getAllByText("Delete")[0];
    
    await act(async () => {
      fireEvent.click(deleteButton);
    });
  
    expect(fetch).toHaveBeenCalledWith("/api/delete-image", expect.any(Object));
    
    await waitFor(() => {
      expect(mockSetImages).toHaveBeenCalledWith([mockImages[1]]);
    });
  });

  test("moves image up when reorder button is clicked", async () => {
    const mockBatch = {
      update: jest.fn(),
      commit: jest.fn(),
    };
    writeBatch.mockReturnValue(mockBatch);

    render(<AdminImageDisplay images={mockImages} setImages={mockSetImages} isAdmin={true} activeSection="gallery" />);

    const moveUpButton = screen.getAllByText("▲")[0];
    fireEvent.click(moveUpButton);

    expect(mockSetImages).toHaveBeenCalled();
    expect(writeBatch).toHaveBeenCalled();
    expect(mockBatch.update).toHaveBeenCalledTimes(2);
    expect(mockBatch.commit).toHaveBeenCalled();
  });

  test("logs an error when delete fails", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({ error: "Delete failed" }) }));
    console.error = jest.fn();
  
    render(<AdminImageDisplay images={mockImages} setImages={mockSetImages} isAdmin={true} activeSection="gallery" />);
  
    const deleteButton = screen.getAllByText("Delete")[0];
  
    await act(async () => {
      fireEvent.click(deleteButton);
    });
  
    expect(console.error).toHaveBeenCalledWith("Error deleting image:", { error: "Delete failed" });
  });

});