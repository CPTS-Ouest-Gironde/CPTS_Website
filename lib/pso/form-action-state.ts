export type FormActionState<FieldName extends string = string> = {
  fieldErrors: Partial<Record<FieldName, string[]>>
  formError: string | null
}

export function createEmptyFormActionState<FieldName extends string = string>(): FormActionState<FieldName> {
  return {
    fieldErrors: {},
    formError: null,
  }
}
