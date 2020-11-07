export const FormUtil = {
  serialize(form: HTMLFormElement) {
    return Object.fromEntries(new FormData(form))
  },
}
