export class Router {
  public route: string = ''
  public params?: Record<string, any>

  navigate(title: string, route: string, params?: Record<string, any>, data: any = ''): void {
    debugger
    document.dispatchEvent(
      new CustomEvent('before-navigate', {
        detail: {
          route: this.route,
          params: this.params,
        },
      })
    )

    const searchParams: string = this.buildSearchParams(params)
    history.pushState(data, title, route ? `${route}${searchParams ? `?${searchParams}` : ''}` : '/')

    this.route = route
    this.params = params

    document.dispatchEvent(
      new CustomEvent('after-navigate', {
        detail: {
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
    const params: Record<string, any> = Object.fromEntries(new URLSearchParams(location.search))
    Object.keys(params).forEach((key: string) => {
      params[key] = JSON.parse(params[key])
    })

    return params
  }
}
