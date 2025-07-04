import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/utils";
import userEvent from "@testing-library/user-event";
import AttendanceCard from "./AttendanceCard";

describe("AttendanceCard", () => {
  it("renders attendance question and buttons", () => {
    render(<AttendanceCard />);
    
    expect(screen.getByText("Are you going?")).toBeInTheDocument();
    expect(screen.getByText("Please confirm your attendance for the Red Rock climbing trip")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /yes/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /maybe/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /no/i })).toBeInTheDocument();
  });

  it("highlights selected button when clicked", async () => {
    const user = userEvent.setup();
    render(<AttendanceCard />);
    
    const yesButton = screen.getByRole("button", { name: /yes/i });
    const maybeButton = screen.getByRole("button", { name: /maybe/i });
    const noButton = screen.getByRole("button", { name: /no/i });
    
    // Click Yes button
    await user.click(yesButton);
    expect(yesButton.className).toMatch(/selected/);
    expect(maybeButton.className).not.toMatch(/selected/);
    expect(noButton.className).not.toMatch(/selected/);
    
    // Click Maybe button
    await user.click(maybeButton);
    expect(yesButton.className).not.toMatch(/selected/);
    expect(maybeButton.className).toMatch(/selected/);
    expect(noButton.className).not.toMatch(/selected/);
    
    // Click No button
    await user.click(noButton);
    expect(yesButton.className).not.toMatch(/selected/);
    expect(maybeButton.className).not.toMatch(/selected/);
    expect(noButton.className).toMatch(/selected/);
  });

  it("displays icons and labels correctly", () => {
    render(<AttendanceCard />);
    
    expect(screen.getByText("✓")).toBeInTheDocument();
    expect(screen.getByText("⏰")).toBeInTheDocument();
    expect(screen.getByText("✕")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("Maybe")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });
});