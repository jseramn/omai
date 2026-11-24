import type { ComponentPropsWithRef } from 'react';
import { cn } from '../utils/cn';

export interface CardProps extends ComponentPropsWithRef<'div'> {
  variant?: 'surface' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export function Card({
  ref,
  className,
  variant = 'surface',
  padding = 'md',
  interactive = false,
  ...rest
}: CardProps) {
  return (
    <div
      ref={ref}
      className={cn('omai-card', className)}
      data-variant={variant}
      data-padding={padding}
      data-interactive={interactive ? '' : undefined}
      {...rest}
    />
  );
}

export type CardHeaderProps = ComponentPropsWithRef<'div'>;

export function CardHeader({ ref, className, ...rest }: CardHeaderProps) {
  return <div ref={ref} className={cn('omai-card__header', className)} {...rest} />;
}

export type CardTitleProps = ComponentPropsWithRef<'h3'>;

export function CardTitle({ ref, className, ...rest }: CardTitleProps) {
  return <h3 ref={ref} className={cn('omai-card__title', className)} {...rest} />;
}

export type CardDescriptionProps = ComponentPropsWithRef<'p'>;

export function CardDescription({ ref, className, ...rest }: CardDescriptionProps) {
  return <p ref={ref} className={cn('omai-card__description', className)} {...rest} />;
}

export type CardContentProps = ComponentPropsWithRef<'div'>;

export function CardContent({ ref, className, ...rest }: CardContentProps) {
  return <div ref={ref} className={cn('omai-card__content', className)} {...rest} />;
}

export type CardFooterProps = ComponentPropsWithRef<'div'>;

export function CardFooter({ ref, className, ...rest }: CardFooterProps) {
  return <div ref={ref} className={cn('omai-card__footer', className)} {...rest} />;
}
