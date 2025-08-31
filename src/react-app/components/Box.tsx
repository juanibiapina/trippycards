/**
 * Props for the Box component
 */
interface BoxProps {
  /** Content to be rendered inside the styled container */
  children: React.ReactNode;
}

/**
 * A styled container component that provides consistent card-like styling.
 *
 * Features:
 * - White background with rounded corners
 * - Drop shadow for elevation
 * - Responsive width with maximum of medium size
 * - Generous padding for content spacing
 *
 * @example
 * ```tsx
 * <Box>
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </Box>
 * ```
 */
const Box = ({ children }: BoxProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
      {children}
    </div>
  );
};

export default Box;
