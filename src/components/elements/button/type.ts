export interface ButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  theme?: string;
  title?: string;
  disabled?: boolean;
  children: React.ReactNode;
}
