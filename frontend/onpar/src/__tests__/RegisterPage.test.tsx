import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../pages/RegisterPage";
import { BrowserRouter } from "react-router";

jest.mock("../api/auth.js", () => ({
    registerUser: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

//@ts-ignore
import { registerUser } from "../api/auth.js";

beforeEach(() => {
  jest.clearAllMocks(); 
});

const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

test("submits valid form and navigates to register-success", async () => {
    (registerUser as jest.Mock).mockResolvedValueOnce({});

    renderWithRouter(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("Enter firstName..."), {
        target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter lastName..."), {
        target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter email..."), {
        target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password..."), {
        target: { value: "TestingTesting123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
        expect(registerUser).toHaveBeenCalledWith({
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            password: "TestingTesting123!",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/register-success", {
            state: { email: "john@example.com" },
        });
    });
});

test("does not submit form when required fields are missing", async () => {
    renderWithRouter(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("Enter firstName..."), {
        target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter lastName..."), {
        target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter email..."), {
        target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password..."), {
        target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
        expect(registerUser).not.toHaveBeenCalled();
    });
});