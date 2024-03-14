import { UseFormReturn } from 'react-hook-form';

export const getDirtyValues = (form: UseFormReturn<any>) => {
  const dirtyFields = form.formState.dirtyFields;
  const values = form.getValues();

  return Object.keys(dirtyFields).reduce(
    (acc, key) => {
      const k = key as keyof typeof values as string;

      if (dirtyFields[k] === true) {
        acc[k] = values[k];
      }

      return acc;
    },
    {} as Partial<typeof values>,
  );
};
