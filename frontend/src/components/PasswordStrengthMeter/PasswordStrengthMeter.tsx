import React from 'react';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';

interface PasswordStrengthMeterProps {
  password: string;
}

/**
 * PasswordStrengthMeter Component
 *
 * This component evaluates and displays the strength of the provided password. It uses the `zxcvbn` library to assess the password strength
 * and provides visual feedback and tips for improving the password based on its score.
 *
 */
const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const testResult: ZXCVBNResult = zxcvbn(password);
  const num = ((testResult.score + 1) * 100) / 5; // Convert score to a percentage

  /**
   * Creates a label for the password strength based on the test result.
   */
  const createPasswordLabel = (result: ZXCVBNResult) => {
    let label;
    switch (result.score) {
      case 0:
        label =
          'Please choose a stronger password ✖ \nTips: Make it longer, add numbers, symbols, and mix uppercase and lowercase letters';
        break;
      case 1:
        label =
          'Please choose a stronger password ✖ \nTips: Make it longer, add numbers, symbols, and mix uppercase and lowercase letters';
        break;
      case 2:
        label =
          'Please choose a stronger password ✖ \nTips: Make it longer, add numbers, symbols, and mix uppercase and lowercase letters';
        break;
      case 3:
        label = 'Good ✔';
        break;
      case 4:
        label = 'Strong ✔';
        break;
      default:
        label = '';
    }

    // Split the label by \n and map to JSX elements
    return label.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  /**
   * Determines the color of the progress bar based on the password strength score.
   *
   * @returns {string} - The color of the progress bar.
   */
  const progressColor = () => {
    switch (testResult.score) {
      case 0:
        return '#ef4444';
      case 1:
        return '#ef4444';
      case 2:
        return '#e2b203';
      case 3:
        return '#0a9dff';
      case 4:
        return '#6cb04f';
      default:
        return 'none';
    }
  };

  /**
   * Defines the style for the password strength progress bar.
   *
   */
  const changePasswordColor = () => ({
    width: `${num}%`,
    background: progressColor(),
    height: '5px',
  });

  return (
    <div>
      <div>
        <div style={changePasswordColor()}></div>
      </div>
      <p style={{ fontFamily: 'Roboto', fontWeight: 300, color: progressColor(), marginTop: '5px' }}>
        {createPasswordLabel(testResult)}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
