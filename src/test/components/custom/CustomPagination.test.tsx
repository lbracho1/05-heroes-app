import type { PropsWithChildren } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { MemoryRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, ...props }: PropsWithChildren) => (
        <button {...props}>{children}</button>
    ),
}));

const renderWithRouter = (
    component: React.ReactElement,
    initialEntries?: string[]
) => {
    return render(<MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>)
};

describe('CustomPagination', () => {

    test('should render component with default values', () => {
        renderWithRouter(<CustomPagination totalPages={6} />)

        expect(screen.getByText('Anteriores')).toBeDefined();
        expect(screen.getByText('Siguientes')).toBeDefined();

        expect(screen.getByText('1')).toBeDefined();
        expect(screen.getByText('2')).toBeDefined();
        expect(screen.getByText('3')).toBeDefined();
        expect(screen.getByText('4')).toBeDefined();
        expect(screen.getByText('5')).toBeDefined();
        expect(screen.getByText('6')).toBeDefined();
    });

    test('should disabled previous button when page is 1 ', () => {
        renderWithRouter(<CustomPagination totalPages={6} />)

        const previousButton = screen.getByText('Anteriores');

        expect(previousButton.getAttributeNames()).toContain('disabled');

    });

    test('should disabled next button when we are in the last page ', () => {
        renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=5'])

        const nextButton = screen.getByText('Siguientes');

        expect(nextButton.getAttributeNames()).toContain('disabled');

    });


    test('should disabled button 3 when we are in page 3', () => {
        renderWithRouter(<CustomPagination totalPages={10} />, ['/?page=3'])

        const Button2 = screen.getByText('2');
        const Button3 = screen.getByText('3');

        expect(Button2.getAttribute('variant')).toBe('outline')
        expect(Button3.getAttribute('variant')).toBe('default')
    });

    test('should change page when click on numbre button', () => {
        renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=3'])

        const Button2 = screen.getByText('2');
        const Button3 = screen.getByText('3');

        expect(Button2.getAttribute('variant')).toBe('outline')
        expect(Button3.getAttribute('variant')).toBe('default')

        fireEvent.click(Button2);

        expect(Button2.getAttribute('variant')).toBe('default')
        expect(Button3.getAttribute('variant')).toBe('outline')

    });
});