'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// TEXT COMPONENT
// A flexible typography component that applies our design system
// ═══════════════════════════════════════════════════════════════════════════

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body-large'
  | 'body'
  | 'body-small'
  | 'wisdom'
  | 'label'
  | 'caption'
  | 'overline';

type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'subtle'
  | 'gold'
  | 'wisdom'
  | 'courage'
  | 'temperance'
  | 'justice'
  | 'success'
  | 'warning'
  | 'error'
  | 'inherit';

type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'blockquote' | 'label';

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  as?: TextElement;
  children: ReactNode;
  glow?: boolean;
  gradient?: 'gold' | 'sunset' | 'wisdom' | 'growth' | 'insight';
  balance?: boolean;
  className?: string;
}

// Map variants to their CSS classes
const variantClasses: Record<TextVariant, string> = {
  h1: 'heading-1',
  h2: 'heading-2',
  h3: 'heading-3',
  h4: 'heading-4',
  h5: 'heading-5',
  h6: 'heading-6',
  'body-large': 'body-large',
  body: 'body-base',
  'body-small': 'body-small',
  wisdom: 'text-wisdom',
  label: 'text-label',
  caption: 'text-caption',
  overline: 'text-overline',
};

// Map variants to semantic HTML elements
const variantElements: Record<TextVariant, TextElement> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  'body-large': 'p',
  body: 'p',
  'body-small': 'p',
  wisdom: 'blockquote',
  label: 'span',
  caption: 'span',
  overline: 'span',
};

// Map colors to CSS classes
const colorClasses: Record<TextColor, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  muted: 'text-muted',
  subtle: 'text-subtle',
  gold: 'text-amber-400',
  wisdom: 'text-wisdom-color',
  courage: 'text-courage-color',
  temperance: 'text-temperance-color',
  justice: 'text-justice-color',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  inherit: '',
};

// Map gradient to CSS classes
const gradientClasses: Record<string, string> = {
  gold: 'gradient-text-gold',
  sunset: 'gradient-text-sunset',
  wisdom: 'gradient-text-wisdom',
  growth: 'gradient-text-growth',
  insight: 'gradient-text-insight',
};

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      variant = 'body',
      color = 'inherit',
      as,
      children,
      glow = false,
      gradient,
      balance = false,
      className = '',
    },
    ref
  ) => {
    // Build class string
    const classes = [
      variantClasses[variant],
      !gradient && color !== 'inherit' ? colorClasses[color] : '',
      gradient ? gradientClasses[gradient] : '',
      glow ? 'text-glow' : '',
      balance ? 'text-balanced' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Determine the element to render
    const element = as || variantElements[variant];

    // Render based on element type
    switch (element) {
      case 'h1':
        return <motion.h1 ref={ref as React.Ref<HTMLHeadingElement>} className={classes}>{children}</motion.h1>;
      case 'h2':
        return <motion.h2 ref={ref as React.Ref<HTMLHeadingElement>} className={classes}>{children}</motion.h2>;
      case 'h3':
        return <motion.h3 ref={ref as React.Ref<HTMLHeadingElement>} className={classes}>{children}</motion.h3>;
      case 'h4':
        return <motion.h4 ref={ref as React.Ref<HTMLHeadingElement>} className={classes}>{children}</motion.h4>;
      case 'h5':
        return <motion.h5 ref={ref as React.Ref<HTMLHeadingElement>} className={classes}>{children}</motion.h5>;
      case 'h6':
        return <motion.h6 ref={ref as React.Ref<HTMLHeadingElement>} className={classes}>{children}</motion.h6>;
      case 'span':
        return <motion.span ref={ref as React.Ref<HTMLSpanElement>} className={classes}>{children}</motion.span>;
      case 'blockquote':
        return <motion.blockquote ref={ref as React.Ref<HTMLQuoteElement>} className={classes}>{children}</motion.blockquote>;
      case 'label':
        return <motion.label ref={ref as React.Ref<HTMLLabelElement>} className={classes}>{children}</motion.label>;
      default:
        return <motion.p ref={ref as React.Ref<HTMLParagraphElement>} className={classes}>{children}</motion.p>;
    }
  }
);

Text.displayName = 'Text';

// ═══════════════════════════════════════════════════════════════════════════
// SPECIALIZED TEXT COMPONENTS
// Convenient wrappers for common use cases
// ═══════════════════════════════════════════════════════════════════════════

interface HeadingProps extends Omit<TextProps, 'variant'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 2, ...props }, ref) => {
    return <Text ref={ref} variant={`h${level}` as TextVariant} balance {...props} />;
  }
);

Heading.displayName = 'Heading';

// Wisdom quote component
interface WisdomProps extends Omit<TextProps, 'variant'> {
  author?: string;
}

export const Wisdom = forwardRef<HTMLQuoteElement, WisdomProps>(
  ({ children, author, className = '', ...props }, ref) => {
    return (
      <figure className={`space-y-2 ${className}`}>
        <Text ref={ref} variant="wisdom" {...props}>
          &ldquo;{children}&rdquo;
        </Text>
        {author && (
          <figcaption className="text-attribution">&mdash; {author}</figcaption>
        )}
      </figure>
    );
  }
);

Wisdom.displayName = 'Wisdom';

// Label component
export const Label = forwardRef<HTMLLabelElement, Omit<TextProps, 'variant'>>(
  (props, ref) => {
    return <Text ref={ref} variant="label" as="label" {...props} />;
  }
);

Label.displayName = 'Label';

export default Text;
