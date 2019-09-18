import { rgb } from 'd3-color'

/**
 * Utility to determine if color is valid or not.
 */
export const isValidColor = (color: string): boolean => rgb(color).displayable()