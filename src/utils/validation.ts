export const validateEmail = (email: string): string | undefined => {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) return 'Email is required';
  if (trimmedEmail !== email) return 'Email must not contain leading or trailing spaces';
  if (!trimmedEmail.includes('@')) return 'Email must contain "@" symbol';
  const [local, domain] = trimmedEmail.split('@');
  if (!local || !domain) return 'Invalid email format';
  if (!domain.includes('.')) return 'Email must contain a valid domain (e.g., example.com)';
  return undefined;
};

export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value.trim()) return `${fieldName} is required`;
  if (/[^a-zA-Zа-яА-ЯёЁ\s-]/.test(value)) return `${fieldName} must not contain special characters or numbers`;
  return undefined;
};

export const validateDateOfBirth = (date: string): string | undefined => {
  if (!date) return 'Date of birth is required';
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 13) return 'You must be at least 13 years old';
  if (age > 120) return 'Please enter a valid date of birth';
  return undefined;
};
