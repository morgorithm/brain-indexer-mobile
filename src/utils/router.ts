export class Router {
  public title: string = ''
  public route: string = ''
  public params?: Record<string, any>

  navigate(title: string, route: string, params?: Record<string, any>, data: any = ''): void {
    document.dispatchEvent(
      new CustomEvent('before-navigate', {
        detail: {
          title: this.title,
          route: this.route,
          params: this.params,
        },
      })
    )

    const searchParams: string = this.buildSearchParams(params)
    history.pushState(data, title, route ? `${route}${searchParams ? `?${searchParams}` : ''}` : '/')

    this.title = title
    this.route = route
    this.params = params

    document.dispatchEvent(
      new CustomEvent('after-navigate', {
        detail: {
          title: this.title,
          route: this.route,
          params: this.params,
        },
      })
    )
  }

  private buildSearchParams(params?: Record<string, any>): string {
    if (params) {
      Object.keys(params).forEach((key: string) => {
        params[key] = JSON.stringify(params[key])
      })
      return new URLSearchParams(params).toString()
    } else {
      return ''
    }
  }

  static getURLSearchParams(): Record<string, any> {
    return Object.fromEntries(new URLSearchParams(location.search))
  }
}
