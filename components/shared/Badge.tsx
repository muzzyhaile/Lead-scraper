/**
 * Badge Component
 * Status indicators and labels
 */

import React from 'react';
import { PipelineStage } from '../../types/domain/lead';
import { STAGE_COLORS } from '../../constants/statuses';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const classes = [
    'inline-flex items-center font-medium rounded-full',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(' ');

  return <span className={classes}>{children}</span>;
}

export interface StageBadgeProps {
  stage: PipelineStage;
  className?: string;
}

export function StageBadge({ stage, className = '' }: StageBadgeProps) {
  const stageColor = STAGE_COLORS[stage] || STAGE_COLORS.New;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-sm font-medium rounded-full ${stageColor} ${className}`}>
      {stage}
    </span>
  );
}

export interface QualityBadgeProps {
  score: number;
  className?: string;
}

export function QualityBadge({ score, className = '' }: QualityBadgeProps) {
  let variant: 'success' | 'warning' | 'error' | 'default' = 'default';
  
  if (score >= 80) variant = 'success';
  else if (score >= 60) variant = 'success';
  else if (score >= 40) variant = 'warning';
  else variant = 'error';

  return (
    <Badge variant={variant} className={className}>
      {score}/100
    </Badge>
  );
}
