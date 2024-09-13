import React from 'react';
import Modal from '../Modal';

interface Props {
  handleCloseModal: () => void;
  info: string;
}

/**
 * HelpInfoModal Component
 *
 * This component displays a modal with help information. The `info` prop contains the text to be shown in the modal,
 * which can include bold text (enclosed in double quotes) and numbered list items. The component processes the
 * `info` string to apply appropriate formatting and renders it inside a modal.
 *
 */
const HelpInfoModal: React.FC<Props> = ({ handleCloseModal, info }) => {
  const lines = info.split('\n');

  const infoLines = lines.map((line, index) => {
    // Split the line based on backticks to handle bolding
    const parts = line
      .split(/("[^"]+")/)
      .map((part, i) =>
        part.startsWith('"') && part.endsWith('"') ? <strong key={i}>{part.slice(1, -1)}</strong> : part
      );

    // Check if the line starts with a number followed by a period indicating a list item
    const matches = line.match(/^(\d+\.\s*)(.*)/);

    return (
      <p key={index} style={{ marginBottom: '1em' }}>
        {matches ? (
          <>
            <strong>{matches[1]}</strong>
            {parts}
          </>
        ) : (
          parts
        )}
      </p>
    );
  });

  return (
    <Modal title="How To Use This Page" handleCloseModal={handleCloseModal}>
      {infoLines}
    </Modal>
  );
};

export default HelpInfoModal;
