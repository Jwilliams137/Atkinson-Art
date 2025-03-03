import React from 'react';
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "../src/app/page"; // Adjust this path if needed

test("renders homepage without crashing", () => {
  render(<HomePage />);
  
  // Query the gallery container using getByTestId
  const galleryContainer = screen.getByTestId("gallery-container");
  
  // Assert that the gallery container is in the document
  expect(galleryContainer).toBeInTheDocument();
});
