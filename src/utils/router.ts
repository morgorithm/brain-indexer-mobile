export class Router {
  public title: string = ''
  public route: string = ''

  navigate(title: string, route: string): void {
    document.dispatchEvent(
      new CustomEvent('before-navigate', {
        detail: {
          title: this.title,
          route: this.route,
        },
      })
    )

    history.pushState('', title, route ? route : '/')

    this.title = title
    this.route = route

    document.dispatchEvent(
      new CustomEvent('after-navigate', {
        detail: {
          title: this.title,
          route: this.route,
        },
      })
    )
  }
}
