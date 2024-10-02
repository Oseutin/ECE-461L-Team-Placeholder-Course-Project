import PropTypes from 'prop-types';

const Button = ({ label, onClick, variant = 'primary', size = 'medium', disabled = false }) => {
  const baseStyles = 'focus:outline-none focus:ring-2 focus:ring-offset-2 rounded transition duration-150 ease-in-out';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    small: 'text-sm px-3 py-1.5',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-5 py-3',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onClick} // Correctly sets onClick based on disabled prop
      disabled={disabled} // Sets the button's disabled attribute
    >
      {label}
    </button>
  );
};

// PropTypes for the Button component
Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
};

export default Button;
