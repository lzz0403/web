import type { App, ThemeConfig, ThemeInfo } from '../types'
import { resolvePluginsFromConfig } from './resolvePluginsFromConfig'
import { resolveThemeLayouts } from './resolveThemeLayouts'
import { resolveThemeObject } from './resolveThemeObject'

/**
 * Resolve theme info and its parent theme info
 */
export const resolveThemeInfo = (
  app: App,
  theme: string,
  themeConfig: ThemeConfig
): ThemeInfo => {
  // resolve current theme info
  const themeObject = resolveThemeObject(app, theme, themeConfig)
  const themeInfo = {
    layouts: resolveThemeLayouts(themeObject.layouts),
    plugins: [
      ...resolvePluginsFromConfig(app, themeObject.plugins),
      themeObject,
    ],
  }

  // return if current theme does not have a parent theme
  if (!themeObject.extends) {
    return themeInfo
  }

  // resolve parent theme info recursively
  const parentThemeInfo = resolveThemeInfo(
    app,
    themeObject.extends,
    themeConfig
  )
  return {
    layouts: { ...parentThemeInfo.layouts, ...themeInfo.layouts },
    plugins: [...parentThemeInfo.plugins, ...themeInfo.plugins],
  }
}
