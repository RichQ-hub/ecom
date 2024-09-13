import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom';
import SelectFrameworkModal from '../../components/SelectFrameworkModal';
import { FrameworkDetails } from '../../types/framework';

const MOCK_FRAMEWORKS: FrameworkDetails[] = [
  {
    framework_id: '1',
    name: 'Frame 1',
    type: 'SAVED'
  },
  {
    framework_id: '2',
    name: 'Frame 2',
    type: 'SAVED'
  },
  {
    framework_id: '3',
    name: 'Frame 3',
    type: 'SAVED'
  },
]

// We mock the framework service file.
vi.mock('../../services/FrameworkService', () => {
  return {
    default: {
      searchFrameworks: vi.fn(() => Promise.resolve(MOCK_FRAMEWORKS))
    },
  }
});

describe('SelectFrameworkModal', () => {
  // Insert a div element with id='portal' since react portals needs this element
  // to mount on.
  beforeEach(() => {
    let portalRoot = document.getElementById("portal");
    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.setAttribute('id', 'portal');
      document.body.appendChild(portalRoot);
    }
  });

  const handleCloseModal = vi.fn();
  it('renders the select framework modal', () => {
    render(
      <SelectFrameworkModal
        handleCloseModal={handleCloseModal}
      />,
      { wrapper: BrowserRouter }
    );
    expect(screen.getByRole('heading', { name: 'Select Framework' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('renders the frameworks list', async () => {
    render(
      <SelectFrameworkModal
        handleCloseModal={handleCloseModal}
      />,
      { wrapper: BrowserRouter }
    );
    await waitFor(() => {
      // I'd look for a real text here that is renderer when the data loads
      expect(screen.getAllByTestId('framework-item')).toBeDefined();
    })
    const frameList = screen.getAllByTestId('framework-item');
    expect(frameList.length).toBe(3);
    expect(frameList[0].textContent).toBe('Frame 1');
    expect(frameList[1].textContent).toBe('Frame 2');
    expect(frameList[2].textContent).toBe('Frame 3');
  });

  it('closes the modal when the close button is clicked.', () => {
    render(
      <SelectFrameworkModal
        handleCloseModal={handleCloseModal}
      />,
      { wrapper: BrowserRouter }
    );
    const closeBtn = screen.getByRole('button', { name: 'Close Modal' });
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(handleCloseModal).toHaveBeenCalledOnce();
  });

  it('apply button is disabled initially', () => {
    render(
      <SelectFrameworkModal
        handleCloseModal={handleCloseModal}
      />,
      { wrapper: BrowserRouter }
    );
    const applyBtn = screen.getByRole('button', { name: 'Apply' });
    expect(applyBtn).toBeDisabled();
  });

  it('apply button is enabled after selecting framework', async () => {
    render(
      <SelectFrameworkModal
        handleCloseModal={handleCloseModal}
      />,
      { wrapper: BrowserRouter }
    );
    await waitFor(() => {
      // I'd look for a real text here that is renderer when the data loads
      expect(screen.getAllByTestId('framework-item')).toBeDefined();
    })
    const applyBtn = screen.getByRole('button', { name: 'Apply' });
    expect(applyBtn).toBeDisabled();
    const frameList = screen.getAllByTestId('framework-item');
    fireEvent.click(frameList[0]);
    expect(applyBtn).toBeEnabled();
  });

  it('submitting in the modal search bar works', () => {
    render(
      <SelectFrameworkModal
        handleCloseModal={handleCloseModal}
      />,
      { wrapper: BrowserRouter }
    );
    const searchBtn = screen.getByRole('button', { name: 'Search Button' });
    expect(searchBtn).toBeInTheDocument();
  });
});